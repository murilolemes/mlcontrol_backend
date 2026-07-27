import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ReceitawsController } from './receitaws/controller/receitaws-controller';
import { ReceitawsService } from './receitaws/services/receitaws-service';

@Module({
  imports: [HttpModule],
  controllers: [ReceitawsController],
  providers: [ReceitawsService],
  exports: [ReceitawsService],
})
export class IntegracoesModule { }