/*
  Warnings:

  - You are about to drop the `UsersFavourites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsersFavourites" DROP CONSTRAINT "UsersFavourites_homeId_fkey";

-- DropForeignKey
ALTER TABLE "UsersFavourites" DROP CONSTRAINT "UsersFavourites_userId_fkey";

-- DropTable
DROP TABLE "UsersFavourites";

-- CreateTable
CREATE TABLE "UserFavourite" (
    "userId" TEXT NOT NULL,
    "homeId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "UserFavourite_pkey" PRIMARY KEY ("userId","homeId")
);

-- AddForeignKey
ALTER TABLE "UserFavourite" ADD CONSTRAINT "UserFavourite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavourite" ADD CONSTRAINT "UserFavourite_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
