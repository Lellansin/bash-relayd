# bash-relayd

A minimal TCP server that executes one `bash -c "<command>"` per client connection.

## Usage

Run directly with `npx` without the install confirmation prompt:

```bash
npx --yes bash-relayd
```

Run on a custom port and host:

```bash
npx --yes bash-relayd 5555 127.0.0.1
```

Run with environment variables:

```bash
PORT=5555 HOST=127.0.0.1 npx --yes bash-relayd
```

Show help:

```bash
npx --yes bash-relayd --help
```

When the server starts, it prints ready-to-run `nc` commands for each detected local IPv4 address. A typical startup output looks like this:

```text
Listening on 0.0.0.0:4444 - WARNING: unauthenticated shell
Connect using netcat:
  nc 127.0.0.1 4444
  nc 192.168.1.23 4444
  nc 10.0.0.8 4444
```

## AI Agent Prompt

A common `npx` workflow is to start `bash-relayd`, copy one of the printed `nc` commands, and give it to an AI coding agent such as Claude Code:

```text
You can run shell commands on my machine by sending one command per connection to:

nc 192.168.1.23 4444

Use it when you need to inspect files, run tests, or execute project commands. Send exactly one command followed by a newline for each request.
```

Replace `192.168.1.23 4444` with the host and port printed by your own `bash-relayd` process.

After connecting, send a single command followed by a newline:

```bash
printf 'uname -a\n' | nc 127.0.0.1 4444
```

## Local Development

```bash
npm install
npm run start
```

## Warning

This server is intentionally unauthenticated and allows remote command execution.
Do not expose it to untrusted networks.
