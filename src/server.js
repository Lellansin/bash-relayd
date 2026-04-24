const net = require('net');
const os = require('os');
const { spawn } = require('child_process');

function getConnectHosts(host) {
  if (host !== '0.0.0.0') {
    return [host];
  }

  const interfaces = os.networkInterfaces();
  const hosts = new Set(['127.0.0.1']);

  for (const addresses of Object.values(interfaces)) {
    for (const address of addresses || []) {
      if (address.family !== 'IPv4' || address.internal) continue;
      hosts.add(address.address);
    }
  }

  return [...hosts];
}

function printConnectHints(host, port) {
  const connectHosts = getConnectHosts(host);

  console.log(`Listening on ${host}:${port} - WARNING: unauthenticated shell`);
  console.log('Connect using netcat:');

  for (const connectHost of connectHosts) {
    console.log(`  nc ${connectHost} ${port}`);
  }
}

function createServer() {
  return net.createServer({ allowHalfOpen: true }, (socket) => {
    console.log(`Connection from ${socket.remoteAddress}:${socket.remotePort}`);

    let buffer = '';
    let shell = null;

    const startShell = (command) => {
      shell = spawn('bash', ['-c', command], {
        env: { ...process.env, TERM: 'xterm' },
      });

      shell.stdout.pipe(socket);
      shell.stderr.pipe(socket);
      shell.on('exit', () => {
        socket.end();
        console.log('Shell exited');
      });
    };

    socket.on('data', (chunk) => {
      buffer += chunk;
      if (shell) return;

      const newlineIndex = buffer.indexOf('\n');
      if (newlineIndex === -1) return;

      const command = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);

      if (command) startShell(command);
    });

    socket.on('end', () => {
      if (!shell && buffer.trim()) {
        startShell(buffer.trim());
      }
    });

    socket.on('close', () => {
      if (shell) shell.kill();
      console.log('Connection closed');
    });

    socket.on('error', () => {
      if (shell) shell.kill();
    });
  });
}

function startServer({ host, port }) {
  const server = createServer();

  server.listen(port, host, () => {
    printConnectHints(host, port);
  });

  return server;
}

module.exports = {
  createServer,
  startServer,
};
