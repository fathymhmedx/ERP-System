import { Module } from '@nestjs/common';

import { SeederModule } from './seeders/seeders.module';

@Module({
  imports: [SeederModule],
})
export class DatabaseModule {}
