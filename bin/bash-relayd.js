#!/usr/bin/env node

const { startServer } = require('../src/server');

function printHelp() {
  console.log(`bash-relayd

Usage:
  bash-relayd [port] [host]

Examples:
  bash-relayd
  bash-relayd 5555
  bash-relayd 5555 127.0.0.1

Environment:
  PORT  Override port
  HOST  Override host (default: 0.0.0.0)
`);
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  printHelp();
  process.exit(0);
}

const argPort = process.argv[2];
const argHost = process.argv[3];
const port = Number(process.env.PORT || argPort || 4444);
const host = process.env.HOST || argHost || '0.0.0.0';

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(`Invalid port: ${port}`);
  process.exit(1);
}

startServer({ host, port });
