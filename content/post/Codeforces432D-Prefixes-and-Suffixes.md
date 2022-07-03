---
title: "Codeforces432D Prefixes and Suffixes"
date: 2020-03-14T15:53:05+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [KMP, 字符串]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces432D](https://codeforces.com/contest/432/problem/D)

**题目大意**：给定一个字符串 $s$，求满足 $s$ 的前缀匹配 $s$ 的后缀的不同匹配长度的数量，并求满足前面匹配要求的前缀子串在原串的出次数。

<!--more-->

> $\rm KMP$

## 解法

先预处理 $\rm Next$ 数组，$s$ 串长度为 $n$，然后从 $n$ 开始回退，统计最多回退的次数，再加上 $1$ 就是第一问的答案（因为这里的后缀不是真后缀）。

如何快速得到满足条件的前缀子串在原串中的出现次数呢？如果 $\mathrm{Next}[j]$ 满足，那么 $\mathrm{Next}[\mathrm{Next}[j]]$ 也一定满足，因此这题可以按照拓扑序，即按匹配长度从大到小递推，将匹配长度为 $\mathrm{Next}[j]$ 的数量累加到匹配长度为 $\mathrm{Next}[\mathrm{Next}[j]]$ 的数量上。

[AcWing160-匹配统计](https://ketchuppp.xyz/post/AcWing160-%E5%8C%B9%E9%85%8D%E7%BB%9F%E8%AE%A1/)是一道类似的题目。


## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 100010;

int n;
char p[N];
int ne[N], cnt[N];
bool st[N];

int main() {
    scanf("%s", p + 1);
    n = strlen(p + 1);
    for (int i = 2, j = 0; i <= n; i++) {
        while (j && p[i] != p[j + 1]) j = ne[j];
        if (p[i] == p[j + 1]) j++;
        ne[i] = j;
        cnt[j]++;
    }
    for (int i = n; i >= 1; i--) cnt[ne[i]] += cnt[i];
    int k = ne[n], ans = 1;
    while (k) {
        st[k] = true;
        k = ne[k];
        ans++;
    }
    printf("%d\n", ans);
    for (int i = 1; i < n; i++) {
        if (st[i]) printf("%d %d\n", i, cnt[i] + 1);
    }
    printf("%d %d\n", n, 1);
    return 0;
}
```

