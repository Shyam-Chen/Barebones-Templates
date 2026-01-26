# Barebones Templates

🍖 This repository holds most of the starter templates for application development using [TypeScript](https://www.typescriptlang.org/) and [Rust](https://rust-lang.org/).

## Get started

Those templates dependencies are maintained via [pnpm](https://pnpm.io/) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

These templates are meant to be used as is via the [degit](https://github.com/Rich-Harris/degit) utility.

### [Vue Template](./vue) for Web-side Coding

Barebones starting point for [Vue](https://vuejs.org/) projects.

```sh
pnpm dlx degit Shyam-Chen/Barebones-Templates/vue my-vue-project
```

### [Fastify Template](./fastify) for Server-side Coding

Barebones starting point for [Fastify](https://fastify.dev/) projects.

```sh
pnpm dlx degit Shyam-Chen/Barebones-Templates/fastify my-fastify-project
```

### [Pulumi Template](./pulumi) for Cloud-side Coding

Barebones starting point for [Pulumi](https://www.pulumi.com/) projects.

```sh
pnpm dlx degit Shyam-Chen/Barebones-Templates/pulumi my-pulumi-project
```

### [Tauri Template](./tauri) for Native-side Coding

Barebones starting point for [Tauri](https://tauri.app/) projects.

```sh
pnpm dlx degit Shyam-Chen/Barebones-Templates/tauri my-tauri-project
```

---

# Gen AI Engineering

## Part 1: Gen AI Chat Assistant

- `client`
  - `vue`
  - `markdown-it`
  - Google OAuth 2.0
- `server`
  - `fastify`
  - Google AI Studio
  - Qdrant
  - MongoDB
- `infra`
  - `pulumi`
  - Google Cloud

多階段漸進演示方向：

- [x] 封裝 Gemini (SSE 回覆)
  - [ ] + 短期記憶
  - [ ] + Tool (Google 搜尋)
- [ ] Gemini RAG 知識庫
  - [ ] + 短期記憶
  - [ ] + Tool (找當前用戶)

```coffee
genai
  ├── client
  │   ├── src
  │   └── package.json
  ├── server
  │   ├── src
  │   └── package.json
  └── infra
      ├── src
      └── package.json
```

## Part 2: Gen AI Voice Assistant

- `client`
  - `vue`
  - `markdown-it`
  - Google OAuth 2.0
  - `tauri`
  - Windows App
  - Android App
  - Raspberry Pi 5 Model B
  - Raspberry Pi Touch Display 2
- `server`
  - `fastify`
  - Google AI Studio
- `infra`
  - `pulumi`
  - Google Cloud
- `device`
  - `embassy-rp`
  - Raspberry Pi Pico 2 W

演示：

- 跨平台語音對話，螢幕文字算繪
- 閒置 10 分鐘進入「待機」狀態，喚醒詞為「Hey Gemini」(嵌入式設備上)

```coffee
genai2
  ├── client
  │   ├── src
  │   ├── src-tauri
  │   │   ├── src
  │   │   └── Cargo.toml
  │   └── package.json
  ├── server
  │   ├── src
  │   └── package.json
  ├── infra
  │   ├── src
  │   └── package.json
  └── device
      ├── src
      └── Cargo.toml
```
