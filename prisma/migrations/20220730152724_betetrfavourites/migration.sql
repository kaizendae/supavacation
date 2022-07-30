/*
  Warnings:

  - You are about to drop the `_favourites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_favourites" DROP CONSTRAINT "_favourites_A_fkey";

-- DropForeignKey
ALTER TABLE "_favourites" DROP CONSTRAINT "_favourites_B_fkey";

-- DropTable
DROP TABLE "_favourites";

-- CreateTable
CREATE TABLE "UsersFavourites" (
    "userId" TEXT NOT NULL,
    "homeId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "UsersFavourites_pkey" PRIMARY KEY ("userId","homeId")
);

-- AddForeignKey
ALTER TABLE "UsersFavourites" ADD CONSTRAINT "UsersFavourites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersFavourites" ADD CONSTRAINT "UsersFavourites_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
