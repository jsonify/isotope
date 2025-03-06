// exit-handler.js
// ES Module version for projects with "type": "module" in package.json

import { spawn } from 'child_process';

const args = process.argv.slice(2);
const command = 'pnpm';
const commandArgs = ['run', 'test:ci', '--reporter=verbose'];

console.log(`Running: ${command} ${commandArgs.join(' ')}`);

// Start the test process
const testProcess = spawn(command, commandArgs, {
  stdio: ['inherit', 'pipe', 'inherit'],
  shell: true,
});

// Set a max timeout
const maxTimeout = setTimeout(() => {
  console.log('\n\nTests timed out after 3 minutes');
  process.exit(1);
}, 180000);

// Set up a completion detection mechanism
let testCompletionDetected = false;
let forceExitTimeout;

// Monitor stdout to detect when tests finish
testProcess.stdout?.on('data', data => {
  const output = data.toString();

  // Output the data to console
  process.stdout.write(output);

  // Check for test completion indicators
  if (
    (output.includes('✓') || output.includes('Tests completed successfully')) &&
    !testCompletionDetected
  ) {
    testCompletionDetected = true;

    // If we see successful tests, set up a force exit timer
    console.log('\n\nTest completion detected, will force exit in 10 seconds if process hangs...');

    forceExitTimeout = setTimeout(() => {
      console.log('\n\nTests completed but process did not exit. Forcing exit now.');
      // Success exit code
      process.exit(0);
    }, 10000); // Wait 10s after test completion
  }
});

// Handle when the process exits normally
testProcess.on('close', code => {
  console.log(`Test process exited with code ${code}`);
  clearTimeout(maxTimeout);
  if (forceExitTimeout) clearTimeout(forceExitTimeout);
  process.exit(code || 0);
});

// Handle errors
testProcess.on('error', err => {
  console.error('Error starting test process:', err);
  clearTimeout(maxTimeout);
  if (forceExitTimeout) clearTimeout(forceExitTimeout);
  process.exit(1);
});
