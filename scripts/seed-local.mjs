/**
 * Local dev seed script — writes directly to the running backend (port 7071)
 * using the same mock principal the Vite proxy injects.
 *
 * Usage: node scripts/seed-local.mjs
 */

const API = 'http://localhost:7071/api';
const PRINCIPAL = 'eyJ1c2VySWQiOiAibG9jYWwtZGV2LWFnZW50IiwgInVzZXJEZXRhaWxzIjogImFnZW50QGZpbm5taW5uLmxvY2FsIiwgInVzZXJSb2xlcyI6IFsiYXV0aGVudGljYXRlZCJdfQ==';

const headers = {
  'Content-Type': 'application/json',
  'x-ms-client-principal': PRINCIPAL,
};

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

async function createRitual(name, nature) {
  const res = await fetch(`${API}/rituals`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name, nature }),
  });
  if (!res.ok) throw new Error(`Failed to create ritual "${name}": ${res.status}`);
  const ritual = await res.json();
  console.log(`✓ Ritual created: "${ritual.name}" (${ritual.id})`);
  return ritual;
}

async function toggleLog(ritualId, date) {
  const res = await fetch(`${API}/habitlogs/toggle`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ritualId, date }),
  });
  if (!res.ok) throw new Error(`Failed to toggle ${ritualId} on ${date}: ${res.status}`);
  return res.json();
}

async function seedLogs(ritual, completedDaysAgo) {
  console.log(`  Seeding ${completedDaysAgo.length} logs for "${ritual.name}"...`);
  for (const n of completedDaysAgo) {
    await toggleLog(ritual.id, daysAgo(n));
  }
  console.log(`  ✓ Done`);
}

// ── Seed plan ──────────────────────────────────────────────────────────────
// Morning Run:  mostly consecutive → good streak graph, some gaps
// Read 30min:   sporadic → interesting trend graph

const morningRunDays = [
  0, 1, 2, 3, 4,       // 5-day current streak
  6, 7, 8,             // gap at day 5, then 3 more
  10, 11, 12, 13, 14,  // 5-day run
  17, 18, 19,          // 3-day run
  21, 23, 25, 27, 29,  // scattered
];

const readingDays = [
  0, 2, 3,             // recent sporadic
  6, 7,
  10,
  13, 14, 15, 16,      // 4-day run
  20, 21, 22,          // 3-day run
  26, 28,
];

async function main() {
  console.log('🌱 Seeding local Pip database...\n');

  const run = await createRitual('Morning Run', 'light');
  const read = await createRitual('Read 30min', 'light');

  await seedLogs(run, morningRunDays);
  await seedLogs(read, readingDays);

  console.log('\n✅ Seed complete. Navigate to /tracker and click "View" on a ritual.');
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
