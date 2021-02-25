---
title: "Git 学习笔记"
date: 2021-02-24T20:34:16+08:00
weight: 
description: 环境：win10, git@2.30.1.windows.1
tags: [Git]
categories: [Git]
series: []
algorithms: []
comments: true
displayCopyright: true
toc: true
draft: true
---

本文是一篇学习笔记，虽然 Yuhi 已经使用 Git 一年多了，但对其工作原理一直没有深入理解，部分命令也常常忘记，因此在这里整理 Git 的相关工作原理以及常用命令，以备查阅，本文会随着学习的深入不断更新。

<!--more-->

## 工作原理

### 文件状态变化

在 Git 仓库中，文件分为 **已跟踪（tracked）**或**未跟踪（untracked）** 两种状态。

已跟踪的文件指已经受 Git 版本控制的文件，只要被 `git add` 过的文件，状态就会从 untracked 变成 tracked；未跟踪的文件，一般是在仓库目录下，但没有参与版本控制的文件，比如刚刚新建的文件，或者是从来没有 `git add` 的文件。

一旦某一文件被跟踪，那么它就会处于 **未修改（unmodified）、已修改（modified）、已暂存（staged）** 状态中的一种。

{{< img src="file_life_cycle.png" title="文件的状态变化周期">}}

上图来源[^1] 

## Git 配置

### 配置文件

```powershell
# 各级配置
Config file location
    --global              use global config file
    --system              use system config file
    --local               use repository config file
    --worktree            use per-worktree config file
    -f, --file <file>     use given config file
    --blob <blob-id>      read config from given blob object
```

 通常只需要 global 和 local 两种配置就可以满足需求了。

1. 用户级（global）配置：针对当前登录的用户，存放在 `~/.gitconfig` 中。

2. 仓库级（local）配置：针对特定仓库，存放在仓库目录下的 `.git/config` 中。

local 的优先级高于 global，优先级高的配置项会覆盖优先级低的相同配置项。

### 配置用户名和邮箱

```powershell
# global
git config --global user.name "yuhixyz"
git config --global user.email "example@yuhi.xyz"

# local 可选参数 [--local]
git config user.name "gugugu"
git config user.email "example@gugugu.com"
```

### 查看配置信息

```powershell
# 查看所有配置项信息，可选参数 [--global] [--local] 等
git config --list
# 查看特定项
git config <key>
git config user.name
```

## Git 基本命令

### 初始化

```powershell
# 新建本地仓库
git init  # 初始化当前目录为 git 仓库
git init <local_repo_name>  # 在当前目录下新建文件 local_repo_name 并初始化为 git 仓库

# 克隆远程仓库，将会自动使用origin关联远程库
git clone <url>
```



### 撤销操作

```powershell
# init commit 后发现忘记将文件 forget.md 加入暂存区
git commit -m "init"
git add forget.md
git commit --amend  # 重新提交 commit 信息仍使用 "init"

# commit 信息写错了
git commit -m "wrong commit info"
git commit -m "correct commit info" --amend

```



## 参考文献

1. https://git-scm.com/book/zh/v2
2. http://www.ruanyifeng.com/blog/2018/10/git-internals.html
3. http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html



[^1]: [https://git-scm.com/book/zh/v2/Git-基础-记录每次更新到仓库](https://git-scm.com/book/zh/v2/Git-%E5%9F%BA%E7%A1%80-%E8%AE%B0%E5%BD%95%E6%AF%8F%E6%AC%A1%E6%9B%B4%E6%96%B0%E5%88%B0%E4%BB%93%E5%BA%93)