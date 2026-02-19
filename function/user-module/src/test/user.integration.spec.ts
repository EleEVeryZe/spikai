import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';


describe("User Module", () => {
    let app: INestApplication;
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();//.useGlobalPipes(new ValidationPipe());

        await app.init();
    })


    afterAll(async () => {
        await app.close();
    });

    it("Should retrieve users", async () => {
        const query = `
            query {
                getUser(id: 1) {
                    username
                }
            }
                `;

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({ query });

        expect(response.status).toBe(200);
    })
});