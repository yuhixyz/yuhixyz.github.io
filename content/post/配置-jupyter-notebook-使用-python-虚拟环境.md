---
title: "配置 Jupyter Notebook 使用 Python 虚拟环境"
date: 2020-12-03T22:15:09+08:00
weight:
description: 环境：win10, python3
tags: [jupyter notebook, python, virtualenvwrapper]
categories: [Tools]
series: []
algorithms: []
comments: true
displayCopyright: true
toc: true
draft: false
---

心血来潮，想入门一波机器学习，因此在这里配置一下 `tensorflow` 虚拟环境，并配置到 jupyter notebook 中。

<!--more-->

## 安装 jupyter notebook

```powershell
pip install jupyter
```

## 创建虚拟环境并安装 tensorflow

这里使用 `virtualenvwrapper` 管理虚拟环境：[Win10 配置 Python 虚拟环境](https://yuhi.xyz/post/win10-%E9%85%8D%E7%BD%AE-python-%E8%99%9A%E6%8B%9F%E7%8E%AF%E5%A2%83/)；当然其他方法也行。

```powershell
mkvirtualenv env4tf
workon env4tf
```

进入虚拟环境后，安装 `tensorflow`

```powershell
pip install tensorflow
```

## 安装 ipykernel

在 jupyter notebook 中使用虚拟环境需要安装 ipykernel.

在虚拟环境 `env4tf` 中：

```powershell
pip install ipykernel
```

安装完成后，将当前的虚拟环境添加到 jupyter notebook 的 kernel 中：

```powershell
python -m ipykernel install --user --name env4tf
```

注意上面的 `env4tf` 改成你的虚拟环境名称。

## 启动 jupyter notebook

这里在不在虚拟环境中无所谓。

```powershell
jupyter notebook
```

此时在面板上就可以通过 New > env4tf 新建文件并直接进入虚拟环境。

{{< img src="jupyter-notebook-new.png" width="40%" >}}

或者在已经创建的文件上方选择：Kernel > Change kernel > env4tf

{{< img src="jupyter-notebook-kernel.png" >}}


## 参考资料

1. [如何在Jupyter notebook中使用virtualenv虚拟环境](https://blog.csdn.net/jingyoushui/article/details/97494240)