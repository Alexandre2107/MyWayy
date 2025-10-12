-- CreateTable
CREATE TABLE "Users" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "full_name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type_of_user" TEXT NOT NULL,
    "has_full_permission" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Routines" (
    "routine_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "guardian_id" INTEGER NOT NULL,
    "creation_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    CONSTRAINT "Routines_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Routines_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "Users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Activities" (
    "activity_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "routine_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "activity_type" TEXT NOT NULL,
    CONSTRAINT "Activities_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "Routines" ("routine_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivitySchedules" (
    "activity_schedule_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "activity_id" INTEGER NOT NULL,
    "has_time" BOOLEAN NOT NULL DEFAULT true,
    "start_time" DATETIME,
    "end_time" DATETIME,
    "day_of_week" TEXT NOT NULL,
    CONSTRAINT "ActivitySchedules_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "Activities" ("activity_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_document_key" ON "Users"("document");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
