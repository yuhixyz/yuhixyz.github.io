---
title: "Codeforces535D Tavas and Malekas"
date: 2020-03-06T20:52:41+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [KMP, 字符串哈希, 字符串]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces535D](https://codeforces.com/contest/535/problem/D)

**题目大意**：给定两个字符串 $s,p$，给定 $p$ 在 $s$ 上的 $k$ 个起始位置 $x_i$，用 $p$ 多次覆盖到 $s$ 上，但 $p$ 在 $s$ 上相同位置的覆盖不能出现冲突，求这样的 $s$ 有多少个。答案 $\rm mod \ 1e9+7$。

<!--more-->

> $\rm KMP$ || 字符串哈希

## 解法

如果 $p$ 在 $s$ 上的所有覆盖都合法，那么只要统计没有被覆盖的点的数量 $\rm cnt$ 即可，答案就是 $26^{\rm cnt}$。如果发生了重叠部分的冲突，答案就是 $0$。本题的关键在于如何判定重叠部分是否发生冲突，具体如下。

约定：$p$ 的长度为 $n$，$s$ 的长度为 $m$，共有 $k$ 个起始位置 $x_i$，$\rm cnt$ 表示已经被覆盖的点数，则 $m-\mathrm{cnt}$ 表示未被覆盖的点数。

我们只需要考虑相邻的两个的起始位置 $x\_i, x\_{i-1}$，如果 $s$ 的子串 $[x\_{i-1}, x\_{i-1}+n-1 ]$ 与 $[x\_i, x\_i+n-1 ]$ 没有发生重叠，则 $\mathrm{cnt}$ 直接加上 $n$；如果发生了重叠，那么重叠部分即 $s$ 的子串 $[x\_i,x\_{i-1}+n-1]$，重叠长度 $\mathrm{len}=x\_{i-1} + n - x_i$。这一部分，对于不变的 $p$ 串来说，分别是长度为 $\rm len$ 的 $p$ 的前缀和后缀。即只要判断 $p[1,\mathrm{len}]$ 是否等于 $p[n-\mathrm{len}+1,n]$。如果不冲突，那么 $\rm cnt$ 加上 $n-\mathrm{len}$，否则返回 $0$。

针对 $p$ 的自身前后缀匹配的问题，可以考虑 $\rm KMP$ 或者字符串哈希。

## KMP

先预处理 $\rm Next$ 数组，且现在已知重叠长度为 $\rm len $。下面所说的前缀/后缀均表示**真**前缀/后缀。

由 $\mathrm{Next}[i]$ 含义：以 $i$ 结尾的能够匹配的最大前缀长度，$\mathrm{Next}[n]$ 即表示串 $p$ 的后缀所能匹配的最长前缀长度。有三种情况：

+ $\mathrm{Next}[n] < \mathrm{len}$：一定冲突
+ $\mathrm{Next}[n] = \mathrm{len}$：一定无冲突
+ $\mathrm{Next}[n] > \mathrm{len}$：此时需要不断回退 $\mathrm{Next}$ 指针，即不断获取以 $n$ 结尾能匹配的所有前缀长度。如果某一次回退到恰好相等，才能保证无冲突，否则冲突。

如果对 $\mathrm{Next}[i]$ 含义，不太理解，可看图解（点击显示）

{{% admonition note Next数组含义图解 "true" %}}
{{< img src="KMP.png" width="100%" >}}
{{% /admonition %}}


**核心代码**：$\rm Line \ 38\text{~}53$

```cpp
#include <bits/stdc++.h>
 
using namespace std;
 
typedef long long LL;
 
const int N = 1000010, mod = 1e9 + 7;
 
int n, m, k;
char p[N];
int ne[N];
int x[N];

int ksm(int a, int k) {
    int res = 1;
    while (k) {
        if (k & 1) res = (LL)res * a % mod;
        a = (LL)a * a % mod;
        k >>= 1;
    }
    return res;
}
 
int main() {
    cin >> m >> k >> p + 1;
    for (int i = 0; i < k; i++) scanf("%d", &x[i]);
    n = strlen(p + 1);
    for (int i = 2, j = 0; i <= n; i++) {
        while (j && p[i] != p[j + 1]) j = ne[j];
        if (p[i] == p[j + 1]) j++;
        ne[i] = j;
    }
    int cnt = 0;
    for (int i = 0; i < k; i++) {
        if (!i) cnt += n;
        else {
            int len = x[i - 1] + n - x[i];
            if (len > 0) {
                bool flag = false;
                int j = ne[n];
                while (j) {
                    if (j < len) break;
                    if (j == len) {
                        flag = true;
                        cnt += n - len;
                        break;
                    }
                    j = ne[j];
                }
                if (!flag) {
                    puts("0");
                    return 0;
                }
            } else {
                cnt += n;
            }
        }
    }
    printf("%d\n", ksm(26, m - cnt));
    return 0;
}
```

比赛时一开始 WA 了 $2$ 次，原因是当 $\mathrm{Next}[n] > \mathrm{len}$，被我直接判定为无冲突，没有 $\rm Next $ 指针回退的过程，感谢[何同学](https://blog.csdn.net/weixin_45080867/article/details/104702946)赛后点醒。

## 字符串哈希

当时 $\rm KMP$ WA 了 $2$ 发之后不明原因，于是果断换哈希来判定 $p$ 串前后缀是否匹配。然后走上了调试的不归路，目前猜测原因可能是ULL自然溢出运气不好，单哈希不稳啊。

~~`wa on test 67`，还在调试~~

果然是自然溢出被卡了，换了一个模数 $998244353$ 就A了，这心态崩了啊。

```cpp
#include <bits/stdc++.h>
 
using namespace std;
 
typedef unsigned long long ULL;
typedef long long LL;
 
const int N = 1000100, base = 131, mod = 1e9 + 7;
const int MOD = 998244353;
 
int n, m, k;
char str[N];
LL h[N], p[N];
int x[N];
 
int ksm(int a, int k) {
    int res = 1;
    while (k) {
        if (k & 1) res = (LL)res * a % mod;
        a = (LL)a * a % mod;
        k >>= 1;
    }
    return res;
}
 
LL get(int l, int r) {
    return ((h[r] - h[l - 1] * p[r - l + 1]) % MOD + MOD) % MOD;
}
 
int main() {
    cin >> m >> k >> str + 1;
    for (int i = 0; i < k; i++) scanf("%d", &x[i]);
    n = strlen(str + 1);
    p[0] = 1;
    for (int i = 1; i <= n; i++) {
        p[i] = p[i - 1] * base % MOD;
        h[i] = (h[i - 1] * base + str[i] - 'a' + 1) % MOD;
    }
    int cnt = 0;
    for (int i = 0; i < k; i++) {
        if (!i) cnt += n;
        else {
            int len = x[i - 1] + n - x[i];
            if (len > 0) {
                if (get(n - len + 1, n) != get(1, len)) {
                    puts("0");
                    return 0;
                }
                cnt += n - len;
            } else {
                cnt += n;
            }
        }
    }
    printf("%d\n", ksm(26, m - cnt));
    return 0;
}
```

