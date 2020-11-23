---
title: "Win10 邮件配置 QQ, GMAIL, NJUPT 邮箱"
date: 2020-11-18T22:58:52+08:00
weight: 
description:
tags: [Win10]
categories: [Tools]
series: []
algorithms: []
comments: true
displayCopyright: true
toc: true
draft: false
---

本文给出 Win10 自带邮件配置多邮箱收件的步骤，包括 QQ, GMAIL, NJUPT 学校邮箱。

<!--more-->

## QQ 邮箱

首先进入自己的 QQ 邮箱，选择“设置”，然后选择“账户”，找到“POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务”。

然后开启 POP3/SMTP 服务和 IMAP/SMTP 服务（需要发送短信进行验证）。

{{< img src="mailqq.png" width="90%" >}}

此时应该已经获得了授权码，也可以点击“生成授权码”再次生成（随时可以来这里生成）。

然后打开 Win10 的邮件”添加账户“。

{{< img src="POP_IMAP.png" width="50%" >}}

选择“其他账户“。

{{< img src="其他账户.png" width="50%" >}}

电子邮件地址填写 QQ 邮箱，名称随便写，密码就是上面生成的..授权码..。

然后登录即可。



## GMAIL 邮箱

首先进入 GMAIL 邮箱开启 IMAP。

{{< img src="Gmail设置.png" width="90%" >}}

然后“管理Google账号”，进入“安全性”选项。

{{< img src="Google启用两步验证.png" width="90%" >}}

启用两步验证（按提示要求做就行了）。

然后选择“应用专用密码”。

{{< img src="应用专用密码.png" width="90%" >}}

选择“邮件”和“Windows计算机”，“生成”。

{{< img src="生成应用专用密码.png" width="90%" >}}

生成的结果先别关了，等会儿需要用到，不然又得重新生成。

此时我们启动 Win10 邮件，“添加账户”。

{{< img src="高级设置.png" width="50%" >}}

选择“高级设置”（注意不要选 Google）.

{{< img src="电子邮件.png" width="50%" >}}

选择“Internet电子邮件”。

{{< img src="GMAIL配置Internet电子邮件账户.png" width="50%" >}}

| 配置项                   | 填写内容                              |
| ------------------------ | ------------------------------------- |
| 电子邮件地址             | xxx@gmail.com                    |
| 用户名                   | xxx@gmail.com                    |
| 密码                     | 上面生成的 16 位应用专用密码                   |
| 账户名                   | 随便写（显示在邮件 app 上，以后还能改） |
| 使用此名称发送你的邮件   | 随便写（正经人谁用 Win10 邮件发邮件）   |
| 传入电子邮件服务器       | imap.gmail.com:993:1             |
| 账户类型                 | IMAP4                                 |
| 传出(SMTP)电子邮件服务器 | smtp.gmail.com:465:1               |

然后“登录”，不出意外就配置成功啦。

## NJUPT 学校邮箱

选择“添加账户”。

{{< img src="高级设置.png" width="50%" >}}

选择“高级设置”。

{{< img src="电子邮件.png" width="50%" >}}

选择“Internet电子邮件”。

{{< img src="南邮邮箱.png" width="50%" >}}

| 配置项                   | 填写内容                              |
| ------------------------ | ------------------------------------- |
| 电子邮件地址             | 学号@njupt.edu.cn                     |
| 用户名                   | 随便写（建议和上面一样，以后不能改）  |
| 密码                     | 实际登录邮箱的密码                    |
| 账户名                   | 随便写（显示在邮件app上，以后还能改） |
| 使用此名称发送你的邮件   | 随便写（正经人谁用Win10邮件发邮件）   |
| 传入电子邮件服务器       | mail.njupt.edu.cn:143:1               |
| 账户类型                 | IMAP4                                 |
| 传出(SMTP)电子邮件服务器 | mail.njupt.edu.cn:465:1               |

上图仅供参考。

然后登录，“此时会提示您的xx账户设置已过期”。

点击 ⚠ 图标。

{{< img src="不受信任的证书.png" width="50%" >}}

选择“继续”，不出意外就成功了。

此时如果仍然出现下图情况。

{{< img src="无法访问此账户.png"  width="75%">}}

多半是密码填错了，右键“账户设置”中重新输入密码即可。

## 后话

以上步骤均经过我的实践，但仍然可能存在某些小问题，但收邮件应该是没有问题的，毕竟我也没用它发过邮件，逃。
