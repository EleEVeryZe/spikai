import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { AuthResponse } from '@/application/use-cases/login/dto/auth.response';
import { EnqueueUseCase } from '@/application/use-cases/queue/enqueue.use-case';
import { PromptResponse } from './dto/promptResponse';

@Resolver(() => AuthResponse)
export class AIResolver {

    constructor(private readonly aiUseCase: EnqueueUseCase) { }

    @Mutation(() => PromptResponse, { name: 'prompt' })
    async prompt(@Args("prompt") prompt: string) {
        return (await this.aiUseCase.execute(prompt)) as PromptResponse;
    }
    
    @Query(() => String)
    healthCheck() {
        return 'User service is online';
    }
}

