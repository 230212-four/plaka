import { prisma } from './src/db.js';

console.log('⏳ Testing prisma.user.findFirst() via adapter...');
const start = Date.now();
try {
  const user = await prisma.user.findFirst();
  console.log('✅ Prisma query succeeded in', Date.now() - start, 'ms');
  console.log('   Result:', user);
} catch (err) {
  console.error('❌ Prisma query failed in', Date.now() - start, 'ms');
  console.error('   Error:', err.message);
  console.error('   Code:', err.code);
} finally {
  await prisma.$disconnect();
  process.exit(0);
}
