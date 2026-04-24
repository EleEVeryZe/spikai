import { Module } from "@nestjs/common";
import { InterResolver } from "./inter.resolver";
@Module({
  providers: [
    InterResolver, 
  ],
})
export class InterModule {}