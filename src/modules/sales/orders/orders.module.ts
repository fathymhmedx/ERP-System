import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersModule } from '../customers/customers.module';

import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrderItemsRepository } from './repositories/order-items.repository';
import { OrdersRepository } from './repositories/orders.repository';
import { OrdersService } from './orders.service';
import { ProductsModule } from 'src/modules/inventory/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CustomersModule,
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersRepository, OrderItemsRepository, OrdersService],
  exports: [OrdersRepository],
})
export class OrdersModule {}
