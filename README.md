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

# 项目启动
> - ~~项目启动 `electron-forge start` 或者 `npm run start`~~
>   - 指定开发环境以打开开发者工具`cross-env NODE_ENV=development electron-forge start`
> - ~~打包 `electron-forge package` 或者 `npm run package`~~
> - 打包 `yarn run package` 或者 `electron-forge package`

# node java 说明
> `https://github.com/joeferner/node-java`

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

# 可能遇到的问题
> - `gyp: name 'openssl_fips' is not defined while evaluating condition 'openssl_fips != ""' in binding.gyp while trying to load binding.gyp` <br>
> 解决办法: 
>   - 修改项目下 `node_modules\java`路径中的文件 `binding.gyp`, 在`variables`节点中添加`"openssl_fips" : "0"`即可. (记得json格式, 如果加载顶部, 记得加`,`)
>
> 
> - 启动之后在开发者工具中报错`Uncaught Error: Cannot find module '../build/jvm_dll_path.json'` <br>
> 解决办法: 
>   - 1.在`node_modules/java`文件夹中运行`node postInstall.js` <br>
>   - 2.或者直接在`node_modules\java\build`中创建一个名为jvm_dll_path.json的文件并将服务器路径粘贴到该文件中,例如`";C:\\Program Files\\Java\\jdkX.X.X_XXX\\jre\\bin\\server"`