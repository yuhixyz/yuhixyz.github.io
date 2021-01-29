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

```powershell
# Yuhi at SURFACE in ~ [12:51:26]
% scoop help
Usage: scoop <command> [<args>]

Some useful commands are:

alias       Manage scoop aliases
bucket      Manage Scoop buckets
cache       Show or clear the download cache
checkup     Check for potential problems
cleanup     Cleanup apps by removing old versions
config      Get or set configuration values
create      Create a custom app manifest
depends     List dependencies for an app
export      Exports (an importable) list of installed apps
help        Show help for a command
hold        Hold an app to disable updates
home        Opens the app homepage
info        Display information about an app
install     Install apps
list        List installed apps
prefix      Returns the path to the specified app
reset       Reset an app to resolve conflicts
search      Search available apps
status      Show status and check for new app versions
unhold      Unhold an app to enable updates
uninstall   Uninstall an app
update      Update apps, or Scoop itself
virustotal  Look for app's hash on virustotal.com
which       Locate a shim/executable (similar to 'which' on Linux)


Type 'scoop help <command>' to get help for a specific command.
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
scoop reset <app>
```

+ `scoop update` 不加参数，就是更新 `scoop` 自身，参数为 `app` 名称。
+ `scoop bucket list` 会显示当前已经添加的 `bucket`（最初只有一个 `main bucket`），这里的 `bucket` 可以认为是一个 `git` 仓库，里面收录了一些 `app` 的下载信息。我们想要安装的 `app` 必须被当前已经添加的 `bucket` 中收录。
+ `scoop bucket known` 会显示当前 `scoop` 已知的一些 `bucket`，比如 `main`，`extras`, `versions`, `nerd-fonts`...这是我常用的几个（其他也没用到过）。对于这些 `bucket` 我们可以通过 `scoop bucket add <bucket name>` 来添加。
+ `scoop search <app>` 命令会在已知的 `bucket`（注意是已知的即 `scoop bucket known` 中出现的）中查找该 `app`，`scoop` 会告知你它处于哪个 `bucket` ，如果你需要安装该 `app` 那么首先你需要添加其所属于的 `bucket`，即 `scoop bucket add <bucket name>` （如果已经添加过了就不需要了）再执行 `scoop install <app>`。
+ `scoop install <app>` 就是安装 `app`，比如 `scoop install git`。
+ `scoop uninstall <app>` 就是卸载 `app`，比如 `scoop uninstall everything`。
+ `scoop reset <app>` 用于切换不同版本。

### 配置 http 代理

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

**添加常用的 `bucket`**

```powershell
scoop bucket add extras
scoop bucket add versions
```

**查看目前有的 `bucket`**

```powershell
scoop bucket list
```

**安装特定版本的应用**

```powershell
scoop install hugo-extended@0.72.0  # 安装特定版本的 hugo-extended
scoop install python@3.7.9  # 安装特定版本的 python
scoop install python@3.8.7
```

**切换应用的不同版本**

比如上面同时安装了 `python3.7.9` 以及 `python3.8.7`。

此时在目录 `~/scoop/apps/python` 目录下可见如下结构：

```powershell
d-----        2020/12/3     20:09        1   3.7.9
d-----        2021/1/29     12:21        1   3.8.7
d-r--l        2021/1/29     12:26        1   current
```

由于 `python3.8.7` 后安装，因此此时在终端使用 `python` 命令，用的版本是 `3.8.7`，如果要切换版本，只需要如下命令

```powershell
scoop reset python@3.7.9  # 切换到3.7.9
scoop reset python@3.8.7  # 切换到3.8.7
```

**常用软件**

{{% admonition note "我的常用软件" "true" %}}

建议安装应用之前先 `scoop search <app>`，可以通过 `app` 名字模糊搜索得到其在 `scoop bucket` 收录的名称，再用正确的 `app` 名字进行安装 `scoop install <app>`。

下面是我的 `scoop list`

```powershell
# Yuhi at SURFACE in ~ [12:32:28]
% scoop list
Installed apps:

  7zip 19.00 [main]
  aria2 1.35.0-1 [main]
  curl 7.74.0_2 [main]
  dark 3.11.2 [main]
  gcc 9.3.0-2 [main]
  geekuninstaller 1.4.7.142 [extras]
  git 2.30.0.windows.2 [main]
  grep 2.5.4 [main]
  hugo-extended 0.72.0 [C:\Users\Yuhi\scoop\workspace\hugo-extended.json]
  innounp 0.50 [main]
  lessmsi 1.8.1 [main]
  lxrunoffline 3.5.0 [extras]
  nodejs 15.7.0 [main]
  openssl 1.1.1i [main]
  potplayer 201209 [extras]
  python 3.8.7 [C:\Users\Yuhi\scoop\workspace\python.json]
  qimgv 0.9.1 [extras]
  quicklook 3.6.10 [extras]
  screentogif 2.27.3 [extras]
  snipaste 1.16.2 [extras]
  sublime-text 3.2.2-3211 [extras]
  sudo 0.2020.01.26 [main]
  translucenttb 2020.2 [extras]
  typora 0.9.98 [extras]
  vscode 1.52.1 [extras]
  windows-terminal 1.4.3243.0 [extras]
  win-dynamic-desktop 4.4.0 [extras]
```

{{% /admonition %}}

## 参考资料

1. [Scoop Wiki](https://github.com/lukesampson/scoop/wiki)
2.  [「一行代码」搞定软件安装卸载，用 Scoop 管理你的 Windows 软件](https://sspai.com/post/52496)
3. [hongda's blog](https://www.cnblogs.com/hongdada/p/11844277.html)