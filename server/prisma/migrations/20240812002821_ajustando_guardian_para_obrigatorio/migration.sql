/*
  Warnings:

  - You are about to drop the column `day_of_week` on the `ActivitySchedules` table. All the data in the column will be lost.
  - Made the column `guardian_id` on table `Routines` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "DaysOfWeek" (
    "day_of_week_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "activity_schedule_id" INTEGER NOT NULL,
    "day" TEXT NOT NULL,
    CONSTRAINT "DaysOfWeek_activity_schedule_id_fkey" FOREIGN KEY ("activity_schedule_id") REFERENCES "ActivitySchedules" ("activity_schedule_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Routines" (
    "routine_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "guardian_id" INTEGER NOT NULL,
    "creation_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    CONSTRAINT "Routines_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Routines_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "Users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Routines" ("creation_date", "description", "guardian_id", "routine_id", "user_id") SELECT "creation_date", "description", "guardian_id", "routine_id", "user_id" FROM "Routines";
DROP TABLE "Routines";
ALTER TABLE "new_Routines" RENAME TO "Routines";
CREATE TABLE "new_ActivitySchedules" (
    "activity_schedule_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "activity_id" INTEGER NOT NULL,
    "has_time" BOOLEAN NOT NULL DEFAULT true,
    "start_time" DATETIME,
    "end_time" DATETIME,
    CONSTRAINT "ActivitySchedules_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "Activities" ("activity_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ActivitySchedules" ("activity_id", "activity_schedule_id", "end_time", "has_time", "start_time") SELECT "activity_id", "activity_schedule_id", "end_time", "has_time", "start_time" FROM "ActivitySchedules";
DROP TABLE "ActivitySchedules";
ALTER TABLE "new_ActivitySchedules" RENAME TO "ActivitySchedules";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
