#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const { createServer } = require('http');

// Import Next.js app
const { nextStart } = require('next/dist/cli/next-start');

const port = process.env.PORT || 3000;
const certFile = process.env.CERT_FILE || './localhost.crt';
const keyFile = process.env.KEY_FILE || './localhost.key';

// Check if certificate files exist
if (!fs.existsSync(certFile) || !fs.existsSync(keyFile)) {
  console.error(`Certificate files not found. Generate them using:`);
  console.error(`  node generate-cert.js`);
  process.exit(1);
}

// For development: use next dev instead and proxy through local HTTPS server
const { spawn } = require('child_process');
const nextProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: 3001 } // Run Next.js on internal port
});

// Wait for Next.js to start, then create HTTPS proxy
setTimeout(() => {
  const https_server = https.createServer({
    key: fs.readFileSync(keyFile),
    cert: fs.readFileSync(certFile),
  }, (req, res) => {
    const http = require('http');
    const proxyReq = http.request(
      { hostname: 'localhost', port: 3001, path: req.url, method: req.method, headers: req.headers },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );
    req.pipe(proxyReq);
    proxyReq.on('error', () => res.end());
  });

  https_server.listen(port, '0.0.0.0', () => {
    console.log(`✓ HTTPS server running at https://localhost:${port}`);
  });
}, 3000);

process.on('SIGINT', () => {
  nextProcess.kill();
  process.exit(0);
});
