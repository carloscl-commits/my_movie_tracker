#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🗄️ Testing Database Operations\n');

// Create a test script that will run in the Next.js context
const testScript = `
// This will be executed in the Next.js context
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

async function runTests() {
  const adapter = new PrismaBetterSqlite3({
    url: \`file:\${process.cwd().replace(/\\\\\\\\/g, '/')}/prisma/dev.db\`,
  });
  const prisma = new PrismaClient({ adapter });

  let passed = 0;
  let failed = 0;

  try {
    console.log('1️⃣ Testing Movie Creation...');
    const movie = await prisma.movie.create({
      data: {
        tmdbId: 550,
        title: 'Fight Club',
        year: 1999,
        synopsis: 'An underground fight club',
        posterUrl: 'https://example.com/poster.jpg',
        genres: JSON.stringify([18, 53]),
        status: 'unseen',
        personalRating: null,
      },
    });
    console.log('✓ Movie created:', movie.id);
    passed++;

    console.log('\\n2️⃣ Testing Movie Retrieval...');
    const retrieved = await prisma.movie.findUnique({
      where: { id: movie.id },
    });
    if (retrieved && retrieved.tmdbId === 550) {
      console.log('✓ Movie retrieved successfully');
      passed++;
    } else {
      console.log('✗ Movie retrieval failed');
      failed++;
    }

    console.log('\\n3️⃣ Testing Movie Update...');
    const updated = await prisma.movie.update({
      where: { id: movie.id },
      data: { personalRating: 5, status: 'favorite' },
    });
    if (updated.personalRating === 5 && updated.status === 'favorite') {
      console.log('✓ Movie updated successfully');
      passed++;
    } else {
      console.log('✗ Movie update failed');
      failed++;
    }

    console.log('\\n4️⃣ Testing Movie List...');
    const movies = await prisma.movie.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (Array.isArray(movies) && movies.length > 0) {
      console.log('✓ Movie list retrieved:', movies.length, 'movies');
      passed++;
    } else {
      console.log('✗ Movie list failed');
      failed++;
    }

    console.log('\\n5️⃣ Testing User Preferences...');
    const prefs = await prisma.userPreferences.upsert({
      where: { id: 1 },
      update: { theme: 'dark', accentColor: '#ff0000' },
      create: { id: 1, theme: 'dark', accentColor: '#ff0000' },
    });
    if (prefs.theme === 'dark' && prefs.accentColor === '#ff0000') {
      console.log('✓ Preferences saved successfully');
      passed++;
    } else {
      console.log('✗ Preferences save failed');
      failed++;
    }

    console.log('\\n6️⃣ Testing Preferences Retrieval...');
    const prefRetrieved = await prisma.userPreferences.findUnique({
      where: { id: 1 },
    });
    if (prefRetrieved && prefRetrieved.theme === 'dark') {
      console.log('✓ Preferences retrieved successfully');
      passed++;
    } else {
      console.log('✗ Preferences retrieval failed');
      failed++;
    }

    console.log('\\n7️⃣ Testing Movie Deletion...');
    const deleted = await prisma.movie.delete({
      where: { id: movie.id },
    });
    if (deleted.id === movie.id) {
      console.log('✓ Movie deleted successfully');
      passed++;
    } else {
      console.log('✗ Movie deletion failed');
      failed++;
    }

    console.log('\\n8️⃣ Testing Duplicate Prevention...');
    try {
      const dup1 = await prisma.movie.create({
        data: {
          tmdbId: 551,
          title: 'SE7EN',
          year: 1995,
          status: 'unseen',
        },
      });

      try {
        const dup2 = await prisma.movie.create({
          data: {
            tmdbId: 551,
            title: 'SE7EN',
            year: 1995,
            status: 'unseen',
          },
        });
        console.log('✗ Duplicate prevention failed');
        failed++;
      } catch (e) {
        console.log('✓ Duplicate prevention works (constraint enforced)');
        passed++;
        // Clean up
        await prisma.movie.delete({ where: { id: dup1.id } });
      }
    } catch (e) {
      console.log('✗ Duplicate test error:', e.message);
      failed++;
    }

    console.log('\\n' + '='.repeat(50));
    console.log('Database tests passed:', passed);
    console.log('Database tests failed:', failed);
    console.log('='.repeat(50));

    process.exit(failed === 0 ? 0 : 1);
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
`;

// Write and run the test
const testPath = path.join(process.cwd(), 'run-db-test.js');
fs.writeFileSync(testPath, testScript);

const proc = spawn('node', [testPath], {
  cwd: process.cwd(),
  stdio: 'inherit',
});

proc.on('close', (code) => {
  fs.unlinkSync(testPath);
  process.exit(code);
});
