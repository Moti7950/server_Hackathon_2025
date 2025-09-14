import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export async function main() {
  // בדיקה שהחיבור עובד
  const result = await prisma.$queryRaw`SELECT NOW()`
  console.log('Connected to database:', result)
  
  // דוגמת שימוש
  const users = await prisma.user.findMany()
  console.log('Users:', users)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())