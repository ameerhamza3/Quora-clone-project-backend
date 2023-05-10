/*
  Warnings:

  - Added the required column `topicPicture` to the `topics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "topics" ADD COLUMN     "topicPicture" TEXT NOT NULL;


