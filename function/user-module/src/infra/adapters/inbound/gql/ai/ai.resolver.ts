import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { AuthResponse } from '@/application/use-cases/login/dto/auth.response';
import { EnqueueUseCase } from '@/application/use-cases/queue/enqueue.use-case';

@Resolver(() => AuthResponse)
export class AIResolver {

    constructor(private readonly aiUseCase: EnqueueUseCase) { }

    @Mutation(() => String, { name: 'prompt' })
    async prompt(@Args("prompt") prompt: string) {
        return this.aiUseCase.execute(prompt);
    }
    
    @Query(() => String)
    healthCheck() {
        return 'User service is online';
    }
}

