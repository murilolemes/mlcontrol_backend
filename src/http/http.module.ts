import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAccountController } from "./controllers/account/create-account-controller";
import { ListAccountController } from "./controllers/account/list-account-controller";
import { ShowAccountController } from "./controllers/account/show-account-controller";
import { UpdateAccountController } from "./controllers/account/update-account-controller";
import { AuthenticateController } from "./controllers/auth/authenticate-controller";
import { CreateTypeOfPlanController } from "./controllers/financial/typeOfPlan/create-typeOfPlan-controller";

@Module({
  controllers: [
    CreateAccountController,
    ListAccountController,
    ShowAccountController,
    UpdateAccountController,
    AuthenticateController,
    CreateTypeOfPlanController
  ],
  providers: [PrismaService]
})

export class HttpModule { }