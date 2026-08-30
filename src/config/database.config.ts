import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],

  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    const isProduction =
      configService.getOrThrow<string>('NODE_ENV') === 'production';

    return {
      type: 'postgres',
      host: configService.getOrThrow<string>('DATABASE_HOST'),
      port: configService.getOrThrow<number>('DATABASE_PORT'),
      username: configService.getOrThrow<string>('DATABASE_USERNAME'),
      password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
      database: configService.getOrThrow<string>('DATABASE_NAME'),
      namingStrategy: new SnakeNamingStrategy(),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: !isProduction,
      logging: !isProduction,
    };
  },
};
