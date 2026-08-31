import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as fs from 'fs';
import * as path from 'path';

try {
  const envPath = path.resolve(process.cwd(), '.env.development');

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');

    envContent.split('\n').forEach((line) => {
      if (line.trim().startsWith('#') || !line.trim()) return;

      const [key, ...valueParts] = line.split('=');

      if (key && valueParts.length > 0) {
        const value = valueParts
          .join('=')
          .trim()
          .replace(/^['"]|['"]$/g, '');

        process.env[key.trim()] = value;
      }
    });
  }
} catch (error) {
  console.error('Failed to load .env.development file:', error);
}

export const AppDataSource = new DataSource({
  type: 'postgres',

  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,

  namingStrategy: new SnakeNamingStrategy(),

  entities: [__dirname + '/../**/*.entity{.ts,.js}'],

  migrations: [__dirname + '/migrations/*{.ts,.js}'],

  synchronize: false,

  logging: true,
});
