import { Module } from "@nestjs/common";

import { CreateClientController } from "@/client/controller/create-client-controller";
import { ListClientController } from "@/client/controller/list-client-controller";
import { CompanyModule } from "@/company/company.module";
import { CreateClientService } from "./service/create-client.service";

@Module({
  imports: [
    CompanyModule
  ],
  controllers: [
    CreateClientController,
    ListClientController,
  ],
  providers: [
    CreateClientService
  ]
})

export class ClientModule { };