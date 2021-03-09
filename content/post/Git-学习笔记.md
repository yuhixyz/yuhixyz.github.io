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
draft: false
---

本文是一篇学习笔记，虽然 Yuhi 已经使用 Git 一年多了，但对其工作原理一直没有深入理解，部分命令也常常忘记，因此在这里整理 Git 的相关工作原理以及常用命令，以备查阅。

<!--more-->


## Git 工作原理

**文件状态**

在 Git 仓库中，文件分为已跟踪 Tracked 或未跟踪 Untracked 两种状态。

已跟踪的文件指已经受 Git 版本控制且存在于上一次快照[^1]中，或者目前在暂存区的文件，只要被 `git add` 过的文件，状态就会从未跟踪变成已跟踪；未跟踪的文件，指除了已跟踪文件外的其他文件，比如刚刚新建的文件，或者是从未被 `add` 过的文件。

一旦某一文件被跟踪，那么它就会处于未修改 Unmodified、已修改 Modified、已暂存 Staged 状态中的一种。

下图为 Git 仓库中文件的状态变化示意图，图源[^2]。

{{< img src="file_life_cycle.png" title="文件的状态变化周期">}}

**Git 分支原理**

~~不想总结了~~，请移步：[Pro Git book 3.1 Git 分支 - 分支简介](https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%88%86%E6%94%AF%E7%AE%80%E4%BB%8B)，这里有通俗易懂的图解示例。

---

## Git 相关配置

**各级配置文件**

```powershell
Config file location
    --global              use global config file
    --system              use system config file
    --local               use repository config file
    --worktree            use per-worktree config file
    -f, --file <file>     use given config file
    --blob <blob-id>      read config from given blob object
```

 通常只需要 global 和 local 两种级别的配置就可以满足需求了。

1. 用户级 global 配置：针对当前用户，路径：`~/.gitconfig`。

2. 仓库级 local 配置：针对特定仓库，路径：`<仓库路径>/.git/config`。

local 的优先级高于 global，优先级高的配置项会覆盖优先级低的相同配置项。

**配置用户名和邮箱**

```powershell
# global 级别
git config --global user.name "yuhixyz"
git config --global user.email "example@yuhi.xyz"

# 在仓库路径下执行，local 级别，可选参数 [--local]
git config user.name "gugugu"
git config user.email "example@gugugu.com"
```

**查看配置信息**

```powershell
# 查看所有配置项信息，可选参数 [--global] 或 [--local] 等
git config --list
# 查看特定项，无参数则按照优先级依次查询的结果，可选参数 [--global] 或 [--local] 等
git config <key>
git config user.name
```

## Git 常用命令

**初始化**

```powershell
git init  # 初始化当前目录为 git 仓库
git init <repo>  # 在当前目录下新建文件夹 repo 并初始化为 git 仓库
```

**克隆仓库**

```powershell
git clone <url>  # 克隆远程仓库
git clone <url> <repo_name> # 仓库名改为 repo_name（克隆下的仓库文件夹名）
git clone -b <branch_name> <url> <repo_name>  # -b 指定分支
```

**远程仓库**

```powershell
# 查看所有远程仓库
git remote -v  # 可选参数 -v，会列出远程仓库 URL

# 添加远程仓库
git remote add <name> <url>
git remote add aaa git@github.com:yuhixyz/yuhixyz.github.io.git  # 给远程仓库取名为 aaa

# 远程仓库重命名
git remote rename <name1> <name2>
git remote rename aaa bbb  # aaa 重命名为 bbb

# 查看特定远程仓库
git remote show <name>
git remote show bbb

# 移除远程仓库
git remote rm <name>
git remote rm bbb

# 将本地仓库的 master 分支推送到远程仓库 bbb
git push bbb master
```

**暂存修改**

```powershell
git add <file1> <file2>  # 将 file1, file2 加入暂存区
git add <dir>  # 将目录 dir 下所有文件加入暂存区
git add .  # 将当前目录下所有文件加入暂存区
```

**提交更新**

```powershell
git commit -m "commit message"  # 提交暂存区的文件
git commit -a -m "commit message"  # 提交所有已跟踪的文件（跳过暂存的步骤）
```

**移除文件**

```powershell
# 从目录中移除并从 Git 中移除
rm <file>  # 直接从目录中删除
git rm <file>  # 然后在 git 中记录此次移除操作，后面提交时该文件不会再被纳入 Git 管理
# 如果要删除的文件已经修改过，或已经放入暂存区，则需要 -f 参数
git rm -f <file>

# 在目录中保留而从 Git 中移除
git rm --cached <file>
```

**移动文件**

```powershell
git mv <file1> <file2>  # 重命名

# 等价于下面三条
mv <file1> <file2>
git rm <file1>
git add <file2>
```

**查看提交历史**

```powershell
git log [--pretty=oneline]  # []为可选
```

**撤销提交**

```powershell
# 两种使用场景举例

# 上一次 commit 信息写错了
git commit -m "wrong commit msg"
git commit -m "correct commit msg" --amend  # 覆盖上一次提交（只是修改了提交信息）

# 刚 commit 完发现忘记将文件 forget.md 加入暂存区
git commit -m "xxx"
git add forget.md
git commit --amend  # 重新 commit，将 forget.md 加入上次 commit 中
```

**撤销修改**

```powershell
# 将 file 恢复到上一次提交时的状态，两条命令都可以
git restore <file>
git checkout -- <file>
```

**取消暂存文件**

```powershell
# file 已暂存且之后没有修改，如下命令将 file 移出暂存区
git reset HEAD <file>
```

**标签**

```powershell
# 列出所有标签
git tag

# 给最近一次提交打标签
git tag <tag_name>
git tag -a <tag_name> -m "message"  # 带有附注，-a 指定标签名，-m 指定标签说明

# 给指定提交打标签
git tag <tag_name> <commit_id>  # 取某次 commit 的前几位即可
git tag -a <tag_name> <commit_id> -m "message"

# 删除指定标签
git tag -d <tag_name>

# 查看指定标签以及对应的提交的信息
git show <tag_name>

# 提交指定标签（Git 默认不会提交标签到远程仓库）
git push <remote> <tag_name>
# eg. git push origin v1.0

# 提交所有不在远程仓库的标签推送到远程仓库
git push <remote> --tags

# 新建一个分支，指向某一个标签
git checkout -b <branch_name> <tag_name>
```

**分支**

```powershell
# 列出所有本地和远程分支
git branch -a

# 列出所有本地分支
git branch

# 列出所有远程分支
git branch -r

# 新建一个分支
git branch <branch_name>

# 删除特定分支
git branch -d <branch_name>

# 新建一个分支并切换到该分支
git checkout -b <branch_name>

# 切换到指定分支
git checkout <branch_name>

# 合并指定分支到当前分支
git merge <branch_name>
```


## 参考文献

1. https://git-scm.com/book/zh/v2
2. http://www.ruanyifeng.com/blog/2018/10/git-internals.html
3. http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html
4. https://gitee.com/all-about-git


[^1]: 快照：每次 `git commit` 后 Git 会生成一次快照。
[^2]: 图源：[https://git-scm.com/book/zh/v2/Git-基础-记录每次更新到仓库](https://git-scm.com/book/zh/v2/Git-%E5%9F%BA%E7%A1%80-%E8%AE%B0%E5%BD%95%E6%AF%8F%E6%AC%A1%E6%9B%B4%E6%96%B0%E5%88%B0%E4%BB%93%E5%BA%93)