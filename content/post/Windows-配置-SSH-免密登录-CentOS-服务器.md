---
title: "Windows 配置 SSH 免密登录 CentOS 服务器"
date: 2020-10-11T16:34:35+08:00
weight: 
description:
tags: [SSH]
categories: [Tools]
series: []
algorithms: []
comments: true
displayCopyright: true
toc: true
draft: false
---

每次发布博客文章，连接阿里云的服务器都需要手动输入密码，实在太麻烦了，于是查阅研究了一下怎么通过 SSH 免密登录 CentOS 服务器。

<!--more-->

## 前置条件

请确保在进行下面的操作以前，你的 Windows 已经能够通过 SSH 连接远程 Linux 服务器，并通过输入密码的方式登录。

## 具体操作

首先找到 Windows 本地的公钥 `~/.ssh/id_rsa.pub` 文件

打开 powershell 跑命令：

```powershell
cat ~/.ssh/id_rsa.pub
```

就可以看到公钥 `id_rsa.pub` 文件的内容了。

然后将这个文件的内容追加到 Linux 服务器上的 `~/.ssh/authorized_keys` 文件中（如果没有 Linux 服务器上没有该文件，自行创建即可）。

接着我们在 Linux 服务器上开启相关权限

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys 
```

最后重启 SSH 服务

```
# CentOS6
service sshd restart
# CentOS7
systemctl restart sshd
```

我们退出服务器后再次尝试连接服务器，就能免密登录上了。

```
ssh <username>@<ip> -p <port>
```

如果你需要登录以后再执行多个命令，可以通过以下命令在远程服务器上执行 command1,2,3。

```
ssh <username>@<ip> -p <port> "command1; command2; command3"
```

举个栗子

```
ssh root@11.22.33.44 -p 22 "cd / ; ls -l ; echo '-----Logout-----'"
```

## 参考资料

1. [windows配置ssh免密登录linux，并实现自动化部署web项目](https://my.oschina.net/wangwang110/blog/2886817)