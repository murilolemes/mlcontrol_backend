import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';

import { CreateClientService } from '../service/create-client.service';

import {
  createClientBodySchema,
  CreateClientDto,
} from '../dto/create-client.dto';

import { ZodValidationPipe } from '@/shared/pipes/zod-validation-pipe';

@Controller('/client')
export class CreateClientController {
  constructor(
    private readonly createClientService: CreateClientService,
  ) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createClientBodySchema))
  async handle(@Body() body: CreateClientDto) {
    return this.createClientService.execute(body);
  }
}