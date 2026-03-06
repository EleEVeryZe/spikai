export abstract class IMessageQueue {
   abstract producePrompt(promt: string): Promise<string>;
   abstract processAiTask(payload: { jobId: string; prompt: string });
}
       