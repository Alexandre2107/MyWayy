/*
  Warnings:

  - You are about to drop the column `activity_type` on the `Activities` table. All the data in the column will be lost.
  - Added the required column `activity_task` to the `Activities` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activities" (
    "activity_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "routine_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "activity_task" BOOLEAN NOT NULL,
    CONSTRAINT "Activities_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "Routines" ("routine_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Activities" ("activity_id", "description", "routine_id", "title") SELECT "activity_id", "description", "routine_id", "title" FROM "Activities";
DROP TABLE "Activities";
ALTER TABLE "new_Activities" RENAME TO "Activities";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
