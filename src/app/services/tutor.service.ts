interface PerformanceMetrics {
  totalTime: number;
  requestTime: number;
  parsingTime: number;
  sizeBytes: number;
  serverTime?: number;
  networkTime?: number;
}

export class AITutor {
  private readonly CONFIG = {
    API_URL: 'https://kty7yx7ltk.execute-api.sa-east-1.amazonaws.com/default/askDeepSeek',
    MAX_RETRIES: 3,
    TIMEOUT_MS: 30000,
  } as const;

  private debugMode = true;
  private cache = new Map<string, any>();

  async askDeepSeek(prompt: string): Promise<any> {
    const hashedPrompt = await this.hashString(prompt);
    if (this.cache.has(hashedPrompt)) {
      this.logDebug('Cache Hit', hashedPrompt);
      return this.cache.get(hashedPrompt);
    }

    const startTime = performance.now();
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.CONFIG.MAX_RETRIES; attempt++) {
      try {
        const result = await this.executeRequest(prompt, startTime);
        this.cache.set(hashedPrompt, result);
        return result;
      } catch (error) {
        lastError = error as Error;
        this.logDebug(`Attempt ${attempt} failed`, error);
        if (attempt < this.CONFIG.MAX_RETRIES) {
           // Exponential backoff: 1s, 2s...
           await new Promise(res => setTimeout(res, 1000 * attempt));
        }
      }
    }

    throw new Error(`Failed after ${this.CONFIG.MAX_RETRIES} attempts. Original error: ${lastError?.message}`);
  }

  private async executeRequest(prompt: string, startTime: number) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.CONFIG.TIMEOUT_MS);

    try {
      const requestStart = performance.now();
      const response = await fetch(this.CONFIG.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: controller.signal
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const rawText = await response.text();
      const parseStart = performance.now();
      const json = JSON.parse(rawText);
      
      const content = this.extractContent(json);
      const parsingTime = performance.now() - parseStart;

      this.finalizeMetrics(startTime, requestStart, rawText.length, parsingTime, json);

      return content;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private extractContent(json: any): any {
    const rawContent = json.content ?? json;
    if (typeof rawContent !== 'string') return rawContent;

    const cleaned = rawContent
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      return cleaned;
    }
  }

  private async hashString(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private finalizeMetrics(start: number, reqStart: number, size: number, pTime: number, json: any) {
    if (!this.debugMode) return;

    const totalTime = performance.now() - start;
    const requestTime = performance.now() - reqStart;

    const metrics: PerformanceMetrics = {
      totalTime,
      requestTime,
      parsingTime: pTime,
      sizeBytes: size,
    };

    if (json.serverTimestamp) {
      metrics.serverTime = json.serverTimestamp - reqStart;
      metrics.networkTime = requestTime - metrics.serverTime;
    }

    this.printMetrics(metrics);
  }

  private printMetrics(m: PerformanceMetrics) {
    console.group('📊 DeepSeek Metrics');
    console.table({
      'Total (ms)': m.totalTime.toFixed(2),
      'Network (ms)': m.networkTime?.toFixed(2) ?? 'N/A',
      'Server (ms)': m.serverTime?.toFixed(2) ?? 'N/A',
      'Size (bytes)': m.sizeBytes
    });
    console.groupEnd();
  }

  private logDebug(m: string, d?: any) {
    if (this.debugMode) console.log(`[AITutor] ${m}`, d || '');
  }
}