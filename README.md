# bash-relayd

A tiny TCP relay for giving an AI coding agent temporary shell access to your machine.

Start it with `npx`, copy the printed `nc` command, and paste that command into an agent such as Claude Code so it can run one shell command per connection.

## Quick Start For AI Agents

Start the relay:

```bash
npx --yes bash-relayd
```

The server prints ready-to-use `nc` commands for each detected local IPv4 address:

```text
Listening on 0.0.0.0:4444 - WARNING: unauthenticated shell
Connect using netcat:
  nc 127.0.0.1 4444
  nc 192.168.1.23 4444
  nc 10.0.0.8 4444
```

Copy the address that your AI agent can reach, then give the agent this prompt:

```text
You can run shell commands on my machine by sending one command per connection to:

nc 192.168.1.23 4444

Use it when you need to inspect files, run tests, or execute project commands. Send exactly one command followed by a newline for each request.
```

Replace `192.168.1.23 4444` with the host and port printed by your own `bash-relayd` process.

## What The Agent Sends

Each connection runs exactly one command through `bash -c "<command>"`.

```bash
printf 'pwd\n' | nc 127.0.0.1 4444
printf 'npm test\n' | nc 127.0.0.1 4444
printf 'git status --short\n' | nc 127.0.0.1 4444
```

The relay streams stdout and stderr back to the connection, then closes it when the command exits.

## Choose A Port Or Host

Run on a custom port:

```bash
npx --yes bash-relayd 5555
```

Bind to a specific host:

```bash
npx --yes bash-relayd 5555 127.0.0.1
```

Use environment variables:

```bash
PORT=5555 HOST=127.0.0.1 npx --yes bash-relayd
```

Show help:

```bash
npx --yes bash-relayd --help
```

## Local Development

```bash
npm install
npm test
npm run start
```

## Warning

This server is intentionally unauthenticated and allows remote command execution.
Only run it while you are actively using it, and do not expose it to untrusted networks.
