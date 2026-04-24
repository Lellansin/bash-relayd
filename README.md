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
