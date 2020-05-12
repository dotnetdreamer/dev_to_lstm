import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get('predict')
  predict(@Query() args: { description }) {
    if(!args.description) {
      return 'description must be passed';
    }

    return this.appService.predict(args.description);
  }

  @Get('build')
  build() {
    return this.appService.build();
  }
}
