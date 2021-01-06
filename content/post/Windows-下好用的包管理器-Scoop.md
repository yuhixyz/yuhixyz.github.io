---
title: "Windows 下好用的包管理器 Scoop"
date: 2020-01-19T14:23:21+08:00
weight: 
description: 墙裂推荐
tags: [Scoop]
categories: [Tools]
series: []
algorithms: []
comments: true
displayCopyright: true
toc: true
draft: false
---

[Scoop](https://scoop.sh/) 很大程度提升了我的 Windows 体验。

<!--more-->

> 主要是因为最近 Surface 送修，回来之和全要重新配置，于是开始陆续整理一些工具的简明使用教程，以便到时快速复原工作环境。

## 写在前面

作为一个 Windows 用户，常常会遇到这种情形：当我想要下载一个软件，在查询一些教程时，里面常常写道：推荐 Mac 用户使用 `brew install xxx`，然后扔给 Windows 用户一个链接，自己下载去吧，然后安装完可能还需要配个环境变量。后来才了解 到 Windows 下 还有 `scoop` 这么好用的包管理器。

## Scoop 安装

`scoop` 默认安装在 `C:\Users\Yuhi\scoop` 路径下，如果想要自定义安装路径，比如我想要将它安装到 `D:\Files\scoop` 路径 。需要为新的 `scoop` 路径设置环境变量。

在 `Powershell` 中分别执行以下命令

```powershell
[environment]::setEnvironmentVariable('SCOOP','D:\Files\scoop','User')
$env:SCOOP='D:\Files\scoop'
```

然后我们安装 `scoop`

```powershell
set-executionpolicy remotesigned -scope currentuser
iex (new-object net.webclient).downloadstring('https://get.scoop.sh')
```

然后可以在 `Powershell` 中通过 `scoop help` 命令查看使用帮助

{{< img src="scoop_help.png" >}}

上面列出了一些常用命令，以及 `scoop` 命令的基本形式

```powershell
scoop <command> [<args>]
```

## Scoop 的常用命令

### 常用命令

```cpp
scoop help <command>
scoop update <app> [options]
scoop search <query>
scoop install <app> [options]
scoop uninstall <app>
scoop bucket add|list|known|rm [<args>]
```

+ `scoop update` 不加参数，就是更新 `scoop` 自身，参数为 `app` 名称。
+ `scoop bucket list` 会显示当前已经添加的 `bucket`（最初只有一个 `main bucket`），这里的 `bucket` 可以认为是一个 `git` 仓库，里面收录了一些 `app` 的下载信息。我们想要安装的 `app` 必须被当前已经添加的 `bucket` 中收录。
+ `scoop bucket known` 会显示当前 `scoop` 已知的一些 `bucket`，比如 `main`，`extras`, `versions`, `nerd-fonts`...这是我常用的几个（其他也没用到过）。对于这些 `bucket` 我们可以通过 `scoop bucket add <bucket name>` 来添加。
+ `scoop search <app>` 命令会在已知的 `bucket`（注意是已知的即 `scoop bucket known` 中出现的）中查找该 `app`，`scoop` 会告知你它处于哪个 `bucket` ，如果你需要安装该 `app` 那么首先你需要添加其所属于的 `bucket`，即 `scoop bucket add <bucket name>` （如果已经添加过了就不需要了）再执行 `scoop install <app>`。
+ `scoop install <app>` 就是安装 `app`，比如 `scoop install git`。
+ `scoop uninstall <app>` 就是卸载 `app`，比如 `scoop uninstall everything`。

### 配置 Http 代理

`scoop` 不配置代理其实还是挺慢的，挂代理之后就起飞了嘿嘿。

```powershell
scoop config proxy 127.0.0.1:10809
```

{{< img src="scoop_http.png" width="90%" >}}

取消代理

```powershell
scoop config rm proxy
```

## Scoop 安装应用

首先，`scoop` 的使用必须安装的两个 `app: 7zip & git` 。

```powershell
scoop install 7zip
scoop install git
```

安装 `aria2` 后会自动开启多线程下载

```powershell
scoop install aria2
```

如果下载效果不好，也是可以关闭 `aria2` 的

```powershell
scoop config aria2-enabled false 
```

在此之后我先添加了一些我常用的 `bucket`，也就是 `extras`，`versions`，`nerd-fonts`...

```powershell
scoop bucket add extras
scoop bucket add versions
scoop bucket add nerd-fonts
```

安装特定版本的应用

```powershell
scoop install hugo-extended@0.72.0
```

然后就是一些常用软件的安装 （就不解释它们干啥用的了，应该都比较著名 qwq）

{{% admonition note "常用软件" "true" %}}

建议安装应用之前先 `scoop search <app>`，可以通过 `app` 名字模糊搜索得到其在 `scoop bucket` 收录的名称。

+ `wox`
+ `everything`
+ `typora`
+ `vscode`
+ `sublime-text`
+ `sudo`
+ `opensssl`
+ `nodejs`
+ `geekuninstaller`
+ `screentogif`
+ `potplayer`
+ `snipaste`
+ `quicklook`

下面是我的 `scoop list`

{{< img src="scoop_list.png" >}}

{{% /admonition %}}

## 参考资料

1. [Scoop Wiki](https://github.com/lukesampson/scoop/wiki)
2.  [「一行代码」搞定软件安装卸载，用 Scoop 管理你的 Windows 软件](https://sspai.com/post/52496)
3. [hongda's blog](https://www.cnblogs.com/hongdada/p/11844277.html)