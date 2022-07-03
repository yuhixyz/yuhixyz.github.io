---
title: "Codeforces149E Martian Strings"
date: 2020-03-11T16:27:55+08:00
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

原题链接：[Codeforces149E](https://codeforces.com/contest/149/problem/E)

**题目大意**：给定一个字符串 $s$，和 $T$ 个字符串 $p$，问 $s$ 中是否存在两段不重合的非空连续子串，能够拼凑出 $p$。求满足条件的 $p$ 串数量。

<!--more-->

> $\rm KMP$

## 解法

思路比较简单，正反 $\rm KMP$ 即可。正向匹配，求左边能匹配的最大长度；反向匹配，求右边能匹配的最大长度。如果总长度大于等于原串长度，答案++。

代码与上面描述有一些出入，在正向匹配的时候用 $\mathrm{len}[i]$ 表示 $s$ 串下标 $1\text{~}i$ 中以某个下标结尾的后缀能匹配  $p$ 串前缀的最大长度。那么我们只需要在反向匹配的时候，直接判断右边匹配长度是否能与左边拼凑成功即可。体现在 $\rm Line\ 43\text{~}46$。

**坑点**：需要保证左右匹配的长度都大于 $0$（否则不满足题意要求）；$n=1$ 需要特判。

## 代码

```cpp
#include <iostream>
#include <cstring>
#include <cstdio>

using namespace std;

const int N = 200010;

int T, n, m, ans;
char s[N], p[N];
int ne[N], len[N];

int main() {
    scanf("%s", s + 1);
    m = strlen(s + 1);
    cin >> T;
    while (T--) {
        scanf("%s", p + 1);
        n = strlen(p + 1);
        if (n == 1) continue;
        for (int i = 2, j = 0; i <= n; i++) {
            while (j && p[i] != p[j + 1]) j = ne[j];
            if (p[i] == p[j + 1]) j++;
            ne[i] = j;
        }
        memset(len, 0, sizeof len);
        for (int i = 1, j = 0; i <= m; i++) {
            while (j && s[i] != p[j + 1]) j = ne[j];
            if (s[i] == p[j + 1]) j++;
            len[i] = max(len[i - 1], j);
            if (j == n) j = ne[j];
        }
        memset(ne, 0, sizeof ne);
        for (int i = 2, j = 0; i <= n; i++) {
            while (j && p[n - i + 1] != p[n - j]) j = ne[j];
            if (p[n - i + 1] == p[n - j]) j++;
            ne[i] = j;
        }
        bool flag = false;
        for (int i = 1, j = 0; i <= m; i++) {
            while (j && s[m - i + 1] != p[n - j]) j = ne[j];
            if (s[m - i + 1] == p[n - j]) j++;
            if (j && len[m - i] && (j + len[m - i] >= n)) {
                flag = true;
                break;
            }
            if (j == n) j = ne[j];
        }
        if (flag) ans++;
    }
    printf("%d\n", ans);
    return 0;
}
```

