import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { IntencaoCompraResolver } from './intencao-compra.resolver';
import { S3IntencaoCompraRepository } from '@/infra/adapters/outbound/persistence/s3/S3IntencaoCompraRepository';
import { GerenciarIntencaoCompraUseCase } from '@/application/use-cases/intencaoCompra/intencaoCompra.use-case';

@Module({
  providers: [
    IntencaoCompraResolver,
    {
      provide: 'S3_CLIENT',
      useFactory: () => new S3Client({ region: 'sa-east-1' }),
    },
    {
      provide: 'IS3IntencaoCompra',
      useFactory: (s3Client: S3Client) =>
        new S3IntencaoCompraRepository(s3Client),
      inject: ['S3_CLIENT'],
    },
    {
      provide: GerenciarIntencaoCompraUseCase,
      useFactory: (repo: S3IntencaoCompraRepository) =>
        new GerenciarIntencaoCompraUseCase(repo),
      inject: ['IS3IntencaoCompra'],
    },
  ],
})
export class IntencaoCompraModule {}
