const net = require('net');
const { spawn } = require('child_process');

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
    console.log(`Listening on ${host}:${port} - WARNING: unauthenticated shell`);
  });

  return server;
}

module.exports = {
  createServer,
  startServer,
};
