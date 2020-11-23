---
title: "AcWing160 匹配统计"
date: 2020-03-09T09:40:33+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [KMP, 字符串, 二分, 字符串哈希]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[AcWing160](https://www.acwing.com/problem/content/162/)

<!--more-->

**题目描述**：阿轩在纸上写了两个字符串，分别记为 $A$ 和 $B$。

利用在数据结构与算法课上学到的知识，他很容易地求出了“字符串 $A$ 从任意位置开始的后缀子串”与“字符串 $B$ ”匹配的长度。

不过阿轩是一个勤学好问的同学，他向你提出了 $Q$ 个问题：

在每个问题中，他给定你一个整数 $x$，请你告诉他有多少个位置，满足“字符串 $A$ 从该位置开始的后缀子串”与 $B$ 匹配的长度恰好为 $x$。

例如：$A=aabcde$，$B=ab$，则 $A$ 有 $aabcde$、$abcde$、$bcde$、$cde$、$de$、$e$ 这 $6$ 个后缀子串，它们与 $B=ab$ 的匹配长度分别是 $1、2、0、0、0、0$。

因此 $A$ 有 $4$ 个位置与 $B$ 的匹配长度恰好为 $0$，有 $1$ 个位置的匹配长度恰好为 $1$，有 $1$ 个位置的匹配长度恰好为 $2$。

**输入格式**

第一行输入三个整数 $N,M,Q$，分别表示 $A$ 串长度、$B$ 串长度、问题个数。

第二行输入字符串 $A$，第三行输入字符串 $B$。

接下来 $Q$ 行每行输入 $1$ 个整数 $x$，表示一个问题。

**输出格式**

输出共 $Q$ 行，依次表示每个问题的答案。

**数据范围**

$1≤N,M,Q,x≤200000$

**输入样例**

```c
6 2 5
aabcde
ab
0
1
2
3
4
```

**输出样例**

```c
4
1
1
0
0
```

## 解法

最近集训字符串，想到以前一直没理解原理的题目突然想明白，特记于此。正解是 $\rm KMP$。

### KMP

先预处理 $\rm Next$ 数组。$a$ 为原串，$b$ 为模板串。

根据 $\mathrm{Next}[i]=j$ 的含义：字符串 $b$ 中以 $i$ 结尾的（真）后缀能匹配最大（真）前缀长度为 $j$。

在 $\rm KMP$ 匹配过程中，枚举到字符串 $a$ 的第 $i$ 位，经过匹配，发现 $a$ 中以 $i$ 结尾的后缀能匹配的 $b$ 的前缀的最大长度为 $j$，（下面是重点）那么就有 $a$ 中以 $i-j+1$ 开始的后缀，能与字符串 $b$ 的前缀匹配的长度至少为 $j$。利用这个属性，开一个 $\mathrm{cnt}[\ ]$ 数组：

$\mathrm{cnt}[i]$ 表示 $a$ 的任意一位开始的后缀与 $b$ 的前缀匹配的长度至少为 $i$ 的方案数，那么特定匹配长度 $x$ 的方案数就是 $\mathrm{cnt}[x]-\mathrm{cnt}[x+1]$。 

如何计算 $\mathrm{cnt}[\ ]$ 呢？我们只需要在 $\rm KMP$ 匹配过程中，求出 $a$ 中以 $i$ 结尾的后缀能匹配 $b$ 的前缀的最大长度 $j$，$\mathrm{cnt}[j]$++, 然后不断回退 $j=\mathrm{Next}[j], \mathrm{cnt}[j]$++，直至不能回退（因为回退过程中的每一个 $j$ 都对应了 $a$ 中以 $i-j+1$ 开始的后缀能与 $b$ 的前缀匹配长度为 $j$ 的一种方案）。但这个统计方式实际还是比较暴力的，可以作如下优化（本题解法最**神奇**的地方）：

可以发现，如果我们求出了 $a$ 中以某一个 $i$ 结尾的后缀所能匹配 $b$ 的前缀最大长度 $j$ ，长度 $j$ 的方案数一定会累加到 $\mathrm{Next}[j], \mathrm{Next}[\mathrm{Next}[j]] \cdots$ 上，因此我们可以在 $\rm KMP$ 匹配过程中，仅记录最大匹配长度 $j$ 时，$\mathrm{cnt}[j]$++。然后按照 j->next[j]->next[next[j]]->...的拓扑序递推，将 $\mathrm{cnt}[j]$ 累加到 $\mathrm{cnt}[\mathrm{Next}[j]]$ 上。

而 $\mathrm{Next}[j] < j$，因此只需要按照匹配长度从大到小来枚举就是拓扑序了。

### 代码

```cpp
#include <iostream>
#include <cstdio>

using namespace std;

const int N = 200010;

int T, n, m;
char a[N], b[N];
int ne[N];
int cnt[N];

int main() {
    cin >> m >> n >> T;
    scanf("%s%s", a + 1, b + 1);
    for (int i = 2, j = 0; i <= n; i++) {
        while (j && b[i] != b[j + 1]) j = ne[j];
        if (b[i] == b[j + 1]) j++;
        ne[i] = j;
    }
    for (int i = 1, j = 0; i <= m; i++) {
        while (j && a[i] != b[j + 1]) j = ne[j];
        if (a[i] == b[j + 1]) j++;
        cnt[j]++;
    }
    for (int i = m; i >= 1; i--) cnt[ne[i]] += cnt[i];
    while (T--) {
        int x; scanf("%d", &x);
        printf("%d\n", cnt[x] - cnt[x + 1]);
    }
    return 0;
}
```

## 参考资料

1. [yxc视频讲解](https://www.acwing.com/problem/content/video/162/)