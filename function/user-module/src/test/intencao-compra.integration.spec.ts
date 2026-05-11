import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';

describe('IntencaoCompra Resolver - Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mockIntencaoCompraRepository = {
      salvar: jest.fn().mockResolvedValue(undefined),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('IS3IntencaoCompra')
      .useValue(mockIntencaoCompraRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Mutations', () => {
    it('should create a new intencao compra with required fields', async () => {
      const mutation = `
        mutation {
          criarIntencao(input: {
            id: "intencao-001"
            nome: "iPhone 14"
            descricao: "Smartphone Apple"
            marca: "Apple"
            modelo: "iPhone 14 Pro"
            ano: 2023
            ehNovo: true
          })
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation });

      expect(response.status).toBe(200);
      expect(response.body.data.criarIntencao).toBe(true);
      expect(response.body.errors).toBeUndefined();
    });

    it('should create intencao compra with optional observacao field', async () => {
      const mutation = `
        mutation {
          criarIntencao(input: {
            id: "intencao-002"
            nome: "MacBook Pro"
            descricao: "Laptop para desenvolvimento"
            marca: "Apple"
            modelo: "MacBook Pro 16"
            ano: 2024
            ehNovo: true
            observacao: "Preferência: 16GB RAM"
          })
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation });

      expect(response.status).toBe(200);
      expect(response.body.data.criarIntencao).toBe(true);
      expect(response.body.errors).toBeUndefined();
    });

    it('should create intencao compra with midias array', async () => {
      const mutation = `
        mutation {
          criarIntencao(input: {
            id: "intencao-003"
            nome: "Samsung Galaxy S24"
            descricao: "Smartphone Samsung top de linha"
            marca: "Samsung"
            modelo: "Galaxy S24 Ultra"
            ano: 2024
            ehNovo: true
            midias: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
          })
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation });

      expect(response.status).toBe(200);
      expect(response.body.data.criarIntencao).toBe(true);
      expect(response.body.errors).toBeUndefined();
    });

    it('should create intencao compra with all optional fields', async () => {
      const mutation = `
        mutation {
          criarIntencao(input: {
            id: "intencao-004"
            nome: "iPad Pro"
            descricao: "Tablet para design gráfico"
            marca: "Apple"
            modelo: "iPad Pro 12.9"
            ano: 2024
            ehNovo: false
            observacao: "Seminovo, excelente estado"
            midias: ["https://example.com/ipad1.jpg", "https://example.com/ipad2.jpg", "https://example.com/ipad3.jpg"]
          })
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation });

      expect(response.status).toBe(200);
      expect(response.body.data.criarIntencao).toBe(true);
      expect(response.body.errors).toBeUndefined();
    });

    it('should handle produto with ehNovo as false', async () => {
      const mutation = `
        mutation {
          criarIntencao(input: {
            id: "intencao-005"
            nome: "Notebook Dell"
            descricao: "Notebook usado para trabalho"
            marca: "Dell"
            modelo: "XPS 13"
            ano: 2022
            ehNovo: false
          })
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation });

      expect(response.status).toBe(200);
      expect(response.body.data.criarIntencao).toBe(true);
      expect(response.body.errors).toBeUndefined();
    });
  });
});
