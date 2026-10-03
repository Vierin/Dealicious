import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { ApiErrorFilter } from "./api-error.filter";
import { DealiciousController } from "./dealicious.controller";
import { SupabaseMiddleware } from "./supabase.middleware";

@Module({
  controllers: [DealiciousController],
  providers: [{ provide: APP_FILTER, useClass: ApiErrorFilter }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SupabaseMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
