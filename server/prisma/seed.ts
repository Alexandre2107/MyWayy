import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      full_name: "John Doe",
      document: "123456789",
      email: "johndoe@example.com",
      password: "password123",
      type_of_user: "student",
      has_full_permission: false,
    },
  })

  const guardian1 = await prisma.user.create({
    data: {
      full_name: "Jane Doe",
      document: "987654321",
      email: "janedoe@example.com",
      password: "password456",
      type_of_user: "guardian",
      has_full_permission: true,
    },
  })

  // Create Routine
  const routine1 = await prisma.routine.create({
    data: {
      user_id: user1.user_id,
      guardian_id: guardian1.user_id,
      description: "Daily routine",
    },
  })

  // Create Activity
  const activity1 = await prisma.activity.create({
    data: {
      routine_id: routine1.routine_id,
      title: "Morning Exercise",
      description: "30 minutes of jogging",
      activity_task: false,
    },
  })

  // Create ActivitySchedule
  const now = new Date()
  const activitySchedule1 = await prisma.activitySchedule.create({
    data: {
      activity_id: activity1.activity_id,
      start_time: new Date(now.setHours(7, 0, 0, 0)), // Hoje às 07:00
      end_time: new Date(now.setHours(7, 30, 0, 0)), // Hoje às 07:30
    },
  })

  // Create DaysOfWeek
  const daysOfWeek = ["Mon", "Wed", "Fri"]

  for (const day of daysOfWeek) {
    await prisma.dayOfWeek.create({
      data: {
        activity_schedule_id: activitySchedule1.activity_schedule_id,
        day,
      },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
