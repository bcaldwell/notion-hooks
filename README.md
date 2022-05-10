oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g notion-hooks
$ notion-hooks COMMAND
running command...
$ notion-hooks (--version)
notion-hooks/0.0.0 linux-x64 node-v16.14.2
$ notion-hooks --help [COMMAND]
USAGE
  $ notion-hooks COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`notion-hooks hello PERSON`](#notion-hooks-hello-person)
* [`notion-hooks hello world`](#notion-hooks-hello-world)
* [`notion-hooks help [COMMAND]`](#notion-hooks-help-command)
* [`notion-hooks plugins`](#notion-hooks-plugins)
* [`notion-hooks plugins:install PLUGIN...`](#notion-hooks-pluginsinstall-plugin)
* [`notion-hooks plugins:inspect PLUGIN...`](#notion-hooks-pluginsinspect-plugin)
* [`notion-hooks plugins:install PLUGIN...`](#notion-hooks-pluginsinstall-plugin-1)
* [`notion-hooks plugins:link PLUGIN`](#notion-hooks-pluginslink-plugin)
* [`notion-hooks plugins:uninstall PLUGIN...`](#notion-hooks-pluginsuninstall-plugin)
* [`notion-hooks plugins:uninstall PLUGIN...`](#notion-hooks-pluginsuninstall-plugin-1)
* [`notion-hooks plugins:uninstall PLUGIN...`](#notion-hooks-pluginsuninstall-plugin-2)
* [`notion-hooks plugins update`](#notion-hooks-plugins-update)

## `notion-hooks hello PERSON`

Say hello

```
USAGE
  $ notion-hooks hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Whom is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/bcaldwell/notion-hooks/blob/v0.0.0/dist/commands/hello/index.ts)_

## `notion-hooks hello world`

Say hello world

```
USAGE
  $ notion-hooks hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

## `notion-hooks help [COMMAND]`

Display help for notion-hooks.

```
USAGE
  $ notion-hooks help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for notion-hooks.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `notion-hooks plugins`

List installed plugins.

```
USAGE
  $ notion-hooks plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ notion-hooks plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `notion-hooks plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ notion-hooks plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ notion-hooks plugins add

EXAMPLES
  $ notion-hooks plugins:install myplugin 

  $ notion-hooks plugins:install https://github.com/someuser/someplugin

  $ notion-hooks plugins:install someuser/someplugin
```

## `notion-hooks plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ notion-hooks plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ notion-hooks plugins:inspect myplugin
```

## `notion-hooks plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ notion-hooks plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ notion-hooks plugins add

EXAMPLES
  $ notion-hooks plugins:install myplugin 

  $ notion-hooks plugins:install https://github.com/someuser/someplugin

  $ notion-hooks plugins:install someuser/someplugin
```

## `notion-hooks plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ notion-hooks plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ notion-hooks plugins:link myplugin
```

## `notion-hooks plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ notion-hooks plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ notion-hooks plugins unlink
  $ notion-hooks plugins remove
```

## `notion-hooks plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ notion-hooks plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ notion-hooks plugins unlink
  $ notion-hooks plugins remove
```

## `notion-hooks plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ notion-hooks plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ notion-hooks plugins unlink
  $ notion-hooks plugins remove
```

## `notion-hooks plugins update`

Update installed plugins.

```
USAGE
  $ notion-hooks plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
