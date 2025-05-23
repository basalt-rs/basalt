# Basalt

Application for managing and competing in programming competitions

## Development

- Node: 20.17.0
- Rust: 1.84

To get started, install the Tauri CLI
([docs](https://v2.tauri.app/reference/cli/)). We recommend using
cargo.

```sh
git clone https://github.com/basalt-rs/basalt.git
cd basalt
cd client
npm i           # install node_modules
cargo tauri dev # launch dev server
```

Depending on your OS, you may be missing packages. The error messages
should be informative. If all goes well, an application window will
then spawn.

You can also access the web UI at `http://localhost:3000`.

Next you'll need a server and a game code. For the game code, you'll
need the Basalt CLI. Please consult
[the docs](https://basalt.rs/getting-started/connecting.html) for
more info. For the server, check out the
[repo](https://github.com/basalt-rs/basalt-server) and follow its
instructions for getting up and running.

Use the CLI to produce a game code for the same port on which your
server is running. Afterwards, feel free to enter that game code into
the user interface. Then log in with an account in your configuration.

We support hot-module-reloading (HMR), so changes will be reflected
nearly immediately.

## Issues

When creating an issue, you'll be given two templates
(bug or feature request). Please provide all of the requested
information if available. If not available, simply put "NA".

## Contributing

On any of our issues, feel free to express your intention to
contribute. You can also do this in our
[Discord](https://discord.gg/jTGXMPgp6J).

Then just fork the project, make your changes, and create a pull
request. We're available in the discord for a chat if you need some
help.
