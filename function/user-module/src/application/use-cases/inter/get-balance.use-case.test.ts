import { InterUserUseCase } from "./get-balance.use-case"

describe("InterUserUseCase (Integration)", () => {
    let useCase: InterUserUseCase;

    beforeAll(async () => {
        useCase = new InterUserUseCase();

        await useCase.initCerts();
    });

    it("deve buscar dados reais da API do Inter", async () => {
        const result = await useCase.execute();

        expect(result.statusCode).toBe(200);

        const body = JSON.parse(result.body);

        expect(body).toHaveProperty('transacoes');
        expect(Array.isArray(body.transacoes)).toBe(true);

        console.log('Transações reais encontradas:', body.transacoes.length);
    }, 30000);
});