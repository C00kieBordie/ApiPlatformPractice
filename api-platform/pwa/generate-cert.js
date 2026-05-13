const fs = require('fs');
const { execSync } = require('child_process');

// Use Docker to generate certificate
const cmd = `docker run --rm -v ${process.cwd()}:/certs alpine/openssl req -x509 -newkey rsa:4096 -keyout /certs/localhost.key -out /certs/localhost.crt -days 365 -nodes -subj "/CN=localhost"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('Certificate generated: localhost.crt and localhost.key');
} catch (err) {
  console.error('Failed to generate certificate:', err.message);
  process.exit(1);
}
