# HGWechatApplet

HelloGitHub 官方微信小程序

## 目录

...

## 技术栈

- 原生小程序
- ES6 + TS
- less

## 开始开发

### 项目结构

```
.
├── src                     // 源码
│   ├── assets
│   │   └── images          // 静态图片资源
│   ├── icons               // 图标
│   ├── pages               // 页面
│   ├── styles              // 公共样式
│   ├── utils               // 工具库
│   ├── app.json
│   ├── app.less
│   ├── app.ts
│   ├── config.ts           // 应用内的全局配置文件
│   └── sitemap.json
├── tools                   // 开发流程中使用到的辅助脚本
│   └── loadEnv.js
├── typings                 // typescript 声明文件
│   ├── wx
│   ├── index.d.ts
│   └── lib.wa.es6.d.ts
├── .env                    // 公用环境变量配置文件
├── .env.local              // 本地环境变量配置文件，该文件包含敏感信息不纳入版本管理
├── .gitignore
├── gulpfile.js             // gulp 配置文件
├── package.json
├── project.config.json     // 小程序项目配置文件
├── README.md
├── tsconfig.json
└── yarn.lock

10 directories, 17 files
```

### 准备工作

**克隆本仓库**

```sh
git clone https://github.com/HelloGitHub-Team/HGWechatApplet.git
```

**修改开发配置**

为确保项目正常运行，请按以下步骤完成本地开发配置：

- 复制`.env`为`.env.local`
- 根据管理员提供的账号信息修改`.env.local`中的相关配置

注意： `.env`为隐藏文件

### 本地开发

1. 进入项目根目录，使用命令`yarn install`安装依赖

2. 使用命令`yarn dev`进行本地开发预览

3. 使用命令`yarn build`进行本地构建打包

注意：

- 请使用 `TypeScript` 或 `ES6` 进行编码！！！
- 为确保协同开发的可控性，请不要直接在`master`或`dev`分支进行开发！

  本地开发应创建本地临时分支，如：`git checkout -b feature/xxx`

- 由于项目使用`gulp`进行打包，所以“微信开发工具”实际只充当“预览工具”，请尽量避免直接使用“微信开发工具”编辑代码
- 建议使用 vscode 进行编码，推荐安装[minapp](https://github.com/wx-minapp/minapp-vscode)插件进行小程序开发

### Code Review

...

### TODOS

- [x] 添加`代码规范`
- [ ] 添加`提交规范` ???
- [ ] 完善`开发文档`

## 声明

<a rel="license" href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh"><img alt="知识共享许可协议" style="border-width: 0" src="https://licensebuttons.net/l/by-nc-nd/4.0/88x31.png"></a><br>本作品采用<a rel="license" href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh">署名-非商业性使用-禁止演绎 4.0 国际 </a>进行许可。
