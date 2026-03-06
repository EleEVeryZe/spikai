import { IMessageQueue } from "@/domain/ports/message.queue.port";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class AIUseCase {
    constructor(@Inject(IMessageQueue) private readonly aiMessageQueue: IMessageQueue ) { }

    sendPromt(promt: string) : Promise<string> {
       return this.aiMessageQueue.producePrompt(promt); 
    }
}