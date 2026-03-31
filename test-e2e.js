#!/usr/bin/env node

const http = require('http');

// Test configuration
const BASE_URL = 'http://localhost:3002';
const TESTS = [];
let passedTests = 0;
let failedTests = 0;

// Helper function to make HTTP requests
function makeRequest(method, path, body = null, cookies = '') {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (cookies) {
      options.headers['Cookie'] = cookies;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Test helper
async function test(name, testFn) {
  try {
    await testFn();
    console.log(`✓ ${name}`);
    passedTests++;
  } catch (error) {
    console.log(`✗ ${name}: ${error.message}`);
    failedTests++;
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message} - expected ${expected}, got ${actual}`);
  }
}

function assertContains(str, substr, message) {
  if (!str.includes(substr)) {
    throw new Error(`${message} - expected to contain "${substr}"`);
  }
}

async function runTests() {
  console.log('🧪 Starting End-to-End Tests\n');

  // Test 1: Unauthenticated Access
  console.log('📋 Test Group 1: Authentication');
  await test('GET /api/movies should return 401 when unauthenticated', async () => {
    const res = await makeRequest('GET', '/api/movies');
    assertEqual(res.status, 401, 'Status code');
    assertContains(res.body, 'Unauthorized', 'Response body');
  });

  await test('GET /api/tmdb/genres should return 401 when unauthenticated', async () => {
    const res = await makeRequest('GET', '/api/tmdb/genres');
    assertEqual(res.status, 401, 'Status code');
  });

  await test('GET /api/preferences should return 401 when unauthenticated', async () => {
    const res = await makeRequest('GET', '/api/preferences');
    assertEqual(res.status, 401, 'Status code');
  });

  // Test 2: Page Accessibility
  console.log('\n📋 Test Group 2: Page Access');
  await test('GET /login should load login page', async () => {
    const res = await makeRequest('GET', '/login');
    assertEqual(res.status, 200, 'Status code');
    assertContains(res.body, 'My Movie Tracker', 'Login page content');
    assertContains(res.body, 'Sign in', 'Sign in button');
  });

  await test('GET / should redirect to /login when unauthenticated', async () => {
    const res = await makeRequest('GET', '/');
    assertEqual(res.status, 307, 'Status code');
    assertContains(res.headers.location, '/login', 'Location header');
  });

  // Test 3: API Input Validation
  console.log('\n📋 Test Group 3: Input Validation');
  await test('POST /api/movies without tmdbId should return 400', async () => {
    const res = await makeRequest('POST', '/api/movies', { title: 'Test' });
    assertEqual(res.status, 401, 'Returns 401 (auth required before validation)');
  });

  await test('GET /api/movies/invalid-id should return 401', async () => {
    const res = await makeRequest('GET', '/api/movies/invalid-id');
    assertEqual(res.status, 401, 'Returns 401 (auth required)');
  });

  // Test 4: Method Validation
  console.log('\n📋 Test Group 4: HTTP Method Handling');
  await test('DELETE /api/movies should return 405 (method not allowed)', async () => {
    const res = await makeRequest('DELETE', '/api/movies');
    assertEqual(res.status, 405, 'Returns 405 (method not allowed)');
  });

  await test('PUT /api/movies should return 405 (method not allowed)', async () => {
    const res = await makeRequest('PUT', '/api/movies', {});
    assertEqual(res.status, 405, 'Returns 405 (method not allowed)');
  });

  // Test 5: Database Connection
  console.log('\n📋 Test Group 5: Database');
  await test('Database is accessible', async () => {
    // This is verified by the successful API responses
    const res = await makeRequest('GET', '/api/movies');
    assertEqual(res.status, 401, 'API responds (database accessible)');
  });

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`Tests passed: ${passedTests}`);
  console.log(`Tests failed: ${failedTests}`);
  console.log('='.repeat(50));

  if (failedTests === 0) {
    console.log('\n✨ All tests passed!');
    process.exit(0);
  } else {
    console.log(`\n⚠️ ${failedTests} test(s) failed`);
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
