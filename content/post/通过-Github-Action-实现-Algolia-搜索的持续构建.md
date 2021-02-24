---
title: "通过 Github Action 实现 Algolia 搜索的持续构建"
date: 2020-11-24T13:12:53+08:00
weight: 
description:
tags: [Github Action]
categories: [Github]
series: []
algorithms: []
comments: true
displayCopyright: true
toc: true
draft: true
---

本博客已通过 `Github Action` 部署于 `Github Pages`，而博客的搜索功能依托 `Algolia` 进行，每次更新文章后，都需要在本地生成 `json` 格式的文件并上传到 `Algolia` 云端，本文将探讨如何这一麻烦的步骤集成到 `Github Action` 中。

<!--more-->

我们需要做的改变即，将发送数据到 `Algolia` 服务器这一操作，从本地转移到 `Github Action` 中。

这里使用 [`hugo-algolia`](https://github.com/replicatedhq/hugo-algolia) 插件简化操作。在本地，我们需要在 `Hugo` 博客的根目录新建 `config.yaml` 文件，里面配置用户在 `Algolia` 的应用信息。

根据插件作者的说明，`config.yaml` 配置如下：

```yaml
---
baseURL: "/"
languageCode: "en-us" 
title: "Your site name"
theme: "your-theme"
description: "A cool site!"

algolia:
  index: "index-name"
  key: "[your API key]" # Admin API Key
  appID: "[your app id]" # Application ID
---
```

配置完成后在根目录执行 `hugo-algolia -s` 即可在本地生成 `json` 文件并上传到 `Algolia` 服务器。

现在我们想要在 `Github Action` 中使用 `hugo-algolia -s` 命令，同样要求博客根目录要有 `algolia` 项的完整配置。

其中的 `key` 配置 ` Admin API Key`，这个私钥不能公开，也就是说不能将它直接传到公共仓库中，而 `index` 和 `appID` 无所谓。

> If you don't want to set your write key in your config.yaml, you can also use environment variables. Just set a variable ALGOLIA_WRITE_KEY to the write key for your account, and the module will use that instead.

因此我们可以为 `key` 单独设置一个环境变量。即 Settings > Secrets > New repository secret 新建 `Name` 为 `ALGOLIA_WRITE_KEY`，`Value` 为 `Admin API Key`（把实际值填进去，不是这个字符串） 。然后在 `config.yaml` 中删除该项。

那么在 `Github Action` 的工作流配置文件 `build.yml` 中需要添加（加粗部分）：

```diff
name: build

on:
  push:
    branches:
      - master # push到master分支时触发

jobs:
  deploy:
    runs-on: ubuntu-18.04
    steps:
      - uses: actions/checkout@v1
        with:
          submodules: true
      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.72.0'
          extended: true

      - name: Build # hugo生成public
        run: |
          git config --global core.quotepath false         
          hugo --gc --minify --cleanDestinationDir
      
+     - name: Node.js # npm
+       uses: actions/setup-node@v1
+       with:
+         node-version: '12.x'
+
+     - name: Algolia # algolia搜索
+       run: |
+         npm install hugo-algolia -g
+         hugo-algolia -s
+       env:
+         ALGOLIA_WRITE_KEY: ${{ secrets.ALGOLIA_WRITE_KEY }} # Admin API Key

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_branch: build
          force_orphan: true
```

相关说明：需要安装 `hugo-algolia` 插件必须使用 `npm`，要使用 `npm` 需要 `node.js`， `hugo-algolia -s` 命令需要博客根目录有 `config.yaml` 中 `algolia` 的完整配置项（直接上传到仓库），其中缺少的 `key` 通过 `Github` 的环境变量引用进来，方式为 `${{ secrets.ALGOLIA_WRITE_KEY }}` 。