import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [CategoriesModule, SuppliersModule, ProductsModule],
})
export class InventoryModule {}
