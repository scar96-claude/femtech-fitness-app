import { PrismaClient, Demographic } from '@prisma/client';

/**
 * Calculate demographic based on date of birth
 * Age < 40 = REPRODUCTIVE, Age >= 40 = PERIMENOPAUSE
 */
function calculateDemographic(dateOfBirth: Date): Demographic {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }

  return age < 40 ? Demographic.REPRODUCTIVE : Demographic.PERIMENOPAUSE;
}

/**
 * Extended Prisma Client with demographic computation middleware
 */
function createPrismaClient(): PrismaClient {
  const prisma = new PrismaClient();

  // Middleware to auto-compute demographic field on create/update
  prisma.$use(async (params, next) => {
    // Only apply to UserProfile model
    if (params.model !== 'UserProfile') {
      return next(params);
    }

    // Handle create operations
    if (params.action === 'create' && params.args.data?.dateOfBirth) {
      const dateOfBirth = new Date(params.args.data.dateOfBirth);
      params.args.data.demographic = calculateDemographic(dateOfBirth);
    }

    // Handle createMany operations
    if (params.action === 'createMany' && Array.isArray(params.args.data)) {
      params.args.data = params.args.data.map((record: { dateOfBirth?: Date | string }) => {
        if (record.dateOfBirth) {
          const dateOfBirth = new Date(record.dateOfBirth);
          return {
            ...record,
            demographic: calculateDemographic(dateOfBirth)
          };
        }
        return record;
      });
    }

    // Handle update operations
    if (params.action === 'update' && params.args.data?.dateOfBirth) {
      const dateOfBirth = new Date(params.args.data.dateOfBirth);
      params.args.data.demographic = calculateDemographic(dateOfBirth);
    }

    // Handle updateMany operations
    if (params.action === 'updateMany' && params.args.data?.dateOfBirth) {
      const dateOfBirth = new Date(params.args.data.dateOfBirth);
      params.args.data.demographic = calculateDemographic(dateOfBirth);
    }

    // Handle upsert operations
    if (params.action === 'upsert') {
      if (params.args.create?.dateOfBirth) {
        const dateOfBirth = new Date(params.args.create.dateOfBirth);
        params.args.create.demographic = calculateDemographic(dateOfBirth);
      }
      if (params.args.update?.dateOfBirth) {
        const dateOfBirth = new Date(params.args.update.dateOfBirth);
        params.args.update.demographic = calculateDemographic(dateOfBirth);
      }
    }

    return next(params);
  });

  return prisma;
}

// Singleton pattern for Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export { calculateDemographic };
export default prisma;
