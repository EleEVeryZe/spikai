import { ObjectType, Field, ID, Int, Float, InputType } from '@nestjs/graphql';

// ==========================================
// OBJECT TYPES (Para consultas - Queries)
// ==========================================

@ObjectType()
export class ProdutoGql {
  @Field() nome: string;
  @Field() descricao: string;
  @Field() marca: string;
  @Field() modelo: string;
  @Field(() => Int) ano: number;
  @Field({ nullable: true }) observacao?: string;
  @Field() ehNovo: boolean;
  @Field(() => [String]) midias: string[];
}

@ObjectType()
export class CotacaoGql {
  @Field(() => ID) id: string;
  @Field() data: string;
  @Field(() => Float) valor: number;
  @Field({ nullable: true }) link?: string;
  @Field() contato: string;
  @Field({ nullable: true }) observacao?: string;
  @Field(() => [String], { nullable: 'itemsAndList' }) midias?: string[];
}

@ObjectType()
export class VendaGql {
  @Field(() => Float) valorVenda: number;
  @Field(() => [String], { nullable: 'itemsAndList' }) midias?: string[];
  @Field() dataVenda: string;
  @Field() codUnitario: string;
  @Field() intencaoId: string;
}

@ObjectType()
export class ItemEfetivadoGql {
  @Field(() => ID) intencaoId: string;
  @Field({ nullable: true }) cotacaoId: string;
  @Field(() => Float) valorCompraUnitario: number;
  @Field(() => Int) quantidade: number;
  @Field() dataCompra: string;
  @Field(() => [String])
  codigosUnitarios: string[];
  @Field() status: string; // 'EM_ESTOQUE' | 'VENDIDO' etc.
  @Field(() => VendaGql, { nullable: true }) venda: VendaGql | null;
  @Field(() => [String], { nullable: 'itemsAndList' })
  midiasPorItem: string[][];
}

@ObjectType()
export class IntencaoCompraGql {
  @Field(() => ID) id: string;
  @Field(() => ProdutoGql) produto: ProdutoGql;
  @Field(() => [CotacaoGql]) cotacoes: CotacaoGql[];
  @Field(() => [ItemEfetivadoGql]) efetivados: ItemEfetivadoGql[];
}

@InputType()
export class ProdutoInput {
  @Field() nome: string;
  @Field() descricao: string;
  @Field() marca: string;
  @Field() modelo: string;
  @Field(() => Int) ano: number;
  @Field() ehNovo: boolean;
  @Field({ nullable: true }) observacao?: string;
  @Field(() => [String], { nullable: 'itemsAndList' }) midias?: string[];
}

// ==========================================
// INPUT TYPES (Para envios de dados - Mutations)
// ==========================================

@InputType()
export class AtualizarProdutoInput {
  @Field(() => ID) intencaoId: string;
  @Field() nome: string;
  @Field() descricao: string;
  @Field() marca: string;
  @Field() modelo: string;
  @Field(() => Int) ano: number;
  @Field() ehNovo: boolean;
  @Field({ nullable: true }) observacao?: string;
  @Field(() => [String]) midias: string[];
}

@InputType()
export class CotacaoInput {
  @Field(() => ID) intencaoId: string;
  @Field(() => Float)
  valor: number;

  @Field({ nullable: true })
  link?: string;

  @Field()
  contato: string;

  @Field({ nullable: true })
  observacao?: string;

  @Field(() => [String], { nullable: 'itemsAndList' })
  midias?: string[];
}

@InputType()
export class EfetivarCompraParcialInput {
  @Field(() => ID)
  intencaoId: string;

  @Field(() => ID)
  cotacaoId: string;

  @Field(() => Int)
  quantidade: number;

  @Field(() => Float)
  valorCompraUnitario: number;

  @Field(() => [String])
  codigosUnitarios: string[];

  @Field(() => [[String]], { nullable: 'itemsAndList' })
  midiasPorItem?: string[][];

  @Field()
  status: string;
}

@InputType()
export class RegistrarVendaInput {
  @Field(() => ID)
  intencaoId: string;

  @Field()
  codUnitario: string;

  @Field(() => Float)
  valorVenda: number;

  @Field(() => [String], { nullable: true })
  midias?: string[];

  @Field()
  dataVenda: string;
}
