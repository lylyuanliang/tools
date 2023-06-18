# tools
kafka工具

# 项目依赖
>## 安装yarn
>[官网地址](https://yarn.bootcss.com/) <br>
> `npm install --global yarn` <br>
> `yarn --version`
> 注: 记得将 `node_global`对应的路径添加到环境变量
> ### 查看镜像地址
> `yarn config get registry`
> ### 设置淘宝镜像
> `yarn config set registry https://registry.npmmirror.com/`
> ### 还原镜像地址
> `yarn config set registry https://registry.yarnpkg.com`
> ### 镜像管理工具
> `yarn global add yrm`
> ### electron镜像设置
> `yarn config set electron_mirror https://npmmirror.com/mirrors/electron/`
>   - 查看所有镜像
>       `yrm ls`
> ### 安装项目依赖
> `yarn install`

# node 版本控制
> ## 工具
> `nvm`
> ### windows
> `nvm-windows`
> [下载地址](https://github.com/coreybutler/nvm-windows)
> <br>
> ### 命令
> - 安装最新版本的 Node
> `nvm install latest`
> - 安装 Node 的长期支持（LTS）版
> `nvm install lts`
> - 安装特定版本的 Node
>   - 查看可用的 Node 版本
>   `nvm list available`
>   - 安装该特定版本
>   `nvm install node-version-number` 例如 `nvm install 14.20.0`
> - 查看你在 Windows 机器上安装的 Node 版本列表
> `nvm list`
> - 使用特定版本的 Node
>   - 使用最新版本 `nvm use latest`
>   - 使用长期支持版本 `nvm use lts`
>   - 使用你已安装的任何其他版本 `nvm use version-number`
