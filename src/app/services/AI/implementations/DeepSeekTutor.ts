import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';
import { BaseAITutorAdapter } from '../tutor.service';

@Injectable()
export class DeepSeekAdapter extends BaseAITutorAdapter {
  protected async executeRequest(prompt: string) {
    return firstValueFrom(
      this.http.post(
        'https://kty7yx7ltk.execute-api.sa-east-1.amazonaws.com/default/askDeepSeek',
        { prompt },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );
  }

  protected extractContent(json: any): any {
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
}
