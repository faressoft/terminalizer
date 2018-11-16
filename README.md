# Terminalizer

[![npm](https://img.shields.io/npm/v/terminalizer.svg)](https://www.npmjs.com/package/terminalizer)
[![npm](https://img.shields.io/npm/l/terminalizer.svg)](https://github.com/faressoft/terminalizer/blob/master/LICENSE)
[![Gitter](https://badges.gitter.im/join_chat.svg)](https://gitter.im/terminalizer/Lobby)
[![Unicorn](https://img.shields.io/badge/nyancat-approved-ff69b4.svg)](https://www.youtube.com/watch?v=QH2-TGUlwu4)
[![Tweet](https://img.shields.io/badge/twitter-share-76abec.svg)](https://goo.gl/QJzJu1)

> Record your terminal and generate animated gif images or share a web player

<p align="center"><img src="/img/demo.gif?raw=true"/></p>

Built to be jusT cOol 👌🦄 !

> If you think so, support me with a `star` and a `follow` 😘

Built while listening to [Nyan Cat](https://www.youtube.com/watch?v=QH2-TGUlwu4) 😛

---

<p align="center"><img src="/img/trending.png?raw=true"/></p>

---

# Table of Contents

* [Features](#features)
* [What's Next](#whats-next)
* [Installation](#installation)
* [Getting Started](#getting-started)
  * [Compression](#compression)
* [Usage](#usage)
  * [Init](#init)
  * [Config](#config)
  * [Record](#record)
  * [Play](#play)
  * [Render](#render)
  * [Share](#share)
  * [Generate](#generate)
* [Configurations](#configurations)
  * [Recording](#recording)
  * [Delays](#delays)
  * [GIF](#gif)
  * [Terminal](#terminal)
  * [Theme](#theme)
  * [Watermark](#watermark)
  * [Frame Box](#frame-box)
    * [Null Frame](#null-frame)
    * [Window Frame](#window-frame)
    * [Floating Frame](#floating-frame)
    * [Solid Frame](#solid-frame)
    * [Solid Frame Without Title](#solid-frame-without-title)
    * [Styling Hint](#styling-hint)
* [FAQ](#faq)
* [Issues](#issues)
* [License](#license)

# Features

* Highly customizable.
* Cross platform (Linux, Windows, MacOS).
* Custom `window frames`.
* Custom `font`.
* Custom `colors`.
* Custom `styles` with `CSS`.
* Watermark.
* Edit frames and adjust delays before rendering.
* Skipping frames by a step value to reduce the number of rendered frames.
* Render images with texts on them instead of capturing your screen for better quality.
* The ability to configure:
  * The command to capture (bash, powershell.exe, yourOwnCommand, etc)
  * The current working directory.
  * Explicit values for the number of cols and rows.
  * GIF quality and repeating.
  * Frames delays.
  * The max idle time between frames.
  * Cursor style.
  * Font.
  * Font size.
  * Line height.
  * Letter spacing.
  * Theme.

# What's Next

* The `Generate` command to generate a web player for a recording file.
* Support `apt-get`, `yum`, `brew` installation.

# Installation

You need to install [Node.js](https://nodejs.org/en/download/) first, then install the tool globally using this command:

```bash
npm install -g terminalizer
```

<p align="center"><img src="/img/install.gif?raw=true"/></p>

> Still facing an issue? Check the [Issues](#issues) section or open a new issue.

The installation should be very smooth with Node.js v10 or lower. For newer versions, if the installation is failed, you may need to install the development tools to build the `C++` add-ons. Check [node-gyp](https://github.com/nodejs/node-gyp#installation).

# Getting Started

Start recording your terminal using the `record` command.

```bash
terminalizer record demo
```

A file called `demo.yml` will be created in the current directory. You can open it using any editor to edit the configurations and the recorded frames. You can replay your recording using the `play` command.

```bash
terminalizer play demo
```

Now let's render our recording as an animated gif.

```bash
terminalizer render demo
```

## Compression

GIF compression is not implemented yet. For now we recommend [https://gifcompressor.com](https://gifcompressor.com).

# Usage

> You can use the `--help` option to get more details about the commands and their options

```bash
terminalizer <command> [options]
```

## Init

> Create a global config directory

```bash
terminalizer init
```

## Config

> Generate a config file in the current directory

```bash
terminalizer config
```

## Record

> Record your terminal and create a recording file

```bash
terminalizer record <recordingFile>
```

Options

```
-c, --config   Overwrite the default configurations [string]
-d, --command  The command to be executed           [string] [default: null]
```

Examples

```
terminalizer record foo                      Start recording and create a recording file called foo.yml
terminalizer record foo --config config.yml  Start recording with your own configurations
```

## Play

> Play a recording file on your terminal

```bash
terminalizer play <recordingFile>
```

Options

```
-r, --real-timing   Use the actual delays between frames as recorded        [boolean] [default: false]
-s, --speed-factor  Speed factor, multiply the frames delays by this factor [number] [default: 1]
```

## Render

> Render a recording file as an animated gif image

```bash
terminalizer render <recordingFile>
```

Options

```
-o, --output   A name for the output file                                      [string]
-q, --quality  The quality of the rendered image (1 - 100)                     [number]
-s, --step     To reduce the number of rendered frames (step > 1) [number] [default: 1]
```

## Share

> Upload a recording file and get a link for an online player

```bash
terminalizer share <recordingFile>
```

## Generate

> Generate a web player for a recording file

```bash
terminalizer generate <recordingFile>
```

# Configurations

The default `config.yml` file is stored under the root directory of the project. Execute the below command to copy it to your current directory.

> Use any editor to edit the copied `config.yml`, then use the `-c` option to override the default one.

```bash
terminalizer config
```

> RECOMMENDED, use the `init` command to create a global config file to be used instead of the default one.

```bash
terminalizer init
```

For Linux and MacOS, the created directory is located under the home directory `~/.terminalizer`. For Windows, it is located under the `AppData`.

## Recording

* `command`: Specify a command to be executed like `/bin/bash -l`, `ls`, or any other command. The default is `bash` for `Linux` or `powershell.exe` for `Windows`.
* `cwd`: Specify the current working directory path. The default is the current working directory path.
* `env`: Export additional ENV variables, to be read by your scripts when starting the recording.
* `cols`: Explicitly set the number of columns or use `auto` to take the current number of columns of your shell.
* `rows`: Explicitly set the number of rows or use `auto` to take the current number of rows of your shell.

## Delays

* `frameDelay`: The delay between frames in ms. If the value is `auto` use the actual recording delays.
* `maxIdleTime`: Maximum delay between frames in ms. Ignored if the `frameDelay` isn't set to `auto`. Set to `auto` to prevent limiting the max idle time.

## GIF

* `quality`: The quality of the generated GIF image (1 - 100).
* `repeat`: Amount of times to repeat GIF:
  * If value is `-1`, play once.
  * If value is `0`, loop indefinitely.
  * If value is a positive number, loop `n` times.

## Terminal

* `cursorStyle`: Cursor style can be one of `block`, `underline`, or `bar`.
* `fontFamily`: You can use any font that is installed on your machine like `Monaco` or `Lucida Console` (CSS-like list).
* `fontSize`: The size of the font in pixels.
* `lineHeight`: The height of lines in pixels.
* `letterSpacing`: The spacing between letters in pixels.

## Theme

You can set the colors of your terminal using one of the CSS formats:

* Hex: `#FFFFFF`.
* RGB: `rgb(255, 255, 255)`.
* HSL: `hsl(0, 0%, 100%)`.
* Name: `white`, `red`, `blue`.

> You can use the value `transparent` too.

The default colors that are assigned to the terminal colors are:

* background: ![#ffffff](https://placehold.it/15/ffffff/000000?text=+) `transparent`
* foreground: ![#afafaf](https://placehold.it/15/afafaf/000000?text=+) `#afafaf`
* cursor: ![#c7c7c7](https://placehold.it/15/c7c7c7/000000?text=+) `#c7c7c7`
* black: ![#232628](https://placehold.it/15/232628/000000?text=+) `#232628`
* red: ![#fc4384](https://placehold.it/15/fc4384/000000?text=+) `#fc4384`
* green: ![#b3e33b](https://placehold.it/15/b3e33b/000000?text=+) `#b3e33b`
* yellow: ![#ffa727](https://placehold.it/15/ffa727/000000?text=+) `#ffa727`
* blue: ![#75dff2](https://placehold.it/15/75dff2/000000?text=+) `#75dff2`
* magenta: ![#ae89fe](https://placehold.it/15/ae89fe/000000?text=+) `#ae89fe`
* cyan: ![#708387](https://placehold.it/15/708387/000000?text=+) `#708387`
* white: ![#d5d5d0](https://placehold.it/15/d5d5d0/000000?text=+) `#d5d5d0`
* brightBlack: ![#626566](https://placehold.it/15/626566/000000?text=+) `#626566`
* brightRed: ![#ff7fac](https://placehold.it/15/ff7fac/000000?text=+) `#ff7fac`
* brightGreen: ![#c8ed71](https://placehold.it/15/c8ed71/000000?text=+) `#c8ed71`
* brightYellow: ![#ebdf86](https://placehold.it/15/ebdf86/000000?text=+) `#ebdf86`
* brightBlue: ![#75dff2](https://placehold.it/15/75dff2/000000?text=+) `#75dff2`
* brightMagenta: ![#ae89fe](https://placehold.it/15/ae89fe/000000?text=+) `#ae89fe`
* brightCyan: ![#b1c6ca](https://placehold.it/15/b1c6ca/000000?text=+) `#b1c6ca`
* brightWhite: ![#f9f9f4](https://placehold.it/15/f9f9f4/000000?text=+) `#f9f9f4`

## Watermark

You can add a watermark logo to your generated GIF images.

<p align="center"><img src="/img/watermark.gif?raw=true"/></p>

```
watermark:
  imagePath: AbsolutePathOrURL
  style:
    position: absolute
    right: 15px
    bottom: 15px
    width: 100px
    opacity: 0.9
```

* `watermark.imagePath`: An absolute path for the image on your machine or a URL.
* `watermark.style`: Apply CSS styles (camelCase) to the watermark image, like resizing it.

## Frame Box

Terminalizer comes with predefined frames that you can use to make your GIF images look cool.

* `frameBox.type`: Can be `null`, `window`, `floating`, or `solid`.
* `frameBox.title`: To display a title for the frame or `null`.
* `frameBox.style`: To apply custom CSS styles or to override the current ones.

### Null Frame

No frame, just your recording.

<p align="center"><img src="/img/frames/null.gif?raw=true"/></p>

> Don't forget to add a `backgroundColor` under `style`.

```
frameBox:
  type: null
  title: null
  style:
    backgroundColor: black
```

### Window Frame

<p align="center"><img src="/img/frames/window.gif?raw=true"/></p>

```
frameBox:
  type: window
  title: Terminalizer
  style: []
```

### Floating Frame

<p align="center"><img src="/img/frames/floating.gif?raw=true"/></p>

```
frameBox:
  type: floating
  title: Terminalizer
  style: []
```

### Solid Frame

<p align="center"><img src="/img/frames/solid.gif?raw=true"/></p>

```
frameBox:
  type: solid
  title: Terminalizer
  style: []
```

### Solid Frame Without Title

<p align="center"><img src="/img/frames/solid_without_title.gif?raw=true"/></p>

```
frameBox:
  type: solid
  title: null
  style: []
```

### Styling Hint

You can disable the default shadows and margins.

<p align="center"><img src="/img/frames/solid_without_title_without_shadows.gif?raw=true"/></p>

```
frameBox:
  type: solid
  title: null
  style:
    boxShadow: none
    margin: 0px
```

# FAQ

### How to support ZSH

The default command that gets recorded for Linux is `bash -l`. You need to change the default command to `zsh`.

* Generate a config file in the current directory

```bash
terminalizer config
```

* Open the generated config file in your preferred editor.
* Change the `command` to `zsh`:

```
command: zsh
```

* You may need to change the font, check the font that is used in your terminal:

```
fontFamily: "Meslo for Powerline, Meslo LG M for Powerline"
```

* Use the `-c` option to override the config file:

```bash
terminalizer record demo -c config.yml
```

# Issues

> error while loading shared libraries: libXss.so.1: cannot open shared object file: No such file or directory

Solution:

```bash
sudo yum install libXScrnSaver
```

> error while loading shared libraries: libgconf-2.so.4: cannot open shared object file: No such file or directory

Solution:

```bash
sudo apt-get install libgconf-2-4
```

# License

This project is under the MIT license.
