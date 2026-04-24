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

    it("Should retrieve a user by ID", async () => {
        const mutation = `
            mutation {
            login(loginInput: { email: "dev@spikai.com", password: "testingPassword:" }) {
                access_token
               
            }
            }
        `; 

        const response = await request(app.getHttpServer())
            .post('/graphql')
            .send({ query: mutation });

        expect(response.status).toBe(200);
        expect(response.body.data.login.access_token).toBeDefined();
    });
});