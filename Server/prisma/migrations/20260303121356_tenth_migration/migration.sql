/*
  Warnings:

  - A unique constraint covering the columns `[dermatologistId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `User_dermatologistId_key` ON `User`(`dermatologistId`);
