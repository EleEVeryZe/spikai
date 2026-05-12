import { Inject, Injectable, Logger } from '@nestjs/common';
import * as intencaoCompraServicePort from '@/domain/ports/intencao-compra-service.port';
import { IntencaoCompra } from '@/domain/entity/intencao-compra';
import {
  EfetivarCompraParcialOutput,
  IProduto,
  RegistrarCotacaoInput,
  RegistrarVendaInput,
} from '@/domain/ports/intencao-compra-service.port';
import { EfetivarCompraParcialInput } from '@/application/interfaces/intencao-compra';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GerenciarIntencaoCompraUseCase {
  private readonly logger = new Logger(GerenciarIntencaoCompraUseCase.name);

  constructor(
    @Inject('IS3IntencaoCompra')
    private readonly repository: intencaoCompraServicePort.IIntencaoCompraRepository,
  ) {}

  /**
   * Inicializa um novo arquivo de produto no S3
   */
  public async criarNovaIntencao(produto: IProduto): Promise<void> {
    try {
      const novaIntencao = new IntencaoCompra(uuidv4(), produto);
      await this.repository.salvar(novaIntencao);
      this.logger.log(
        `Intenção de compra do produto ${produto.nome} salva com sucesso`,
      );
    } catch (error: unknown) {
      let message = 'erro desconhecido';
      let stack: string | undefined;

      if (error instanceof Error) {
        message = error.message;
        stack = error.stack;
      }

      this.logger.error(`Erro ao salvar intenção de compra: ${message}`, stack);
      throw error;
    }
  }

  /**
   * Adiciona uma pesquisa de preço ao histórico do arquivo
   */
  public async registrarCotacao(
    input: RegistrarCotacaoInput,
  ): Promise<IntencaoCompra> {
    const intencao = await this.obterIntencaoOuFalhar(input.intencaoId);

    intencao.registrarCotacao({
      data: new Date().toISOString(),
      valor: input.valor,
      contato: input.contato,
      link: input.link,
      observacao: input.observacao,
    });

    await this.repository.salvar(intencao);
    return intencao;
  }

  /**
   * Divide a cotação gerando os itens físicos no estoque
   */
  public async efetivarCompraParcial(
    input: EfetivarCompraParcialInput,
  ): Promise<EfetivarCompraParcialOutput> {
    const intencao = await this.obterIntencaoOuFalhar(input.intencaoId);

    intencao.efetivarCompraParcial(
      input.cotacaoId,
      input.quantidade,
      input.valorCompraUnitario,
      input.codigosUnitarios,
    );

    await this.repository.salvar(intencao);

    return {
      intencaoId: intencao.id,
      quantidadeEmEstoque: intencao.quantidadeEmEstoque,
      totalEfetivados: intencao.efetivados.length,
    };
  }

  /**
   * Localiza um item físico por código e liquida a venda calculando lucro
   */
  public async registrarVenda(
    input: RegistrarVendaInput,
  ): Promise<IntencaoCompra> {
    const intencao = await this.obterIntencaoOuFalhar(input.intencaoId);

    intencao.registrarVenda(input.codUnitario, input.valorVenda, input.midias);

    await this.repository.salvar(intencao);
    return intencao;
  }

  /**
   * Busca uma intenção de compra pelo ID
   */
  public async buscarPorId(id: string): Promise<IntencaoCompra> {
    return await this.obterIntencaoOuFalhar(id);
  }

  /**
   * Método auxiliar privado para reaproveitar a validação de busca
   */
  private async obterIntencaoOuFalhar(id: string): Promise<IntencaoCompra> {
    const intencao = await this.repository.buscarPorId(id);
    if (!intencao) {
      throw new Error(`Arquivo de intenção de compra com ID ${id} não existe.`);
    }
    const intencao1 = new IntencaoCompra(intencao.id, intencao.produto); //TODO: remover essa implementação
    intencao1.cotacoes = intencao.cotacoes;
    intencao1.efetivados = intencao.efetivados;
    return intencao1;
  }
}
