---
title: "VS Code 插件推荐之 Competitive Programming Helper"
date: 2020-05-18T14:26:59+08:00
weight: 
description: 不错欸
tags: [VS Code]
categories: [Tools]
series: []
algorithms: []
comments: true
displayCopyright: true
toc: true
draft: false
---

VS Code 插件生态真心不错啊，下面介绍一款常刷算法题的同学值得尝试的插件。

<!--more-->

{{< img src="VSCode_Extensions_CPH.png" title="Competitive Programming Helper" >}}

一看这个 Codeforces 的图标就知道它很专业。安装直接在 Extensions 里搜 `Competitive Programming Helper` 就行了。

这里我只介绍这个插件我最喜欢的一个地方，用过 Leetcode, AcWing 或者其他一些网站的同学应该知道，这些网站为用户提供了在线调试功能，..有分离的输入输出..，所以可以直接在网站上编写代码，然后测试。

但对于喜欢在本地写代码进行样例测试的同学，可能就会使用本地的一些编辑器或 IDE，然后调 `cmd` 来跑测试数据，但这样有一个不好之处，就是在命令行里面，它并不会将你的输入数据和输出数据分开，也就是说，当你有多组数据输入时，打印出的答案会混在输入数据中，不够直观。

面对这个问题，我在本地写代码的时候一般采取文件读写的方式，这个在[如何高效配置 Sublime Text 3 刷题环境](https://yuhi.xyz/post/%E5%A6%82%E4%BD%95%E9%AB%98%E6%95%88%E9%85%8D%E7%BD%AE-Sublime-Text-3-%E5%88%B7%E9%A2%98%E7%8E%AF%E5%A2%83/)一文中谈到，加上 `snippets`（就不用重复写文件读写的那几行了）也还算好用。

而这个插件我最欣赏的地方就是它省去了我的文件读写操作，有分离的输入输出，而且支持多组样例进行测试。如下图：

{{< img src="CPH_show.png" title="预览" >}}

可以看到右边的一栏可以自定义输入 `Input`，自定义期望输出 `Expected Output`（可以不写），然后选择 `Save and run` 就会编译运行 `b.cpp`。如果只需要测一组，那么只要点击 `Testcase 1` 右边的绿色按钮即可。实际运行的结果返回在 `Received Output`。

另外这个插件还有一些特性，比如下载 Codeforces 的样例数据，然后自动进行测试，但我觉得不如手动复制样例效率来的高。

这个插件默认启动 `Results` 框的快捷键是 `Ctrl + Alt + B`，这算是一个编译命令，如果你有语法错误，就会启动失败，在 `OUTPUT` 处会有报错信息。每次切换一个源文件，你需要重启这个 `Results` 框，否则它运行使用的代码还是之前的代码，这是值得注意的。VS Code 修改快捷键还是很容易的，比如我修改成了双击 ` `` `（就是 `Esc` 下面那个键）。

如果需要配置 `C++11`，可以在 `Extensions` 处找到这个插件，然后点击右侧的管理按钮 `Manage`，选择 `Extensions Setting`，就可以看到如下界面：

{{< img src="CPH_settings.png" title="设置编译选项" >}}

添加 `-std=c++11` 即可。

updated @ 2020.6.9

插件更新猝不及防，竟然会清空原有配置（害我一通debug

重新设置 `c++11` 方式如下：

{{< img src="CPH.png" >}}
