---
title: "UVa11107 Life Forms"
date: 2020-03-30T18:03:50+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [后缀数组, 字符串, 二分]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[UVa11107](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2048)

**题目大意**：多组测试数据。每组数据给定 $T$ 个字符串，求至少出现在 $\lfloor\frac{T}{2}\rfloor$ 个字符串中的最长连续子串，如果多解，均需要输出；无解输出 $-1$ 。

<!--more-->

> 后缀数组 && 二分

## 解法

将所有串拼接起来，以其中没有出现过的字符作为分割，并给每个位置记录其所在字符串的编号。然后求后缀数组以及 $height[\ ]$ 数组。二分子串长度 $mid$，每次 $\rm check$ 需要在 $height[\ ]$ 中求连续的 $height[i] \ge mid$ 的段，将对应的后缀所在字符串的编号插入集合 $S$ ，这样每处理一段，就可以得到当前区间中长度为 $mid$ 的子串出现在了多少个给定的不同的字符串中。

坑点：$T=1$ 需要特判，没特判居然是 PE ，分明输出是错误的，但却不是 WA ，害我 debug 一小时。

## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <set>

using namespace std;

const int N = 100110;

int n, T, Case;
int sa[N], rk[N], cnt[N], oldrk[N << 1], id[N], px[N];
string s;
int ht[N];
int num[N]; // 存每个下标对应的字符串标号
int maxv;

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
    S.insert(num[sa[1]]);
    for (int i = 2; i <= n; i++) {
        while (ht[i] >= len && i <= n) {
            // 对应的串编号加入S
            S.insert(num[sa[i]]);
            i++;
        }
        // 查看上面这段是否找到一组解
        if (S.size() > T / 2) return true;
        S.clear();
        S.insert(num[sa[i]]);
    }
    return false;
}

void judge(int len) {
    set<int> S;
    bool flag = false;
    S.insert(num[sa[1]]);
    for (int i = 2; i <= n; i++) {
        while (ht[i] >= len && i <= n) {
            // 对应的串编号加入S
            S.insert(num[sa[i]]);
            i++;
        }
        // 查看上面这段是否找到一组解
        if (S.size() > T / 2) {
            for (int j = sa[i - 1]; j <= sa[i - 1] + len - 1; j++) putchar(s[j]);
            puts("");
            flag = true;
        }
        S.clear();
        S.insert(num[sa[i]]);
    }
    if (!flag) puts("?");
}

void solve() {
    SA();
    // 二分长度
    int l = 1, r = maxv;
    while (l < r) {
        int mid = l + r + 1 >> 1;
        if (check(mid)) l = mid;
        else r = mid - 1;
    }
    // cout << l << endl;
    judge(l);
}

int main() {
    while (scanf("%d", &T), T) {
        if (Case) puts("");
        memset(num, 0, sizeof num);
        maxv = 1010;
        s = "#";
        string t;
        if (T == 1) {
            cin >> t;
            s += t;
            cout << t << endl;
            continue;
        }
        int p = 0;
        char c = 1;
        for (int i = 0; i < T; i++) {
            cin >> t;
            maxv = min(maxv, (int)t.size());
            s += t;
            s += c;
            c++;
            if (c == 96) c = 123;
            for (int j = p + 1; j < s.size(); j++) num[j] = i;
            p += t.size() + 1;
        }
        n = s.size() - 1;
        solve();
        Case++;
    }
    return 0;
}
```

## 参考资料

1. [青い記憶的博客](https://www.luogu.com.cn/blog/xjzsq/zi-fu-chuan-suan-fa)