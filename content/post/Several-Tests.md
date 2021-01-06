---
title: "Several Tests"
date: 2020-03-14T16:51:39+08:00
weight: 
description: Just for test
tags: [Shortcode]
categories: [Blog]
series: []
algorithms: []
comments: true
displayCopyright: true
toc: true
draft: false
---

目前仅作各项测试，日后会将内容分离以完善成文。

<!--more-->

## LaTex

$\LaTeX$

$\mathcal{O}(\log n)$

$$
[f_n \ f_{n+1} \ S_n \ R_n]
\begin{bmatrix}
   0 & 1 & 0 & 0 \cr
   1 & 1 & 1 & 0 \cr
   0 & 0 & 1 & 1 \cr
   0 & 0 & 0 & 1 \cr
  \end{bmatrix}
=[f_{n+1} \ f_{n+2} \ S_{n+1} \ R_{n+1}]
$$

$$
\begin{pmatrix} 1&a_1&a_1^2&\cdots&a_1^n \cr  1&a_2&a_2^2&\cdots&a_2^n \cr  \vdots&\vdots&\vdots&\ddots&\vdots \cr  1&a_m&a_m^2&\cdots&a_m^n \cr  \end{pmatrix}
$$

---

## Shortcode

### HTML \<mark> 标签

```go
{{%/* mark "Wow" */%}}
```

{{% mark "Wow" %}}

### Admonition

#### 预览

shortcode 不依赖于某个主题，因此你可以很方便地从其他主题的 shortcode 搬运过来给自己用:smile:，下面的 shortcode 是我从曾经使用过的 even 主题搬运而来
1. 预览：[https://blog.olowolo.com/example-site/post/shortcodes/](https://blog.olowolo.com/example-site/post/shortcodes/)
2. 代码：[https://github.com/olOwOlo/hugo-theme-even/tree/master/layouts/shortcodes](https://github.com/olOwOlo/hugo-theme-even/tree/master/layouts/shortcodes)


```go
{{%/* admonition note "标题" "false" */%}}
Hello, Shortcode.

{{%/* admonition type="warning" title="警告" details="true" */%}}
Wow.
{{%/* /admonition */%}}

{{%/* admonition example */%}}
Example.
{{%/* /admonition */%}}

{{%/* /admonition */%}}

{{%/* admonition abstract 摘要 */%}}
Tests for hugo-shortcode.
{{%/* /admonition */%}}
```

{{% admonition note "标题" "false" %}}
Hello, Shortcode.

{{% admonition type="warning" title="警告" details="true" %}}
Wow.
{{% /admonition %}}

{{% admonition example 举个栗子%}}
Example.
{{% /admonition %}}

{{% /admonition %}}

{{% admonition abstract 摘要 %}}
Tests for hugo-shortcode.
{{% /admonition %}}

#### 参数

```go
{{%/* admonition type="" title="" details="" open="" */%}}
Text
{{%/* /admonition */%}}
```

+ `details`对应`<detail>`标签，值默认为`false`表示不使用该标签。
+ `title`为标题，省略则无标题。
+ `open`为 open 和 close 两个值，表示是否展开标签。
+ 支持嵌套使用。

|   type   |
| :------: |
|   note   |
| example  |
| abstract |
|   info   |
|   tip    |
| warning  |
| success  |
| failure  |
|  danger  |
|  bug  |
|  danger  |
|  quote  |

{{% admonition note  集合 "true" %}}
{{% admonition example  example %}}{{% /admonition %}}
{{% admonition abstract  abstract %}}{{% /admonition %}}
{{% admonition info  info %}}{{% /admonition %}}
{{% admonition tip  tip %}}{{% /admonition %}}
{{% admonition warning  warning %}}{{% /admonition %}}
{{% admonition success  success %}}{{% /admonition %}}
{{% admonition failure  failure %}}{{% /admonition %}}
{{% admonition danger  danger %}}{{% /admonition %}}
{{% admonition bug  bug %}}{{% /admonition %}}
{{% admonition danger  danger %}}{{% /admonition %}}
{{% admonition quote  quote %}}{{% /admonition %}}
{{% /admonition %}}