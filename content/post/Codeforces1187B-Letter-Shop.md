---
title: "Codeforces1187B Letter Shop"
date: 2019-11-02T14:56:17+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [字符串]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces1187B](https://codeforces.com/contest/1187/problem/B )

**题目大意**：给定字符串 $p$ 和多组字符串 $s$，求 $p$ 包含 $s$ 中所有字母（考虑个数）的最短前缀长度。

<!--more-->

> 预处理

`f[idx][cnt]`维护在模板串中字母`'a'+idx` 刚好出现了`cnt`次的下标。

```cpp
#include <iostream>
#include <cstring>

using namespace std;

const int N = 200010;

int n, m;
char p[N], s[N];
int f[26][N], cntp[26], cnts[26];

int main() {
    scanf("%d%s%d", &n, p, &m);
    for (int i = 0; i < n; i++) {   
        int idx = p[i] - 'a';
        cntp[idx]++;
        f[idx][cntp[idx]] = i;
    }
    while (m--) {   
        memset(cnts, 0, sizeof cnts);
        scanf("%s", s);
        int len = strlen(s);
        int res = 0;
        for (int i = 0; i < len; i++) {   
            int idx = s[i] - 'a';
            cnts[idx]++;
            res = max(res, f[idx][cnts[idx]] + 1);
        }
        printf("%d ", res);
    }
    return 0;
}
```