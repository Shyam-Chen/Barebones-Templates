# _PROJECT_NAME_

## Prerequisites

- Node.js v22
- PNPM v9
- Tauri v2

## Usage

```sh
$ pnpm install
```

### iOS

```sh
$ sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
$ xcrun -f devicectl
```

```sh
$ pnpm tauri ios init
# Xcode -> Open Developer Tool -> Simulator -> File -> Open Simulator -> iPhone Pro

$ pnpm dev:mobile # $ pnpm tauri ios dev
# select emulator
```

```sh
$ rm -rf ./src-tauri/gen/apple
$ pnpm tauri ios init
```

### macOS

```sh
$ pnpm dev:desktop # $ pnpm tauri dev
```

### Android

```sh
$ cd Library/Android/sdk/ndk/
$ ls
# 26.2.11394342

export NDK_HOME="$ANDROID_HOME/ndk/26.2.11394342"
```

```sh
$ pnpm tauri android init
$ pnpm tauri android dev
# select emulator
```

```sh
$ rm -rf ./src-tauri/gen/android
$ pnpm tauri android init
```

### Windows

```sh
$ pnpm tauri dev
```
