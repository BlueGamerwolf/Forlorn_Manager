const { exec } = require('child_process');
const path = require('path');

// go up one level — assuming run_gui.js is in /gui/
const projectRoot = path.join(__dirname, '..');

// helper function to run a command with promise-style output
function runCommand(command, cwd) {
  return new Promise((resolve, reject) => {
    const process = exec(command, { cwd }, (err, stdout, stderr) => {
      if (err) return reject({ err, stderr });
      resolve(stdout);
    });

    // live log to console
    process.stdout.on('data', data => process.stdout.write(data));
    process.stderr.on('data', data => process.stderr.write(data));
  });
}

(async () => {
  try {
    console.log('🚀 Starting Electron GUI...\n');
    await runCommand('npm run gui', projectRoot);
    console.log('\n✅ GUI started successfully!');
  } catch (e) {
    console.error('\n❌ GUI failed to start.');
    console.error('Error message:', e.err?.message || e);
    console.error('Stderr output:', e.stderr || 'none');
  }
})();
