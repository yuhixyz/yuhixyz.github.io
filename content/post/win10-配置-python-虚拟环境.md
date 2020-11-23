---
title: "Win10 配置 Python 虚拟环境"
date: 2020-11-11T21:04:59+08:00
weight: 
description: Win10, Python3.7.9
tags: [python, virtualenvwrapper]
categories: [Project]
series: []
algorithms: []
comments: true
displayCopyright: true
toc: true
draft: false
---

前两周的算法设计实践周刚刚过去，用 `django` 写了个小工具 http://calc.yuhi.xyz，期间学习了使用 `virtualenvwrapper-win` 进行 `python` 虚拟环境管理，在此记录一下用法。

<!--more-->

首先，安装 `python3`。可以在官网安装（记得配置环境变量），或者使用 `scoop` 进行安装。

以下操作在 `powershell` 下运行，或者你也可以使用 `cmd` 。

如果想要安装特定的版本，比如 `python3.7.9`，需要在 `scoop` 中添加名为 `versions` 的 `bucket`。

```ps1
scoop bucket add versions
```

然后安装 `python3.7.9`。

```ps1
scoop install python@3.7.9
```

接下来我们安装 `virtualenvwrapper-win`：

```ps1
pip install virtualenvwrapper-win
```

安装成功后我们就能创建虚拟环境了，执行 `mkvirtualenv env4test` 命令创建一个名为 `env4test` 的 `python` 虚拟环境。

{{< img src="mkvirtualenv.png" title="mkvirtualenv env4test" >}}

可以看到，默认会在 `C:\Users\XXX\Envs\` 路径下，创建了一个 `env4test` 文件夹。

使用 `lsvirtualenv` 命令查看当前所有的虚拟环境：

{{< img src="lsvirtualenv.png" title="lsvirtualenv" >}}

可以使用 `rmvirtualenv env4test` 删除该虚拟环境（这里就不删了）。

使用 `workon env4test` 命令激活该虚拟环境：

{{< img src="workon.png" title="workon env4test" >}}

以上成功进入虚拟环境 `env4test`。但 `powershell` 下 `workon` 命令并不能生效，而 `cmd` 下没有这个问题。

{{% admonition type="warning" title="在 powershell 下 workon 命令无效解决方案" details="true" open="open" %}}

三种解决方案如下：
1. 在 `cmd` 下运行。
2. 使用 `~\Envs\env4test\Scripts\activate.ps1` 激活环境

    即进入该虚拟环境 `Scripts` 文件夹下，用 `activate.ps1` 激活

    {{% img src="activate.png" title="activate.ps1" %}}

3. 为 `powershell` 重写 `workon.ps1` 脚本

    参考链接：[workon command doesn't work in Windows PowerShell to activate virtualenv](https://stackoverflow.com/questions/38944525/workon-command-doesnt-work-in-windows-powershell-to-activate-virtualenv)
    
    先找到原来的 `workon` 命令即 `workon.bat` 文件。我的在 `python\3.7.9\Scripts` 路径下。

    在 `Script` 文件夹下，只有 `workon.bat` 脚本，而没有 `workon.ps1` 脚本，前者执行时会调用 `cmd` 进行环境的激活，然后运行结束再回到 `powershell`，子进程并没有对父进程造成影响，因此在 `powershell` 并没有激活虚拟环境。

    在同目录下新建 `workon.ps1` 脚本，添加以下内容即可：
    
    ```ps1
    if (-not (Test-Path env:WORKON_HOME))
    {
        $WORKON_HOME = '~\Envs'
    } else {
        $WORKON_HOME = ($env:WORKON_HOME).Replace('"','')
    }

    if (-not (Test-Path env:VIRTUALENVWRAPPER_PROJECT_FILENAME)) {
        $VIRTUALENVWRAPPER_PROJECT_FILENAME = '.project'
    } else {
        $VIRTUALENVWRAPPER_PROJECT_FILENAME = ($env:VIRTUALENVWRAPPER_PROJECT_FILENAME).Replace('"','')
    }

    if ($args.length -eq 0) {
        echo "Pass a name to activate one of the following virtualenvs:"
        echo ==============================================================================
        (Get-ChildItem -Path $WORKON_HOME).Name
        return
    }

    $VENV = $args[0]

    if (!(Test-Path -Path ("$($WORKON_HOME)\$($VENV)"))) {
        echo ("virtualenv $($VENV) does not exist")
        echo "Create it with 'mkvirtualenv $($VENV)'"
        return
    }

    if (!(Test-Path -Path ("$($WORKON_HOME)\$($VENV)\Scripts\activate.ps1") ))  {
        echo "$($WORKON_HOME)$($VENV)"
        echo "doesn't contain a virtualenv (yet)."
        echo "Create it with 'mkvirtualenv $($VENV)'"
        return
    }

    iex ("$($WORKON_HOME)\$($VENV)\Scripts\activate.ps1")

    if (Test-Path -Path ("$($WORKON_HOME)\$($VENV)\$($VIRTUALENVWRAPPER_PROJECT_FILENAME)")) {
        iex "cdproject"
    }
    ```

    然后新建 `cdproject.ps1` 脚本（不要改动原来的 `cdproject.bat`），添加以下内容：
    
    ```ps1
    function Show-Usage {
        echo ""
        echo  "switches to the project dir of the activated virtualenv"
    }

    if (-not (Test-Path env:VIRTUAL_ENV)) {
        echo ""
        echo "a virtualenv must be activated"
        Show-Usage
        return
    }

    if (-not (Test-Path env:VIRTUALENVWRAPPER_PROJECT_FILENAME)) {
        $VIRTUALENVWRAPPER_PROJECT_FILENAME = '.project'
    } else {
        $VIRTUALENVWRAPPER_PROJECT_FILENAME = ($env:VIRTUALENVWRAPPER_PROJECT_FILENAME).Replace('"','')
    }

    if (-not (Test-Path "$($env:VIRTUAL_ENV)\$($VIRTUALENVWRAPPER_PROJECT_FILENAME)")) {
        echo ""
        echo "No project directory found for current virtualenv"
        Show-Usage
        return
    }

    $ENVPRJDIR = Get-Content "$($env:VIRTUAL_ENV)\$($VIRTUALENVWRAPPER_PROJECT_FILENAME)" -First 1

    # If path extracted from file contains env variables, the system will not find the path.
    # TODO: Add this functionality

    cd $ENVPRJDIR
    ```

    这样我们在 `powershell` 中使用 `workon` 命令或者是 `cdproject` 命令，都会使用 `.ps1` 脚本，而不是 `.bat`；而在 `cmd` 则是使用 `.bat` 脚本。
    
{{% /admonition %}}

使用 `deactivate` 退出虚拟环境。

{{< img src="deactivate.png" title="deactivate" >}}

本文只是介绍了部分 `virtualenvwrapper-win` 的用法，但对于初学者管理平常项目的虚拟环境已经够用了。









