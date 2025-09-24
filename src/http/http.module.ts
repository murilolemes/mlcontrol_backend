import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthenticateController } from "./controllers/authenticate-controller";
import { CreateAccountController } from "./controllers/create-account-controller";
import { CreateQuestionController } from "./controllers/create-question-controller";

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController
  ],
  providers: [PrismaService]
})

export class HttpModule { }