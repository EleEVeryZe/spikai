interface DeepSeekResponse {
  choices?: Array<{
    message?: {
      content: string;
    };
  }>;
  usage?: {
    total_tokens: number;
  };
}

export const environment = {
  production: false,
  deepSeekApiKey: 'sk-2a4144829a9946fc9d01b0e8be0bf98d',
};

export class Tutor {
  DEEPSEEK_CONFIG = {
    API_URL: 'https://api.deepseek.com/v1/chat/completions',
    MODEL: 'deepseek-chat',
    MAX_RETRIES: 5,
    INITIAL_DELAY: 1000,
    MAX_TOKENS: 1000,
    TEMPERATURE: 0,
  } as const;

  async askDeepSeek(prompt: string): Promise<string> {
    const apiKey = this.getDeepSeekApiKey();
    let delay = this.DEEPSEEK_CONFIG.INITIAL_DELAY;

    for (let attempt = 0; attempt < this.DEEPSEEK_CONFIG.MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(this.DEEPSEEK_CONFIG.API_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.DEEPSEEK_CONFIG.MODEL,
            messages: [{ role: 'user', content: prompt }],
            temperature: this.DEEPSEEK_CONFIG.TEMPERATURE,
            max_tokens: this.DEEPSEEK_CONFIG.MAX_TOKENS,
          }),
        });

        if (!response.ok) {
          if (response.status === 429 && attempt < this.DEEPSEEK_CONFIG.MAX_RETRIES - 1) {
            await this.delay(delay);
            delay *= 2;
            continue;
          }
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const result: DeepSeekResponse = await response.json();

        if (!result.choices?.[0]?.message?.content) {
          throw new Error('Invalid response format from API');
        }

        return result.choices[0].message.content.trim();
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        if (attempt === this.DEEPSEEK_CONFIG.MAX_RETRIES - 1) {
          throw new Error('Unable to generate vocabulary after multiple attempts.');
        }
        await this.delay(delay);
        delay *= 2;
      }
    }

    throw new Error('Unexpected error in API call');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getDeepSeekApiKey(): string {
    return environment.deepSeekApiKey;
  }
}
