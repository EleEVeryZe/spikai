import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import {
  CotacaoInput,
  EfetivarCompraParcialInput,
  IntencaoCompraGql,
  ProdutoInput,
  RegistrarVendaInput,
} from './intencao-compra.graphql';
import { GerenciarIntencaoCompraUseCase } from '@/application/use-cases/intencaoCompra/intencaoCompra.use-case';

@Resolver(() => IntencaoCompraGql)
export class IntencaoCompraResolver {
  private readonly logger = new Logger(IntencaoCompraResolver.name);

  constructor(
    private readonly gerenciarUseCase: GerenciarIntencaoCompraUseCase,
  ) {}

  @Mutation(() => Boolean, { name: 'criarIntencao' })
  async criar(@Args('input') produto: ProdutoInput) {
    try {
      await this.gerenciarUseCase.criarNovaIntencao(produto);
      return true;
    } catch (error: unknown) {
      let message = 'erro desconhecido';
      let stack: string | undefined;

      if (error instanceof Error) {
        message = error.message;
        stack = error.stack;
      }

      this.logger.error(`Falha ao criar intenção de compra: ${message}`, stack);
      throw error;
    }
  }

  @Mutation(() => Boolean, { name: 'registrarCotacao' })
  async registrarCotacao(@Args('input') input: CotacaoInput) {
    try {
      await this.gerenciarUseCase.registrarCotacao(input);
      return true;
    } catch (error: unknown) {
      let message = 'erro desconhecido';
      let stack: string | undefined;

      if (error instanceof Error) {
        message = error.message;
        stack = error.stack;
      }

      this.logger.error(`Falha ao registrar cotação: ${message}`, stack);
      throw error;
    }
  }

  @Mutation(() => Boolean, { name: 'efetivarCompraParcial' })
  async efetivarCompraParcial(
    @Args('input') input: EfetivarCompraParcialInput,
  ) {
    try {
      await this.gerenciarUseCase.efetivarCompraParcial(input);
      return true;
    } catch (error: unknown) {
      let message = 'erro desconhecido';
      let stack: string | undefined;

      if (error instanceof Error) {
        message = error.message;
        stack = error.stack;
      }

      this.logger.error(`Falha ao efetivar compra parcial: ${message}`, stack);
      throw error;
    }
  }

  @Mutation(() => Boolean, { name: 'registrarVenda' })
  async registrarVenda(@Args('input') input: RegistrarVendaInput) {
    try {
      await this.gerenciarUseCase.registrarVenda(input);
      return true;
    } catch (error: unknown) {
      let message = 'erro desconhecido';
      let stack: string | undefined;

      if (error instanceof Error) {
        message = error.message;
        stack = error.stack;
      }

      this.logger.error(`Falha ao registrar venda: ${message}`, stack);
      throw error;
    }
  }
}
