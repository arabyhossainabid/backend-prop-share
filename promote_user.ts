import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.update({
    where: { email: 'test_audit_final@propshare.local' },
    data: { role: 'ADMIN' },
  });
  console.log('Done');
}
main();
