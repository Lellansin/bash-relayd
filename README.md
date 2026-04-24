# bash-relayd

A minimal TCP server that executes one `bash -c "<command>"` per client connection.

## Usage

Run directly:

```bash
npx bash-relayd
```

Custom port/host:

```bash
npx bash-relayd 5555 127.0.0.1
```

Or via environment variables:

```bash
PORT=5555 HOST=127.0.0.1 npx bash-relayd
```

Show help:

```bash
npx bash-relayd --help
```

## Local Development

```bash
npm install
npm run start
```

## Publish to npm

1. Make sure package name is available (`npm view bash-relayd --registry=https://registry.npmjs.org`).
2. Update `name` and `version` in `package.json` if needed.
3. Login: `npm login`
4. Publish: `npm publish --access public`

After publishing, users can run it with:

```bash
npx bash-relayd
```

## Warning

This server is intentionally unauthenticated and allows remote command execution.
Do not expose it to untrusted networks.
