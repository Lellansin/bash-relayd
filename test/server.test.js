const assert = require('node:assert/strict');
const net = require('node:net');
const test = require('node:test');
const { createServer, normalizeCommand } = require('../src/server');

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
}

function request(port, payload) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: '127.0.0.1', port });
    const chunks = [];

    socket.on('connect', () => socket.end(payload));
    socket.on('data', (chunk) => chunks.push(chunk));
    socket.on('error', reject);
    socket.on('close', () => resolve(Buffer.concat(chunks)));
  });
}

test('normalizeCommand converts NUL bytes to shell escapes', () => {
  assert.equal(normalizeCommand('printf "a\0b"'), 'printf "a\\0b"');
});

test('server handles commands containing NUL bytes without crashing', async () => {
  const server = createServer();
  const port = await listen(server);

  try {
    const output = await request(port, 'printf "a\0b"\n');
    assert.deepEqual(output, Buffer.from([0x61, 0x00, 0x62]));
  } finally {
    server.close();
  }
});
