/*
  Warnings:

  - You are about to drop the column `has_time` on the `ActivitySchedules` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ActivitySchedules" (
    "activity_schedule_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "activity_id" INTEGER NOT NULL,
    "start_time" DATETIME,
    "end_time" DATETIME,
    CONSTRAINT "ActivitySchedules_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "Activities" ("activity_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ActivitySchedules" ("activity_id", "activity_schedule_id", "end_time", "start_time") SELECT "activity_id", "activity_schedule_id", "end_time", "start_time" FROM "ActivitySchedules";
DROP TABLE "ActivitySchedules";
ALTER TABLE "new_ActivitySchedules" RENAME TO "ActivitySchedules";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
