---
title: "tmux 学习笔记"
date: 2021-10-24T19:19:00+08:00
weight: 
description: 本文是一篇学习笔记，不宜作为教程食用。
tags: [tmux]
categories: [Tools]
series: []
algorithms: []
comments: true
displayCopyright: true
toc: true
draft: false
---

## tmux 简介

tmux是一个终端复用器（terminal multiplexer），主要可以用于分屏和保持会话。保持会话的意思是，即使关闭终端窗口，或者 SSH 由于各种原因连接中断，在服务器端 tmux 中的会话和对应的进程仍然不会终止。好处是当我们 reattach 到某一个会话中，其仍然保持着连接中断前的状态，即能够保存工作环境和历史，另外 tmux 能够用来跑一些需要持续运行的服务。

tmux 能够创建多个会话（session），每个会话能够创建多个窗口（window），每个窗口又可以分为多个窗格（pane）。同时，每个会话支持多人实时共享。tmux 结构如下所示。

```
session0:
    window0:
        pane0
        pane1
        ...
    window1:
    ...
session1:
...
```

许多情况下，只需要 1 个 session 对应 1 个 window 对应多个 pane 即可满足需求了。

## tmux 安装

```sh
# macos 
brew install tmux
# centos
yum install tmux
```

## 常用命令和快捷键

tmux 中的快捷键都以前缀键开始，默认前缀键为 `ctrl+b`，下文写作 `<leader>`，按下前缀键后松开，再按后续快捷键。

### 1. 会话

**会话相关命令**

```sh
# 进入 tmux，这里实际上是新建了一个未指定名称的会话，名称从0开始编号
tmux

# 退出 tmux
exit  # 或者 ctrl+d

# 查看所有 tmux 会话
tmux ls 

# 新建会话，指定名称
tmux new -s <session_name>

# 分离会话，会话仍然在后台运行
tmux detach

# 接入某个会话
tmux attach -t <session_name>  # attch 也可简写为 a

# 杀死某个会话
tmux kill-session -t <session_name>

# 杀死所有会话
tmux kill-server

# 切换会话
tmux switch -t <session_name>
```

**会话相关快捷键**

```sh
<leader> + d  # 分离会话
<leader> + s  # 列出所有会话，可用上下方向键切换
<leader> + $  # 重命名会话
```

### 2. 窗口

**窗口相关快捷键**

```sh
<leader> + c  # 新建一个窗口
<leader> + p  # 切换到前一个窗口
<leader> + n  # 切换到后一个窗口
<leader> + <number>  # 切换到指定编号的窗口
<leader> + ,  # 重命名窗口
<leader> + w  # 列出所有窗口（不限于同一会话），可用上下方向键切换
```

### 3. 窗格

**窗格相关快捷键**

```sh
<leader> + %  # 左右切分出2个窗格
<leader> + "  # 上下切分出2个窗格"
<leader> + <arrow_key>  # 切换光标到其他窗口
<leader> + z  # 最大化当前窗格，再执行则恢复
<leader> + x  # 关闭当前窗格，需要y确认，也使用命令exit
<leader> + !  # 将当前窗格分离出去，成为窗口
<leader> + ctrl + <arrow_key>  # 调整窗格大小
```



## 参考资料

1. [Tmux 使用教程 by 阮一峰](https://www.ruanyifeng.com/blog/2019/10/tmux.html)
2. [Linux 下的终端神器 by 喷气式蜗牛](https://www.bilibili.com/video/BV1da4y1p7e1?from=search&seid=17038472467815571019&spm_id_from=333.337.0.0)