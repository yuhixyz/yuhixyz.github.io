---
title: "Windows Terminal 美化"
date: 2020-01-19T13:48:09+08:00
weight: 
description: 🎉好看是第一生产力
tags: [Windows Terminal]
categories: [Tools]
series: []
algorithms: []
comments: true
displayCopyright: true
toc: true
draft: false
---

本文包含 Windows Terminal 以及 Powershell 的美化。

<!--more-->

> 主要是因为最近 Surface 送修，回来之和全要重新配置，于是开始陆续整理一些工具的简明使用教程，以便到时快速复原工作环境。

## 写在前面

先来效果图

{{< img src="windows_terminal美化1.png" >}}

{{< img src="windows_terminal美化2.png" >}}

## PowerShell 美化

### 安装 oh-my-posh

首先以管理员身份启动 Windows Terminal，新建 powershell 窗口，执行提下命令安装 posh-git

```powershell
Install-Module posh-git -Scope CurrentUser
```

执行下面的命令安装 oh-my-posh

```powershell
Install-Module oh-my-posh -Scope CurrentUser
```

新建或打开 powershell 的配置文件

执行`$profile`查看路径

{{< img src="profile.png" >}}

执行`notepad $profile`编辑文件

{{< img src="notepad_profile.png" >}}

向其中添加以下内容，其中第三行为设置主题

```ps1
Import-Module posh-git
Import-Module oh-my-posh
Set-Theme Avit
```

使用 `$ThemeSettings`查看主题存放位置 CurrentThemeLocation，同目录下有其他主题可供选择。

{{< img src="themesettings.png" >}}

### 美化 ls 命令

使用 [Get-ChildItem](https://github.com/joonro/Get-ChildItemColor) 美化`ls`命令，首先需要安装，在 powershell （管理员身份）执行以下命令

```powershell
Install-Module -AllowClobber Get-ChildItemColor
```

执行 `notepad $profile`，将下列内容添加进去

```ps1
If (-Not (Test-Path Variable:PSise)) {  # Only run this in the console and not in the ISE
    Import-Module Get-ChildItemColor
    
    Set-Alias l Get-ChildItem -option AllScope
    Set-Alias ls Get-ChildItemColorFormatWide -option AllScope
}
```

[Get-ChildItem](https://github.com/joonro/Get-ChildItemColor) 还提供了一些个性化的颜色设置，可以参看官方 Github 的 README 说明。

美化ls命令后效果如下

{{< img src="美化ls命令.png" >}}

## Windows Terminal 美化

{{% admonition warning 警告 %}}
2020.4.24 日，Windows Terminal 更新后，profiles.json 变更为 settings.json，且下面的部分配置不再生效。
{{% /admonition %}}

打开 Windows Terminal 的 Settings，即 profiles.json 文件。

下面配置可供参考，依样画葫芦即可。

其中`guid`可以用命令生成`[Guid]::NewGuid()`生成，[FiraCode字体下载](https://github.com/tonsky/FiraCode/releases)。

```json
{
    "$schema": "https://aka.ms/terminal-profiles-schema",

    "requestedTheme" : "dark",
    "showTerminalTitleInTitleBar" : false,
    "alwaysShowTabs" : true,

    "profiles":
    [
        {
            "guid": "{61c54bbd-c2c6-5271-96e7-009a87ff44bf}",
            "name": "Windows PowerShell",
            "commandline": "powershell.exe",
            "cursorShape": "vintage",
            "colorScheme": "Nord",
            "useAcrylic": true,
            "acrylicOpacity": 0.9,
            "fontFace": "Fira Code",
            "fontSize": 12,
            "hidden": false,
            "tabTitle" : "Powershell"
            
        },
        {
            "guid": "{0caa0dad-35be-5f56-a8ff-afceeeaa6101}",
            "name": "cmd",
            "commandline": "cmd.exe",
            "hidden": true
        },
        {
            "guid": "{b453ae62-4e3d-5e58-b989-0a998ec441b8}",
            "hidden": true,
            "name": "Azure Cloud Shell",
            "source": "Windows.Terminal.Azure"
        },
        {
            "guid": "{2c4de342-38b7-51cf-b940-2309a097f518}",
            "hidden": false,
            "name": "Ubuntu",
            "colorScheme": "Nord",
            "fontFace": "Fira Code",
            "fontSize": 12,
            "source": "Windows.Terminal.Wsl"
        }
    ],

    "schemes": 
    [
        {
            "name": "Nord",
            "background": "#2e3440",
            "foreground": "#eceff4",
            "brightBlack":  "#3f68b9",
            "brightBlue": "#5e81ac",
            "brightCyan": "#8fbcbb",
            "brightGreen": "#a3be8c",
            "brightPurple": "#b48ead",
            "brightRed": "#bf616a",
            "brightWhite": "#eceff4",
            "brightYellow": "#ebcb8b",
            "black": "#2e3440",
            "blue": "#5e81ac",
            "cyan": "#8fbcbb",
            "green": "#a3be8c",
            "purple": "#b48ead",
            "red": "#bf616a",
            "white": "#eceff4",
            "yellow": "#ebcb8b"
        }
    ],
    "keybindings": 
    [
        {
            "keys": 
            [
                "ctrl+w"
            ],
            "command": "closeTab"
        },
        {
            "keys": 
            [
                "ctrl+q"
            ],
            "command": "newTab"
        }
    ]
}
```