import { NestFactory } from '@nestjs/core';

import { PermissionsSeeder } from './seeders/permissions.seeder';
import { SuperAdminSeeder } from './seeders/super-admin.seeder';
import { RolePermissionsSeeder } from './seeders/role-permissions.seeder';
import { SeederModule } from './seeders/seeders.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);

  const seeders = [PermissionsSeeder, SuperAdminSeeder, RolePermissionsSeeder];

  for (const Seeder of seeders) {
    await app.get(Seeder).run();
  }

  await app.close();
}

void bootstrap();
