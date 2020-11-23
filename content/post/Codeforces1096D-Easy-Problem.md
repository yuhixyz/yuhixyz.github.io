---
title: "Codeforces1096D Easy Problem"
date: 2020-03-17T17:39:41+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DP, 字符串]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces1096D](https://codeforces.com/contest/1096/problem/D)

**题目大意**：给定一个字符串只包含 'h', 'a', 'r', 'd'，删除第 $i$ 个字符的代价为 $a_i$，现在可以删除一些字符，以保证字符串中不存在一个子串（不需要连续）为 "hard"，求最小代价。

<!--more-->

> $\rm DP$

## 解法

需要选出一些位删除的位置，求最小代价，$\rm DP$ 来解。

1. 状态表示 $f[i][j]$

    + 集合：使 $1\sim i$ 中不出现某个子序列是长度为 $j$ 的 "hard" 的前缀的所有删法。

    + 属性：$\min$（最小代价）

2. 状态计算

    + 集合划分依据：第 $i$ 个字符删还是不删
	+ 状态转移方程：

<div>

$$
f[i][j] = \begin{cases} 
f[i-1][j]+a[i] & , \text{str[i] = hard[j] = 'h'} \\
\min(f[i-1][j-1],f[i-1][j]+a[i]) & , \text{str[i] = hard[j]} \neq \text{'h'} \\
f[i-1][j] & , \text{str[i]} \neq \text{hard[j]}
\end{cases}
$$

</div>  

**解释**：如果 $\text{str[i] = hard[j] = 'h'} $，由 $f[i][j]$ 的含义，必须删去 $i$；如果 $\text{str[i] = hard[j]}  \neq \text{'h'}$，那么有两种选择，① 不删掉 $i$，在这种情况下，必须保证 $1 \sim i-1$ 中不能出现一个子串是长度为 $j-1$ 的 "hard" 的前缀，因此只能从 $f[i-1][j-1]$ 转移，② 删掉 $i$，那么只需要保证 $1 \sim i-1$ 中不存在长度为 $j$ 的 "hard" 的前缀，然而加上删掉 $i$ 的代价；如果 $\text{str[i]} \neq \text{hard[j]}$，那么第 $i$ 个字母可以不参与构成 "hard"，也就是说没有必要去删掉它而徒增代价，因此只需要继承 $f[i-1][j]$ 即可。

吐槽：一开始看了题解的状态表示含义就去写了，结果被边界卡的自闭了，需要特判前缀长度为 $1$ 时恰好是 'h' 字母的情况，这种必须要删掉。（对于 $\rm DP$ 一直无感。

## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <cstdio>
#include <cstring>

using namespace std;

typedef long long LL; 
 
const int N = 100010;

int n, m;
char str[N];
LL a[N], f[N][5];
string hard = "#hard";

int main() {
    cin >> n;
    scanf("%s", str + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= 4; j++) {
            if (str[i] == hard[j] && str[i] == 'h') f[i][j] = f[i - 1][j] + a[i];
            else if (str[i] == hard[j]) f[i][j] = min(f[i - 1][j - 1], f[i - 1][j] + a[i]);
            else f[i][j] = f[i - 1][j]; 
        }
    }
    cout << f[n][4] << endl;
    return 0;
}
```

