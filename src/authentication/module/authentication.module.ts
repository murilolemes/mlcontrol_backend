import { Module } from "@nestjs/common";

import { AuthenticateController } from "@/authentication/controller/authenticate-controller";
import { LogoutController } from "@/authentication/controller/logout-controller";
import { MeController } from "@/authentication/controller/me-controller";

@Module({
  controllers: [
    MeController,
    LogoutController,
    AuthenticateController,
  ]
})

export class AuthenticationModule { };