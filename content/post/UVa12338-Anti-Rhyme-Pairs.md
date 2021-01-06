---
title: "UVa12338 Anti-Rhyme Pairs"
date: 2020-03-16T09:58:01+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [字符串哈希, 二分, 字符串]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[UVa12338](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=3760)

<!--more-->

**题目大意**：给定 $n$ 个字符串，$q$ 组查询，每次询问编号 $x,y$ 的两个字符串的最长公共前缀。 

> 字符串哈希 && 二分

## 解法

空间没法直接开二维数组，用 $n$ 个`vector`来存每个字符串的哈希值，二分前缀长度即可。

注意：由于只需要比较 $1\sim len$ 的哈希值，不需要每次使用`h[len]-h[0]*p[len+1]`来计算这段哈希值，否则会T（因为这个俺T了4发）。

## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <vector>

#define pb push_back
 
using namespace std;

typedef unsigned long long ULL; 
 
const int N = 100010, base = 131;

int T, n, q, Case;
char str[N];
vector<ULL> h[N];
ULL p[N];

int lcp(int x, int y) {
    int l = 0, r = min(h[x].size() - 1, h[y].size() - 1);
    while (l < r) {
        int mid = l + r + 1 >> 1;
        if (h[x][mid] == h[y][mid]) l = mid;
        else r = mid - 1;
    }
    return l;
}

void solve() {
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) h[i].clear();
    for (int i = 1; i <= n; i++) {
        scanf("%s", str + 1);
        h[i].pb(0);
        for (int j = 1; str[j]; j++) {
            h[i].pb(h[i][j - 1] * base + str[j]);
        }
    }
    printf("Case %d:\n", ++Case);
    scanf("%d", &q);
    while (q--) {
        int x, y;
        scanf("%d%d", &x, &y);
        printf("%d\n", lcp(x, y));
    }
}

int main() {
    scanf("%d", &T);
    p[0] = 1;
    for (int i = 1; i <= 10010; i++) p[i] = p[i - 1] * base;
    while (T--) solve();
    return 0;
}
```

