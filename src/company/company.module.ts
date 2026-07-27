import { Module } from "@nestjs/common";

import { CreateCompanyController } from "@/company/controller/create-company-controller";
import { CompanyService } from "./service/company.service";

@Module({
  controllers: [
    CreateCompanyController,
  ],
  providers: [
    CompanyService,
  ],
  exports: [
    CompanyService,
  ]
})

export class CompanyModule { };