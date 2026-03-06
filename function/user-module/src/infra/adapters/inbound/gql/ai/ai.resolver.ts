import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { AuthResponse } from '@/application/use-cases/login/dto/auth.response';
import { AIUseCase } from '@/application/use-cases/ai/ai.use-case';

@Resolver(() => AuthResponse)
export class AIResolver {

    constructor(private readonly aiUseCase: AIUseCase) { }

    @Mutation(() => String, { name: 'prompt' })
    async prompt(@Args("prompt") prompt: string) {
        return this.aiUseCase.sendPromt(prompt);
    }
    
    @Query(() => String)
    healthCheck() {
        return 'User service is online';
    }
}

