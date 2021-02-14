---
title: "Windows 配置 SSH 密钥登录 CentOS 服务器"
date: 2021-02-13T22:38:28+08:00
weight: 
description: 腾讯云 Lighthouse，CentOS7.6
tags: [ssh]
categories: [Tools]
series: []
algorithms: []
comments: true
displayCopyright: true
toc: true
draft: false
---

昨天刚入了腾讯云 Lignthouse，系统是 CentOS7.6。结果我每隔一段时间通过 SSH 登录上去，都能收到这样的警告：

```
There were X failed login attempts since the last successful login.
```

大约半小时我的服务器就会收到 10 次左右的尝试登录，大概是互联网上一些机器人的无差别扫描，总之就是非常讨厌。

<!-- more -->

## 解决办法

查阅了一些资料大概有以下这些解决办法：

1. 修改 SSH 端口，这种做法意义不大。
2. 配置 SSH 密钥登录 CentOS 服务器，然后关闭 SSH 密码登录。

下面介绍一下第二种做法：

## 配置 CentOS 服务器 SSH 密钥登录

在此之前，建议先了解一下 SSH 密钥登录的工作原理[^1]，详见脚注🔗️。

有一种通用做法[^2]，即把..本地..的公钥 `~/.ssh/id_rsa.pub` 追加到..服务器..上 `~/.ssh/authorized_keys`。然后就可以通过 `ssh <username>@<ip> -p <port>` 通过密钥直接连接上服务器而不需要密码验证。

腾讯云提供了另一种做法[^3]，不过本质是一样的，以轻量应用服务器为例：

首先进入轻量应用服务器的[管理页面](https://console.cloud.tencent.com/lighthouse/instance/index)，在侧边栏选择“密钥” > “创建密钥”：

{{< img src="create_ssh_key.png" width="70%" >}}

创建完成后会自动下载私钥，请一定注意妥善保存，腾讯云不会为你保存。

然后我们在“密钥”管理界面为刚才生成的公钥绑定实例，即服务器。

{{% admonition type="warning" title="警告" details="true" open="open" %}}
一旦为服务器实例绑定密钥，腾讯云将会为你自动关闭该服务器实例的 SSH 密码登录，如果你丢失了密钥，你会发现自己连接不上服务器了。

补救措施 1：再新建一个密钥，绑定该服务器实例，然后使用新的密钥登录。

补救措施 2：腾讯云提供的远程登录，可以使用系统默认密钥登录。

该远程登录默认使用的 SSH 端口为 22，而且无法修改，如果你没有修改过默认 SSH 端口，你可以使用此方法。

{{< img src="tencent_remote_connect.png" >}}

{{% /admonition %}}

绑定成功后，腾讯云会帮我们自动把该公钥添加到服务器上的 `~/.ssh/authorized_keys` 中，后面成功登录以后可以验证一下。

密钥绑定实例成功后，我们将密钥保存在本地某个路径，假设密钥存放于 `~/OneDrive/secret` 目录下的 `test` 文件，Windows 系统登录用户名为 zhangsan，服务器公网 ip 为 11.22.33.44，ssh 端口为 22，以 root 身份登录。

在本地，执行以下命令，来赋予私钥文件仅本人可读权限[^4]。

在 powershell 或 cmd 中：

```
# 文档
icacls <已下载的与实例关联的私钥文件的路径> /grant <Windows 系统用户帐户>:F
icacls <已下载的与实例关联的私钥文件的路径> /inheritancelevel:r

# example
icacls ~/OneDive/secret/test /grant zhangsan:F
icacls ~/OneDive/secret/test /inheritancelevel:r
```

然后就可以通过如下命令登录服务器。

在 powershell 或者 cmd 中，执行：

```powershell
# 文档
ssh -i <已下载的与实例关联的私钥文件的路径> <username>@<IP address or domain name> -p <port>

# example
ssh -i ~/OneDrive/secret/test root@11.22.33.44 -p 22
```

## 关闭 CentOS 服务器 SSH 密码登录

如果采用上文的腾讯云提供的做法，已经自动关闭了 SSH 密码登录，如果不是则仍然需要如下配置。

先登录服务器，然后修改 `sshd_config` 文件。

```bash
vim /etc/ssh/sshd_config
```

找到 `PasswordAuthentication yes` 配置项，修改为 `no`。如果不存在该项，默认值为 `no`。

记得重启 SSH 服务：

```bash
# CentOS6
service sshd restart
# CentOS7
systemctl restart sshd
```


[^1]: [https://wangdoc.com/ssh/key.html](https://wangdoc.com/ssh/key.html)
[^2]: [https://yuhi.xyz/post/Windows-配置-SSH-免密登录-CentOS-服务器](https://yuhi.xyz/post/Windows-%E9%85%8D%E7%BD%AE-SSH-%E5%85%8D%E5%AF%86%E7%99%BB%E5%BD%95-CentOS-%E6%9C%8D%E5%8A%A1%E5%99%A8/)
[^3]: [https://cloud.tencent.com/document/product/1207/44573](https://cloud.tencent.com/document/product/1207/44573)
[^4]: [https://cloud.tencent.com/document/product/1207/44643](https://cloud.tencent.com/document/product/1207/44643)