# init

```shell
yarn create vue
```

## Project Setup

```sh
yarn install
```

### Compile and Hot-Reload for Development

```sh
yarn run dev
```

### Type-Check, Compile and Minify for Production

```sh
yarn run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn run lint
```

# electron

## 安装electron

```shell
yarn add electron@^29.1.4 electron-builder@^24.13.3 --dev
```

## 配置主进程文件

在package.json文件中配置"main"字段

```
"main": "electron-index.js"
```

## 配置启动命令/打包命令

```json
  "scripts": {
    "dev:exe": "electron .",
    "build:exe": "electron-builder build"
  }
```

```shell
# 测试
## 1 启动vue服务
yarn run dev
## 2 启动electron
yarn run dev:exe

# 打包
yarn run build:exe
```
