---
title: "Codeforces1245C Constanzes's Machine"
date: 2019-11-22T14:57:36+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DP]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces1245C](https://codeforces.com/contest/1245/problem/C )

**题目大意**：A有一台机器可以根据说话语音打字，而B对A的机器使坏，使得读 $w$，就一定会打印出 $uu$，读 $m$，就会打印 $nn$，其余字符不做改变。给定一个字符串，求原串有多少种，若不存在原串，输出 $0$。答案$\mathrm{mod} \ 10^9+7$。

<!--more-->

> DP

首先，只要出现 $w$ 或 $m$ 则输出 $0$。

动态规划：

状态表示 $f[i]$：以 $\mathrm{str}[i]$ 结尾可能的原串种数的最大值。

状态计算：

1. 若 $\mathrm{str}[i]=\mathrm{str}[i-1]=u或n$，则对于这两个连续的 $u$ 或 $n$ 有两种选择，要么保持原样，要么是由 $w$ 或 $m$ 转化而来。
   $$
   f[i] = \begin{cases} (f[i-1]+f[i-2])\ \mathrm{mod} \ 10^9+7, & \text {i > 2} \\\ 2, & \text{i = 2} \end{cases}
   $$

2. 若没有连续 $u$ 或 $n$，继承 $i-1$ 的种数。
   $$
   f[i] = f[i - 1]
   $$
   
3. 边界：$f[1] = 1$。

\

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 100010, mod = 1e9 + 7;

int f[N];
char str[N];

int main() {   
	scanf("%s", str + 1);
	int n = strlen(str + 1);
	bool flag = true;
	f[1] = 1;
	for (int i = 2; i <= n; i++) {	
		if ((str[i] == 'u' && str[i - 1] == 'u') || (str[i] == 'n' && str[i - 1] == 'n')) {	
			if (i == 2) f[i] = 2;
			else f[i] = (f[i - 1] + f[i - 2]) % mod;
		} else {
            f[i] = f[i - 1];
        }
		if (str[i] == 'w'  || str[i] == 'm') flag = false;
    }
	if (!flag || str[1] == 'w' || str[1] == 'm') puts("0");
	else printf("%d\n", f[n]);
    return 0;
}
```