import { Module } from '@nestjs/common';
import { DatabaseModule } from '@core';
import { UserModule, ProductModule, OrderModule } from '@modules';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    ProductModule,
    OrderModule,
  ],
})
export class AppModule {}
