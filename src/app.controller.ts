import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

const startTime = Date.now();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  get() {
    const requestTime = Date.now();
    return `Tyler Tracy's API
Start Time: ${startTime} ${new Date(startTime).toISOString()}
Current Time: ${requestTime} ${new Date(requestTime).toISOString()}
Uptime: ${requestTime - startTime} ms`;
  }

  @Get("/ping")
  ping(): string {
    return this.appService.ping();
  }
}
