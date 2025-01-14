import { Controller, Request, Get } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private characterService: AiService) {}

  @Get('/questions')
  getList(@Request() req) {
    const { page, question, containerID } = req.query;
    return this.characterService.getQuestions(page, question, containerID);
  }
}
