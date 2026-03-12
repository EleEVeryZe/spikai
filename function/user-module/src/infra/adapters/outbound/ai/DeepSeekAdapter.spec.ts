import { DeepSeekAdapter } from './DeepSeekAdapter';
import { getSsmSecret } from '@/application/utils/ssm';

const testRealAPI = false;
jest.mock('@/application/utils/ssm', () => ({
    getSsmSecret: jest.fn(),
}));

describe('DeepSeekAdapter', () => {
    let adapter: DeepSeekAdapter;
    const mockApiKey = 'sk-2a414';

    beforeEach(() => {
        adapter = new DeepSeekAdapter();
        jest.clearAllMocks();

        (getSsmSecret as jest.Mock).mockResolvedValue(mockApiKey);

        if (!testRealAPI)
            global.fetch = jest.fn();
    });

    it('should call SSM only once and cache the API key', async () => {
        if (!testRealAPI)
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({ choices: [{ message: { content: 'Hi' } }] }),
            });

        await adapter.generateResponse('Hello');
        await adapter.generateResponse('Hello again');

        expect(getSsmSecret).toHaveBeenCalledTimes(1);
        expect(getSsmSecret).toHaveBeenCalledWith("/spkai/ai/deepseek");
    });

    it('should return content and usage on success', async () => {
        const mockResponse = {
            choices: [{ message: { content: 'DeepSeek Response' } }],
            usage: { total_tokens: 10 }
        };
        if (!testRealAPI)
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse),
            });
        const result = await adapter.generateResponse('Test prompt');

        expect(result.content).toBe('DeepSeek Response');
        expect(result.usage.total_tokens).toBe(10);
        expect(global.fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': `Bearer ${mockApiKey}`
                })
            })
        );
    });

    it('should throw an error when the API response is not ok', async () => {
        if (!testRealAPI)
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 502
            });

        await expect(adapter.generateResponse('Test')).rejects.toThrow();
    });
});