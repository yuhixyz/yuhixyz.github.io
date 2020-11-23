---
title: "HDU2328 Corporate Identity"
date: 2020-04-05T21:56:47+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [后缀数组, 字符串]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[HDU2328](https://acm.njupt.edu.cn/problem/HDU2328)

**题目大意**：多组测试数据，每组给定 $n$ 个字符串，求他们的最长公共连续子串（最小字母序）。

<!--more-->

> 后缀数组 && 二分

## 解法

和 [UVa11106 Life Forms](https://ketchuppp.xyz/post/UVa11107-Life-Forms/) 一样啊。

将字符串连起来，添加分隔符。二分 LCP 长度，对 height 分段即可。

## 代码

```cpp
#include <iostream>
#include <cstring>
#include <cstdio>
#include <set>
 
using namespace std;

const int N = 800010, M = 4010;

int n, T;
int sa[N], rk[N], cnt[N], oldrk[N << 1], id[N], px[N];
char s[N];
int ht[N];
int belong[N], idx;
int maxr = N;

inline bool cmp(int x, int y, int k) {
    return oldrk[x] == oldrk[y] && oldrk[x + k] == oldrk[y + k];
}

void SA() {
	int i, p = 0, k, m = 300;
	memset(cnt, 0, sizeof cnt);
	for (i = 1; i <= n; i++) cnt[rk[i] = s[i]]++;
	for (i = 1; i <= m; i++) cnt[i] += cnt[i - 1];
	for (i = n; i >= 1; i--) sa[cnt[rk[i]]--] = i;
	for (k = 1; k < n; k <<= 1, m = p) { 
		for (p = 0, i = n ; i > n - k; i--) id[++p] = i;
		for (i = 1;i <= n; i++){
			if (sa[i] > k) id[++p] = sa[i] - k;
		}
		memset(cnt, 0, sizeof cnt);
		for (i = 1; i <= n; i++) cnt[px[i] = rk[id[i]]]++;
		for (i = 1; i <= m; i++) cnt[i] += cnt[i - 1];
		for (i = n; i >= 1; i--) sa[cnt[px[i]]--] = id[i];
		memcpy(oldrk, rk, sizeof rk);
		for (p = 0, i = 1; i <= n; i++){
			rk[sa[i]] = cmp(sa[i], sa[i - 1], k) ? p : ++p;
		}
	}
	for (int i = 1; i <= n; i++) {
		if (rk[i] == 1) continue;
		int k = max(ht[rk[i - 1]] - 1, 0);
		while (i + k <= n && s[i + k]== s[sa[rk[i] - 1] + k]) k++;
		ht[rk[i]] = k;
	}
}

bool check(int len) {
    set<int> S;
    S.insert(belong[sa[1]]);
    for (int i = 2; i <= n; i++) {
        while (ht[i] >= len && i <= n) {
            S.insert(belong[sa[i]]);
            i++;
        }
        if (S.size() == T) return true;
        S.clear();
        S.insert(belong[sa[i]]);
    }
    return false;
}

void print(int len) {
    set<int> S;
    bool flag = false;
    S.insert(belong[sa[1]]);
    for (int i = 2; i <= n; i++) {
        while (ht[i] >= len && i <= n) {
            S.insert(belong[sa[i]]);
            i++;
        }
        if (S.size() == T) {
            for (int j = sa[i - 1]; j <= sa[i - 1] + len - 1; j++) putchar(s[j]);
            puts("");
            flag = true;
            break;
        }
        S.clear();
        S.insert(belong[sa[i]]);
    }
    if (!flag) puts("IDENTITY LOST");
}

void solve() {
    maxr = N;
    char a = 1;
    memset(belong, -1, sizeof belong);
    idx = 0;
    int t = 0;
    for (int i = 0; i < T; i++) {
        scanf("%s", s + t + 1);
        int m = strlen(s + 1);
        maxr = min(maxr, m - t);
        s[m + 1] = a++;
        if (a == 97) a = 1;
        for (int j = t + 1; s[j]; j++) belong[j] = i;
        t = m + 1;
    }
    s[t] = '\0';
    // printf("%s\n", s + 1);
    // for (int i = 1; s[i]; i++) printf("%d ", belong[i]);
    n = strlen(s + 1);
    SA();
    // 二分LCP的长度
    int l = 1, r = maxr;
    while (l < r) {
        int mid = l + r + 1 >> 1;
        if (check(mid)) l = mid;
        else r = mid - 1;
    }
    print(l);
}

int main() {
    while (scanf("%d", &T), T) solve();
    return 0;
}
```
