import { CreateAccountController } from "@/account/controller/create-account-controller";
import { ListAccountController } from "@/account/controller/list-account-controller";
import { ShowAccountController } from "@/account/controller/show-account-controller";
import { UpdateAccountController } from "@/account/controller/update-account-controller";
import { Module } from "@nestjs/common";

@Module({
  controllers: [
    CreateAccountController,
    ListAccountController,
    ShowAccountController,
    UpdateAccountController,
  ]
})

export class AccountModule { };