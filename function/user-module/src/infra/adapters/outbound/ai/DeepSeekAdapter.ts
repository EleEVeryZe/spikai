import { getSsmSecret } from '@/application/utils/ssm';
import { AiServicePort } from '@/domain/ports/ai-service.port';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class DeepSeekAdapter implements AiServicePort {
  private readonly API_URL = 'https://api.deepseek.com/v1/chat/completions';
  private cachedAPIKey = "";

  async generateResponse(prompt: string) {

    if (!this.cachedAPIKey)
      this.cachedAPIKey = await getSsmSecret("/spkai/ai/deepseek");

    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.cachedAPIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text(); 

      console.error(`[DeepSeekAdapter] API Error:`, {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
        prompt: prompt.substring(0, 50) + '...',
      });

      throw new Error('DeepSeek API Failure');
    }

    const data = await response.json();
    return {
      content: data?.choices?.[0]?.message?.content,
      usage: data.usage,
    };
  }
}