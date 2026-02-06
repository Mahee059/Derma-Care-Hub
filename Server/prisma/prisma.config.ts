import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://root:Swisse%40123%23@localhost:3306/derma_care_hub",
    },
  },
})
