import {
  Controller,
  Get,
  Param
} from '@nestjs/common';
import { ReceitawsService } from '../services/receitaws-service';

@Controller('receitaws')
export class ReceitawsController {
  constructor(private readonly receitaWs: ReceitawsService) { }

  @Get(':cnpj')
  consultar(@Param('cnpj') cnpj: string) {
    return this.receitaWs.consultar(cnpj);
  }
}