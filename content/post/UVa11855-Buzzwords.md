---
title: "UVa11855 Buzzwords"
date: 2020-03-29T21:21:13+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [后缀数组, 字符串]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[UVa11855](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2955)

<!--more-->

**题目大意**：多组测试，每组给定一行字符串，求长度为 $k$ 的同一子串最多出现的次数，$k=1,2,\cdots$，直到某个长度，不存在出现次数超过 $2$ 的子串为止。

> 后缀数组

## 解法

先求出 $height$ 数组，然后枚举长度 $k$，在 $height$ 中求连续的 $\rm LCP$ 大于等于 $k$ 的最长长度即可。代码体现在 $\rm Line59 \sim 65$。

## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <string>
#include <sstream>
#include <cstring>

using namespace std;

const int N = 100010;
int n;
int sa[N], rk[N], cnt[N], oldrk[N << 1], id[N], px[N];
string s;
int ht[N];
int f[N][2];

inline bool cmp(int x, int y, int k) {
	return oldrk[x] == oldrk[y] && oldrk[x + k] == oldrk[y + k];
}

void SA(){
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
		// memset(cnt, 0, sizeof cnt);
		for (i = 0; i <= m; i++) cnt[i] = 0;
		for (i = 1; i <= n; i++) cnt[px[i] = rk[id[i]]]++;
		for (i = 1; i <= m; i++) cnt[i] += cnt[i - 1];
		for (i = n; i >= 1; i--) sa[cnt[px[i]]--] = id[i];
		memcpy(oldrk, rk, sizeof rk);
		for (p = 0, i = 1; i <= n; i++) {
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
	int ans = 0;
	for (int i = 1; i <= n; i++) {
		if (ht[i] < len) continue;
		int j = i;
		while (j + 1 <= n && ht[j + 1] >= len) j++;
		ans = max(ans, j - i + 2);
		i = j;
	}
	if (ans >= 2) {
		printf("%d\n", ans);
		return true; 
	}
	return false;
}

void solve() {
	int len = 1;
	while (check(len)) len++;
	puts("");
}

int main() {
	string line;
	while (getline(cin, line)) {
		stringstream ss(line);
		n = 0;
		s = "#";
		string t;
		while (ss >> t) {
			s += t;
			n += t.size();
		}
		if (s.size() < 2) break;
		SA();
		solve();
	}
	return 0;
}
```

