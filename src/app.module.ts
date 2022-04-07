import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MeModule } from './me/me.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HueService } from './services/hue.service';
import { VibageModule } from './vibage/vibage.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("DB_URI"),
      }),
    }),
    MeModule,
    VibageModule,
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService, HueService],
})
export class AppModule { }
