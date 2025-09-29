/*
  Warnings:

  - A unique constraint covering the columns `[tokenId]` on the table `QRCode` will be added. If there are existing duplicate values, this will fail.
  - Made the column `tokenId` on table `QRCode` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."QRCode" ALTER COLUMN "tokenId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "QRCode_tokenId_key" ON "public"."QRCode"("tokenId");
