import { getSsmSecret } from "@/application/utils/ssm";
import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as https from "https";

@Injectable()
export class InterUserUseCase {
    cert: string;
    key: string;
    clientId: string;
    clientSecret: string;

    constructor() {
    }

    async initCerts() {
        [
            this.cert,
            this.key,
            this.clientId,
            this.clientSecret
        ] = await Promise.all([
            getSsmSecret("/inter/certs/inter.crt"),
            getSsmSecret("/inter/certs/inter.key"),
            getSsmSecret("/inter/auth/clientId"),
            getSsmSecret("/inter/auth/clientSecret"),
        ]);
    }

    async execute() {
        const agent = new https.Agent({ cert: this.cert, key: this.key });

        try {
            const authParams = new URLSearchParams({
                'client_id': this.clientId,
                'client_secret': this.clientSecret,
                'grant_type': 'client_credentials',
                'scope': 'extrato.read'
            });

            const authResponse = await fetch('https://cdp.inter.co/oauth/v2/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: authParams.toString(),
                agent: agent
            } as any);

            if (!authResponse.ok) {
                const errorText = await authResponse.text();
                throw new Error(`Erro na autenticação: ${authResponse.status} - ${errorText}`);
            }

            const { access_token } = await authResponse.json();

            const dataInicio = '2026-01-01';
            const dataFim = '2026-01-07';
            const url = `https://cdp.inter.co/banking/v2/extrato?dataInicio=${dataInicio}&dataFim=${dataFim}`;

            const transactionsResponse = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                },
                agent: agent
            } as any);

            if (!transactionsResponse.ok) {
                const errorText = await transactionsResponse.text();
                throw new Error(`Erro ao buscar extrato: ${transactionsResponse.status} - ${errorText}`);
            }

            const data = await transactionsResponse.json();

            console.log(data);
            return {
                statusCode: 200,
                body: JSON.stringify(data),
            };

        } catch (error) {
            console.error('Falha na execução:', error.message);

            return {
                statusCode: 500,
                body: JSON.stringify({ error: error.message }),
            };
        }
    }
} 