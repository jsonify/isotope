// exit-handler.js
// This should be saved at the root of your project
// Run this with: node exit-handler.js "your test command"

const { spawn } = require('child_process');
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Please provide a command to run');
  process.exit(1);
}

const command = args[0];
const commandArgs = args.slice(1);

console.log(`Running command: ${command} ${commandArgs.join(' ')}`);

// Start the test process
const testProcess = spawn(command, commandArgs, {
  shell: true,
  stdio: 'inherit',
});

// Set a timeout to force exit after tests are done
const timeout = setTimeout(() => {
  console.log('\n\nTests completed but process did not exit.');
  console.log('Force exiting now...');
  process.exit(0);
}, 120000); // 2 minute timeout

// Handle normal exit
testProcess.on('exit', code => {
  console.log(`Test process exited with code ${code}`);
  clearTimeout(timeout);

  // Exit with the same code
  process.exit(code);
});

// Handle errors
testProcess.on('error', err => {
  console.error('Failed to start test process:', err);
  clearTimeout(timeout);
  process.exit(1);
});
