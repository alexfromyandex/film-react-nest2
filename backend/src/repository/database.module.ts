import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseRepository } from './database.repository';
import { Film } from '../films/schemas/film.entity';
import { Schedule } from '../films/schemas/schedule.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const url = new URL(databaseUrl);
        const hostname = url.hostname; // || 'localhost';
        const port = Number(url.port); // || 5432;
        const database = url.pathname.slice(1); // || 'prac';
        console.log(url);
        console.log('--> ', hostname);
        console.log('--> ', port);
        console.log('--> ', database);
        console.log(configService.get<string>('DATABASE_USERNAME'));
        console.log(configService.get<string>('DATABASE_PASSWORD'));

        return {
          type: configService.get('DATABASE_DRIVER') as 'postgres',
          host: '127.0.0.1',
          port: port,
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: database,
          entities: [Film, Schedule],
          synchronize: false,
          retryAttempts: 10,
          retryDelay: 3000,
        }
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  providers: [DatabaseRepository],
  exports: [DatabaseRepository],
})
export class FilmsDatabaseModule {}
