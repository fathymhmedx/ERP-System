import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';

import { RolesSeeder } from './seeders/roles.seeder';
import { PermissionsSeeder } from './seeders/permissions.seeder';
import { RolePermissionsSeeder } from './seeders/role-permissions.seeder';
import { SuperAdminSeeder } from './seeders/super-admin.seeder';
import { SeederModule } from './seeders/seeders.module';

async function bootstrap() {
  console.log(process.env.SUPER_ADMIN_EMAIL);
  const app = await NestFactory.createApplicationContext(SeederModule);

  const seeders = [
    RolesSeeder,
    PermissionsSeeder,
    RolePermissionsSeeder,
    SuperAdminSeeder,
  ];

  for (const Seeder of seeders) {
    await app.get(Seeder).run();
  }

  await app.close();
}

void bootstrap();
