import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { AITutorPort } from '../../ports/AITutor.port';

export abstract class BaseAITutorAdapter implements AITutorPort {
  protected http = inject(HttpClient);
  protected debugMode = true;
  
  private readonly CACHE_PREFIX = 'AI_CACHE_';

  async ask(prompt: string): Promise<any> {
    const startTime = performance.now();
    const hash = await this.generateHash(prompt);
    
    const cachedData = this.getFromCache(hash);
    if (cachedData) {
      this.logDebug('Cache Hit (LocalStorage)', { hash, preview: cachedData });
      return cachedData;
    }

    try {
      const requestStart = performance.now();
      const response = await this.executeRequest(prompt);
      const requestDuration = performance.now() - requestStart;

      const parseStart = performance.now();
      const result = this.extractContent(response);
      const parseDuration = performance.now() - parseStart;

      const totalTime = performance.now() - startTime;
      this.printMetrics({
        totalTime,
        requestTime: requestDuration,
        parsingTime: parseDuration,
        model: this.constructor.name
      });

      this.saveToCache(hash, result);
      
      return result;
    } catch (error) {
      console.error(`[${this.constructor.name}] Request failed:`, error);
      throw error;
    }
  }

  private getFromCache(hash: string): any {
    const data = localStorage.getItem(this.CACHE_PREFIX + hash);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }

  private saveToCache(hash: string, value: any): void {
    try {
      const serialized = typeof value === 'string' ? JSON.stringify(value) : JSON.stringify(value);
      localStorage.setItem(this.CACHE_PREFIX + hash, serialized);
    } catch (e) {
      console.warn('Could not save to AI Cache', e);
    }
  }

  protected abstract executeRequest(prompt: string): Promise<any>;
  protected abstract extractContent(res: any): any;

  private async generateHash(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private printMetrics(m: any) {
    if (!this.debugMode) return;
    console.group(`📊 Métricas: ${m.model}`);
    console.table({
      'Tempo total': `${m.totalTime.toFixed(2)}ms`,
      'Tempo API Request': `${m.requestTime.toFixed(2)}ms`,
      'Tempo Convertendo JSON': `${m.parsingTime.toFixed(2)}ms`,
    });
    console.groupEnd();
  }

  private logDebug(msg: string, data?: any) {
    if (this.debugMode) console.log(`%c[AI Debug] ${msg}`, 'color: #3498db; font-weight: bold;', data || '');
  }
}