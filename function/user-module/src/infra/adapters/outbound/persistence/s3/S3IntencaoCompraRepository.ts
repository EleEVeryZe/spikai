import {
  IIntencaoCompra,
  IIntencaoCompraRepository,
} from '@/domain/ports/intencao-compra-service.port';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Logger } from '@nestjs/common';

export class S3IntencaoCompraRepository implements IIntencaoCompraRepository {
  private readonly logger = new Logger(S3IntencaoCompraRepository.name);
  private readonly bucketName = 'spikai';
  private readonly fileKey = 'database.json';

  constructor(private readonly s3Client: S3Client) {}

  /**
   * Baixa todo o array do S3
   */
  private async baixarTodosOsDados(): Promise<IIntencaoCompra[]> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: this.fileKey,
    });

    this.logger.log(`Buscando intenções de compra no S3: ${this.fileKey}`);

    try {
      const response = await this.s3Client.send(command);
      const streamToString = await response.Body?.transformToString('utf-8');

      if (!streamToString) {
        this.logger.log(
          'Nenhum arquivo encontrado no S3, retornando lista vazia',
        );
        return [];
      }

      const parsed = JSON.parse(streamToString) as IIntencaoCompra[];
      this.logger.log(`Encontradas ${parsed.length} intenções de compra no S3`);
      return parsed;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'NoSuchKey') {
        this.logger.log('Arquivo S3 não encontrado, inicializando lista vazia');
        return [];
      }

      const message =
        error instanceof Error ? error.message : 'erro desconhecido';
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Erro ao acessar o banco no S3: ${message}`, stack);
      throw new Error(`Erro ao acessar o banco no S3: ${message}`);
    }
  }

  /**
   * SALVA OU ALTERA: Se o ID já existir no array, substitui. Se não, adiciona.
   */
  public async salvar(intencao: IIntencaoCompra): Promise<void> {
    const todos = await this.baixarTodosOsDados();

    const index = todos.findIndex((item) => item.id === intencao.id);

    if (index !== -1) {
      todos[index] = intencao;
    } else {
      todos.push(intencao);
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: this.fileKey,
      Body: JSON.stringify(todos, null, 2),
      ContentType: 'application/json',
    });

    this.logger.log(`Gravando ${todos.length} intenções de compra no S3`);

    try {
      await this.s3Client.send(command);
      this.logger.log('Intenções de compra salvas com sucesso no S3');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'erro desconhecido';
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Falha ao salvar banco central no S3: ${message}`,
        stack,
      );
      throw new Error(`Falha ao salvar banco central no S3: ${message}`);
    }
  }

  /**
   * Busca uma intenção de compra pelo ID
   */
  public async buscarPorId(id: string): Promise<IIntencaoCompra | null> {
    this.logger.log(`Buscando intenção de compra com ID: ${id}`);

    try {
      const todos = await this.baixarTodosOsDados();
      const intencao = todos.find((item) => item.id === id);

      if (!intencao) {
        this.logger.log(`Intenção de compra com ID ${id} não encontrada`);
        return null;
      }

      this.logger.log(`Intenção de compra com ID ${id} encontrada`);
      return intencao;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'erro desconhecido';
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Erro ao buscar intenção de compra com ID ${id}: ${message}`,
        stack,
      );
      throw new Error(
        `Erro ao buscar intenção de compra com ID ${id}: ${message}`,
      );
    }
  }
}
