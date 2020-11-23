---
title: "如何高效配置 Sublime Text 3 刷题环境"
date: 2020-03-17T00:17:51+08:00
weight: 
description: 环境：Windows, C++
tags: [Sublime Text 3]
categories: [Tools]
series: []
algorithms: []
comments: true
displayCopyright: true
toc: true
draft: false
---

本文针对于 Windows 下为 Sublime Text 3 配置 C++ 刷题环境。

<!--more-->

## 选择 Sublime Text 3 的原因

Sublime Text 3 的优势：


1. 启动速度快

2. 有代码高亮
3. 代码补全（较现代的括号补全）

## 配置环境变量

1. 下载 MinGW（也可以直接使用 Dev-C++ 或者 Codeblocks 中带有的MinGW ），并将其 bin 目录添加到环境变量 。比如我的路径为`C:\Files\Dev-Cpp\MinGW64\bin`。
2. 添加完成后使用命令行输入`gcc -v`或者`g++ -v`来检验环境变量是否配置成功。

## Sublime Text 3 使用

因个人偏好，采用文件读写方式来提供程序的输入和输入。

1. 在同一目录 workspace 下新建 3​ 个文件，`a.cpp, in.txt, out.txt`

2. 编写代码进行测试，`a.cpp`代码内容如下：

    ```cpp
    #include <iostream>

    using namespace std;

    int main() {
        freopen("in.txt", "r", stdin);  
        freopen("out.txt", "w", stdout);
        int a, b;
        cin >> a >> b;
        cout << a + b << endl;
        printf("Hello World!");
        return 0;
    }
    ```

   此时，需要在`in.txt`中输入两个数；然后回到`a.cpp`使用快捷键`Ctrl-Shift-B`，选择`C++ Single File-Run`，当看到形如`[Finished in 0.7s]`的提示语句，即可去查看`out.txt`中是否正确输出。

3. 但这样来回切换是不是很麻烦呢？我们可以使用分组提高效率，即分为两栏，左侧是程序源码`a.cpp`，右侧分上下两行，分别是`in.txt`和`out.txt`。如图所示：

   {{< img src="Sublime-Text-3.png" title="Sublime Text 3 分组预览" >}}

   **分组具体操作**

   1. 依次选择 View→Groups→Max Columns: 2
   2. 然后选择 View→Groups→New Group

   {{< img src="Sublime-Text-3-NewGroup.png" title="Sublime Text 3 分组步骤" >}}

   即可分成两列。然后选中第二栏，重复上述..第二步..操作，即可将第二栏划分成上下两栏。

## 其他优化

上述操作已能满足做题基本需求，但仍有可以提升之处，但这不是本文的重点。

比如你可能会遇到的后续问题（请利用搜索引擎解决）：

1. 编译错误时打印了所有环境变量（可通过修改 exec.py 解决）。
2. 每次重复编写文件读写较为繁琐（使用 Snippets ）。
3. ...

（这些重复性的东西就没有必要写了...