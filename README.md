# Terminalizer

[![npm](https://img.shields.io/npm/v/terminalizer.svg)](https://www.npmjs.com/package/terminalizer)
[![npm](https://img.shields.io/npm/l/terminalizer.svg)](https://github.com/faressoft/terminalizer/blob/master/LICENSE)
[![Gitter](https://badges.gitter.im/join_chat.svg)](https://gitter.im/terminalizer/Lobby)
[![Unicorn](https://img.shields.io/badge/nyancat-approved-ff69b4.svg)](https://www.youtube.com/watch?v=QH2-TGUlwu4)

> Record your terminal and generate animated gif images

<p align="center"><img src="/img/demo.gif?raw=true"/></p>

Built to be jusT cOol 👌🦄 !

> If you think so, support me by a `start` and a `follow` 😘

Built while listening to [Ever Felt Pt.1 - Otis McDonald](https://www.youtube.com/watch?v=-BiXhuRq7fU) 🎵 And [Nyan Cat](https://www.youtube.com/watch?v=QH2-TGUlwu4) 😛

# Table of Contents

* [Features](#features)
* [Installation](#installation)
* [Getting Started](#getting-started)
* [Compression](#compression)
* [Usage](#usage)
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
* [License](#license)

## Features

* Highly customizable.
* Corss platform (Linux, Windows, MacOS).
* Custom `window frames`.
* Custom `font`.
* Custom `colors`.
* Custom `styles` with `CSS`.
* Watermark.
* Edit before rendering.
* Skipping frames by a step value to reduce the number of rendered frames.
* Render images with texts on them instead of capturing your screen for better quality.
* The ability to configure:
  * The command to capture (bash, powershell.exe, yourOwnCommand, etc)
  * The current working directory.
  * Explicit values for the number of cols and rows.
  * GIF quality and repeating.
  * Frames delays.
  * The max idle time between frames.
  * cursor style.
  * font.
  * font size.
  * line height.
  * letter spacing.
  * theme.

## Installation

You need first to install [Node.js](https://nodejs.org/en/download/), then install the tool globally using this command:

```bash
npm install -g terminalizer
```

<p align="center"><img src="/img/install.gif?raw=true"/></p>

## Getting Started

Start recording your terminal using the command `record`.

```bash
terminalizer record demo
```

A file called `demo.yml` will be created in the current directory. You can open it using any editor to edit the configurations and the recoreded frames. You can replay your recording using the command `play`.

```bash
terminalizer record demo
```

Now let's render our recording as an animated gif.

```bash
terminalizer render demo
```

### Compression

GIF compression is not implementated yet. For now we recommend [https://gifcompressor.com](https://gifcompressor.com).

## Usage

> You can use the option `--help` to get more details about the commands and their options.

```bash
terminalizer <command> [options]
```

### Config

> Generate a config file in the current directory

```bash
terminalizer config
```

### Record

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
terminalizer record foo --config config.yml  Start recording with with your own configurations
```

### Play

> Play a recording file on your terminal

```bash
terminalizer play <recordingFile>
```

Options

```
-r, --real-timing   Use the actual delays between frames as recorded        [boolean] [default: false]
-s, --speed-factor  Speed factor, multiply the frames delays by this factor [number] [default: 1]
```

### Render

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

### Share

> Upload a recording file and get a link for an online player

```bash
terminalizer share <recordingFile>
```

### Generate

> Generate a web player for a recording file

```bash
terminalizer generate <recordingFile>
```

## Configurations

The default `config.yml` file is stored at root directory of the project. Execute the bellow command to copy it to your current directory.

> Use any editor to edit the copied `config.yml`, then use the option `-c` to overwrite the default one.

```bash
terminalizer config
```

## Recording

* `command`: Specify a command to be executed like `/bin/bash -l`, `ls`, or any other commands. The default is `bash` for `Linux` or `powershell.exe` for `Windows`.
* `cwd`: Specify the current working directory path. The default is the current working directory path.
* `env`: Export additional ENV variables, to be read by your scripts when start recording.
* `cols`: Explicitly set the number of columns or use `auto` to take the current number of columns of your shell.
* `rows`: Explicitly set the number of rows or use `auto` to take the current number of columns of your shell.

## Delays

* `frameDelay`: The delay between frames in ms. If the value is `auto` use the actual recording delays.
* `maxIdleTime`: Maximum delay between frames in ms. Ignored if the `frameDelay` isn't set to `auto`. Set to `auto` to prevnt limiting the max idle time.

## GIF

* `quality`: The quality of the generated GIF image (1 - 100).
* `repeat`: Amount of times to repeat GIF:
  * If value is `-1`, play once.
  * If value is `0`, loop indefinitely.
  * If value is `a` positive number, loop n times.

## Terminal

* `cursorStyle`: Cursor style can be one of `block`, `underline`, or `bar`.
* `fontFamily`: You can use any font that is installed on your machine like `Monaco` or `Lucida Console`.
* `fontSize`: The size of the font in pixels.
* `lineHeight`: The height of lines in pixels.
* `letterSpacing`: The spacing between letters in pixels.

## Theme

You can set the colors of your terminal using one of the CSS formats:

* Hex: `#FFFFFF`.
* RGB: `rgb(255, 255, 255)`.
* HSL: `hsl(0, 0%, 100%)`.
* Name: 'white', 'red', 'blue', 

> You can use the the value `transparent` too.

The default colors that are assigned to the termianl colors are:

* background: transparent
* foreground: <code style="background-color: #afafaf">#afafaf</code>.
* cursor: <code style="background-color: #c7c7c7">#c7c7c7</code>.
* black: <code style="background-color: #232628;">#232628</code>.
* red: <code style="background-color: #fc4384">#fc4384</code>.
* green: <code style="background-color: #b3e33b">#b3e33b</code>.
* yellow: <code style="background-color: #ffa727">#ffa727</code>.
* blue: <code style="background-color: #75dff2">#75dff2</code>.
* magenta: <code style="background-color: #ae89fe">#ae89fe</code>.
* cyan: <code style="background-color: #708387">#708387</code>.
* white: <code style="background-color: #d5d5d0">#d5d5d0</code>.
* brightBlack: <code style="background-color: #626566">#626566</code>.
* brightRed: <code style="background-color: #ff7fac">#ff7fac</code>.
* brightGreen: <code style="background-color: #c8ed71">#c8ed71</code>.
* brightYellow: <code style="background-color: #ebdf86">#ebdf86</code>.
* brightBlue: <code style="background-color: #75dff2">#75dff2</code>.
* brightMagenta: <code style="background-color: #ae89fe">#ae89fe</code>.
* brightCyan: <code style="background-color: #b1c6ca">#b1c6ca</code>.
* brightWhite: <code style="background-color: #f9f9f4">#f9f9f4</code>.

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

* `watermark.imagePath`: An absolute path for the image on your machine or a url.
* `watermark.style`: Apply CSS styles (camelCase) to the watermark image, like resizing it.

## Frame Box

Terminalizer comes with predefined frames that you can use to make your GIF images look cool.

* `frameBox.type`: Can be `null`, `window`, `floating`, or `solid`.
* `frameBox.title`: To display a title for the frame or `null`.
* `frameBox.style`: To apply custom CSS styles or to overwrite the current onces.

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

You can disable the default shadows and margins by:

<p align="center"><img src="/img/frames/solid_without_title_without_shadows.gif?raw=true"/></p>

```
frameBox:
  type: solid
  title: null
  style:
    boxShadow: none
    margin: 0px
```

# License

This project is under the MIT license.
