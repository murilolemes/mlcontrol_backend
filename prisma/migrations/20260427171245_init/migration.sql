/*
  Warnings:

  - You are about to drop the column `tipo` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `companies` table. All the data in the column will be lost.
  - Added the required column `type` to the `clients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "tipo",
ADD COLUMN     "type" "ClientType" NOT NULL;

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "tipo",
ADD COLUMN     "type" "ClientType" NOT NULL;
