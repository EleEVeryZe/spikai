export abstract class AiServicePort {
  abstract generateResponse(prompt: string): Promise<{ content: string; usage: any }>;
}