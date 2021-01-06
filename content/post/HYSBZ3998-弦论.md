---
title: "HYSBZ3998 弦论"
date: 2020-04-08T17:45:14+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [后缀自动机, 拓扑排序, 字符串]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[HYSBZ3998](http://www.lydsy.com/JudgeOnline/problem.php?id=3998)

**题目大意**：对于一个给定长度为 $N$ 的字符串，求它的第 $K$ 小子串是什么。

**输入**： 第一行是一个仅由小写英文字母构成的字符串 $S$；第二行为两个整数 $T$ 和 $K$，$T$ 为 $0$ 则表示不同位置的相同子串算作一个。$T=1$ 则表示不同位置的相同子串算作多个。 $K$ 的意义如题所述。

<!--more-->

> 后缀自动机

## 解法

先建立 SAM，然后拓扑排序。

定义 $cnt[i]$ 表示状态 $i$ 所表示的 $endpos$ 集合大小（ $T=0$ 时直接令 $cnt[i]=1$ 即可）。定义 $sum[v]$ 表示从 状态 $v$ 出发的不同路径个数（每条路径都表示在状态 $v$ 中的字符串后添加字符能转移得到的不同字符串个数）。=

那么对于状态 $u \stackrel{c_i}{\rightarrow} v_i$（状态 $u$ 通过添加一个字符 $c_i\in[0,25]$ 转移到了状态 $v_i$）可得转移方程为：

<div>

$$
sum[u] = \Sigma_{u \stackrel{c_i}{\rightarrow}v_i}sum[v_i]
$$

</div>

然后从初始状态 $1$（空串）开始，每次按照字母序 $0\sim 26$ 来选择添加一个字符，每次向存在解的路径上走。$\rm Line73\sim90$

## 代码

```cpp
#include <iostream>
#include <cstdio>
#include <cstring>
#include <algorithm>

using namespace std;

typedef long long LL;

const int N = 1000010, M = N * 2;

int n;
char str[N];
struct SAM {
    int maxlen[M], trans[M][26], link[M], sz, last;
    int cnt[M];
    SAM() { sz = last = 1; }
    void init() {
        memset(maxlen, 0, sizeof maxlen);
        memset(trans, 0, sizeof trans);
        memset(link, 0, sizeof link);
        memset(cnt, 0, sizeof cnt);
        sz = last = 1;
    }
    void extend(int ch) {
        int cur = ++sz, p = last;
        maxlen[cur] = maxlen[p] + 1;
        cnt[cur] = 1;
        for(; p && !trans[p][ch]; p = link[p]) trans[p][ch] = cur;
        if(!p) link[cur] = 1;
        else {
            int q = trans[p][ch];
            if(maxlen[p] + 1 == maxlen[q]) link[cur] = q;
            else {
                int clone = ++sz;
                maxlen[clone] = maxlen[p] + 1;
                memcpy(trans[clone], trans[q], sizeof trans[clone]);
                link[clone] = link[q];
                for(; p && trans[p][ch] == q; p = link[p]) trans[p][ch] = clone;
                link[cur] = link[q] = clone;
            }
        }
        last = cur;
    }
} sam;
int a[M], b[M], sum[M];
int T, k;

int main() {
    scanf("%s%d%d", str, &T, &k);
    for (int i = 0; str[i]; i++) sam.extend(str[i] - 'a');
   	// 基数排序->拓扑序
    for(int i = 1; i <= sam.sz; i++) a[sam.maxlen[i]]++;
    for(int i = 1; i <= sam.sz; i++) a[i] += a[i - 1];
    for(int i = 1; i <= sam.sz; i++) b[a[sam.maxlen[i]]--] = i;
    // dp 
    for(int i = sam.sz; i; i--) {
        int u = b[i];
        if (T == 1) sam.cnt[sam.link[u]] += sam.cnt[u];
        else sam.cnt[u] = 1;
    }
    sam.cnt[1] = 0;
    for (int i = sam.sz; i; i--) {
        int u = b[i];
        sum[u] = sam.cnt[u];
        for (int j = 0; j < 26; j++) {
            int v = sam.trans[u][j];
            if (!v) continue;
            sum[u] += sum[v];
        }
    }
    // solve
    if (k > sum[1]) puts("-1");
    else {
        int u = 1; // 初始状态（空串）
        while (sam.cnt[u] < k) { // p状态集合中不够k个
            k -= sam.cnt[u]; // 更新k，扩展一个字符到新状态中找第k小
            for (int i = 0; i < 26; i++) {
                int v = sam.trans[u][i];
                if (sum[v] >= k) {// 这条路有解
                    putchar(i + 'a');
                    u = v; // 走过去
                    break; // 进入下一次选择
                } else { // 当前状态v不够k个，需要其他字符来转移
                    k -= sum[v]; // v出发能形成得字符串都小于k，更新k;
                }
            }
        }
        puts("");
    }
    return 0;
}
```

