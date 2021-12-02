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
tmux new-session -s <session_name>

# 分离会话，会话仍然在后台运行
tmux detach

# 接入某个会话
tmux attach-session -t <session_name> 

# 杀死某个会话
tmux kill-session -t <session_name>

# 杀死所有会话
tmux kill-server

# 会话内切换会话
tmux switch-client -t <session_name>
```

**会话相关快捷键**

```sh
<leader> + d  # 分离会话
<leader> + s  # 列出所有会话，可用上下或者jk切换，使用左右或者hl收起或者展开
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
<leader> + w  # 列出所有窗口（不限于同一会话），可用上下或者jk切换，使用左右或者hl收起或者展开
<leader> + &  # 关闭当前窗口，需要y确认，也可使用命令exit
```

### 3. 窗格

**窗格相关快捷键**

```sh
<leader> + %  # 左右切分出2个窗格
<leader> + "  # 上下切分出2个窗格"
<leader> + <arrow_key>  # 切换光标到其他窗格
<leader> + z  # 最大化当前窗格，再执行则恢复
<leader> + x  # 关闭当前窗格，需要y确认，也使用命令exit
<leader> + !  # 将当前窗格分离出去，成为窗口
<leader> + ctrl + <arrow_key>  # 调整窗格大小
```

### 4. 其他

```sh
tmux source-file ~/.tmux.conf  # 使配置文件生效
<leader> + ?  # 查看帮助
```

## tmux 配置

tmux 的配置文件在 `~/.tmux.conf`。

添加以下配置修改默认前缀键为 `<C-a>`。

```conf
unbind C-b
set -g prefix C-a
bind C-a send-prefix
```

(optional 后文有vim-tmux导航插件能更好的替代这条配置)添加以下配置就可以使用 `<leader>` + `hjkl` 移动光标到其他窗格。

```conf
bind-key h select-pane -L
bind-key j select-pane -D
bind-key k select-pane -U
bind-key l select-pane -R
```

添加以下配置使用可以使用鼠标操作窗格，包括切换光标所在窗格，调整窗格大小。

```conf
set-option -g mouse on
```

添加以下配置可以使用 `<leader> + r` 重载配置。

```conf
bind r source-file ~/.tmux.conf \; display "Reloaded ~/.tmux.conf"
```

## tmux plugin manager

tmux 可以使用 [tpm](https://github.com/tmux-plugins/tpm) 安装插件。

首先 clone tpm:
```git
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

然后将下列内容添加到 `~/.tmux.conf` 文件的最底部。

```conf
# List of plugins
set -g @plugin 'tmux-plugins/tpm'

# Other examples:
# set -g @plugin 'github_username/plugin_name'
# set -g @plugin 'github_username/plugin_name#branch'
# set -g @plugin 'git@github.com:user/plugin'
# set -g @plugin 'git@bitbucket.com:user/plugin'

# Initialize TMUX plugin manager (keep this line at the very bottom of tmux.conf)
run '~/.tmux/plugins/tpm/tpm'
```

然后使用 `<leader> + r` 重载配置。

```
# tpm快捷键
<leader> + I  # 安装插件
<leader> + U  # 更新插件 
```


上面有 examples 告诉你如何添加插件，下面推荐几个我常用的。

### 1. tmux 保存和恢复插件

当运行 tmux 服务的计算机关闭或者重启时，tmux 中的会话无法保存下来。使用 [tmux-resurrect](https://github.com/tmux-plugins/tmux-resurrect) 插件可以在关机前执行 `<leader> + <C-s>` 保存会话，下次进入 tmux 后执行 `<leader> + <C-r>` 恢复会话。 

使用 [tmux-continuum](https://github.com/tmux-plugins/tmux-continuum) 插件就可以自动保存，进入 tmux 后自动恢复。

添加以下插件到 `~/.tmux.conf` 中，并重载配置文件。

```conf
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-continuum'
# restore neovim session
set -g @resurrect-strategy-nvim 'session'
set -g @resurrect-capture-pane-contents 'on'
set -g @continuum-restore 'on'  # 注释掉这行就可以关闭进入tmux就自动恢复会话
```

```
# resurrect快捷键
<leader> + <C-s>  # 保存会话
<leader> + <C-r>  # 恢复会话
```

### 2. vim-tmux 导航统一快捷键

插件：[vim-tmux-navigator](https://github.com/christoomey/vim-tmux-navigator)

tmux 插件安装，添加以下到 `~/.tmux.conf` 中。

```
set -g @plugin 'christoomey/vim-tmux-navigator'
```

然后执行

```
<leader> + r  # 重载配置
<leader> + I  # 安装插件 
```

vim 插件安装（如使用 vim-plug)，添加以下到 vim 配置文件中。
```
Plug 'christoomey/vim-tmux-navigator'
```

然后执行

```
:PlugInstall
```

**使用方式**

通过 `<C-h/j/k/l>` 导航 vim 中的分屏窗格和 tmux 窗格，并且支持直接从 vim 导航到 tmux 中，对于在 tmux 中的导航也无需再按繁琐的前缀键。

## 参考资料

1. [Tmux 使用教程 by 阮一峰](https://www.ruanyifeng.com/blog/2019/10/tmux.html)
2. [Linux 下的终端神器 by 喷气式蜗牛](https://www.bilibili.com/video/BV1da4y1p7e1?from=search&seid=17038472467815571019&spm_id_from=333.337.0.0)
3. [优雅地使用命令行：Tmux 终端复用 by lakeone](https://www.cnblogs.com/lakeone/p/5424609.html)
4. [Tmux Plugin Manager](https://github.com/tmux-plugins/tpm)
5. [Tmux Plugin Manager使用及具体插件 by hongda](https://www.cnblogs.com/hongdada/p/13528984.html) 
6. [The Tao of tmux by Tony Narlock](https://leanpub.com/the-tao-of-tmux/read#thinking-tmux)
