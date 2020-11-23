---
title: "Codeforces558E a Simple Task"
date: 2020-08-19T00:42:36+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [分块]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces558E](https://codeforces.com/problemset/problem/558/E)

<!--more-->

## 题意

给定一个长度为 $n(10^5)$ 的字符串（只含小写英文字母），和 $q(5\times 10^4)$ 次操作。

每次操作给定 $l\ r\ k$ 表示给区间 $[l,r]$ 的字符串排序，$k=1$ 为升序，$k=0$ 为降序。

输出最终的字符串。

## 解法

> 分块 / 线段树

### 分块

每块维护一个标记 $\mathrm{tag}[i]$，$-1$ 表示该块无序，$0$ 表示该块降序，$1$ 表示该块升序。

同时维护一个 $\mathrm{cnt}[i][j]$ 数组，表示第 $i$ 块中字母 $j$ 出现的次数。

每次操作，先统计 $[l,r]$ 区间内，所有字母的出现次数，这样根据有序性，可以给每一块直接分配字母。

先处理左侧的小块，需要先将该块的标记先清空（即将它作用到该块上，比如标记为 $0$ 那么就先将这个块排序成降序），然后有序分配字母。对于中间的大块来说，修改标记后，需要更新每个大块的 $\mathrm{cnt}$ 数组，按照顺序给每个大块分配字母就可以了。然后处理右侧小块。

输出答案：枚举每一块，根据标记分别进行输出即可。标记为 $-1$ 那么直接输出；标记为 $0$，就根据该块的 $\rm cnt$ 数组降序输出；标记为 $1$ 就升序输出。

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

const int N = 100010, M = 10010;

int n, m, B, sz;
int belong[N], L[N], R[N];
int cnt[M][26];
char str[N];
int tag[M]; // 每块的标记：-1表示无序，0降序，1升序
int tmp[26];

void build() {
    B = sqrt(n), sz = (n - 1) / B + 1;
    for (int i = 1; i <= n; i++) belong[i] = (i - 1) / B + 1;
    for (int i = 1; i <= sz; i++) L[i] = (i - 1) * B + 1, R[i] = L[i] + B - 1;
    R[sz] = n;
}

void rebuild(int x) {
    tag[x] = -1;
    for (int i = 0; i <= 25; i++) cnt[x][i] = 0;
    for (int i = L[x]; i <= R[x]; i++) cnt[x][str[i] - 'a']++;
}

// 下放标记
void update(int x) {
    if (tag[x] == -1) return;
    if (tag[x] == 0) {
        int idx = L[x];
        for (int i = 25; i >= 0; i--) {
            for (int j = 0; j < cnt[x][i]; j++)
                str[idx++] = i + 'a';
        }
    } else {
        int idx = L[x];
        for (int i = 0; i <= 25; i++) {
            for (int j = 0; j < cnt[x][i]; j++)
                str[idx++] = i + 'a';
        }
    }
    return;
}

void modify(int l, int r, int k) {
    if (belong[l] == belong[r]) {
        update(belong[l]);
        memset(tmp, 0, sizeof tmp);
        for (int i = l; i <= r; i++) tmp[str[i] - 'a']++;
        int idx = l;
        if (k == 0) {
            for (int i = 25; i >= 0; i--) {
                while (tmp[i]--) str[idx++] = i + 'a';
            }
        } else {
            for (int i = 0; i <= 25; i++) {
                while (tmp[i]--) str[idx++] = i + 'a';
            }
        }
        rebuild(belong[l]);
        return;
    }
    update(belong[l]), update(belong[r]);
    memset(tmp, 0, sizeof tmp);
    for (int i = l; i <= R[belong[l]]; i++) tmp[str[i] - 'a']++;
    for (int i = L[belong[r]]; i <= r; i++) tmp[str[i] - 'a']++;
    for (int i = belong[l] + 1; i < belong[r]; i++) {
        for (int j = 0; j <= 25; j++) tmp[j] += cnt[i][j];
        tag[i] = k;
    }
    // for (int j = 0; j <= 25; j++) {
    //     putchar(j + 'a');
    //     cout << " " << tmp[j] << endl;
    // }
    if (k == 0) { // 降序分配
        for (int i = l, j = 25; i <= R[belong[l]]; i++) {
            while (j >= 0 && !tmp[j]) j--;
            str[i] = j + 'a', tmp[j]--;
        }
        rebuild(belong[l]);
        for (int i = belong[l] + 1, j = 25; i < belong[r]; i++) {
            // 降序取出分配给第i块
            for (int j = 0; j <= 25; j++) cnt[i][j] = 0;
            int tot = R[i] - L[i] + 1;
            while (j >= 0 && tmp[j] <= tot) {
                tot -= tmp[j];
                cnt[i][j] += tmp[j];
                tmp[j] = 0;
                j--;
            }
            if (tot) {
                tmp[j] -= tot;
                cnt[i][j] += tot;
                tot = 0;
            }
        }
        for (int i = L[belong[r]], j = 25; i <= r; i++) {
            while (j >= 0 && !tmp[j]) j--;
            str[i] = j + 'a', tmp[j]--;
        }
        rebuild(belong[r]);
    } else { // 升序分配
        for (int i = l, j = 0; i <= R[belong[l]]; i++) {
            while (j <= 25 && !tmp[j]) j++;
            str[i] = j + 'a', tmp[j]--;
        }
        rebuild(belong[l]);
        for (int i = belong[l] + 1, j = 0; i < belong[r]; i++) {
            // 升序取出分配给第i块
            for (int j = 0; j <= 25; j++) cnt[i][j] = 0;
            int tot = R[i] - L[i] + 1;
            while (j <= 25 && tmp[j] <= tot) {
                tot -= tmp[j];
                cnt[i][j] += tmp[j];
                tmp[j] = 0;
                j++;
            }
            if (tot) {
                tmp[j] -= tot;
                cnt[i][j] += tot;
            }
        }
        for (int i = L[belong[r]], j = 0; i <= r; i++) {
            while (j <= 25 && !tmp[j]) j++;
            str[i] = j + 'a', tmp[j]--;
        }
        rebuild(belong[r]);
    }
}

int main() {
    cin >> n >> m;
    scanf("%s", str + 1);
    build();
    for (int i = 1; i <= sz; i++) {
        for (int j = L[i]; j <= R[i]; j++) {
            cnt[i][str[j] - 'a']++;
        }
    }
    memset(tag, -1, sizeof tag);
    while (m--) {
        int l, r, k;
        scanf("%d%d%d", &l, &r, &k);
        modify(l, r, k);
    }
    for (int i = 1; i <= sz; i++) {
        if (tag[i] == -1) { // 无序
            for (int j = L[i]; j <= R[i]; j++) putchar(str[j]);
        } else if (tag[i] == 0) { // 降序
            for (int j = 25; j >= 0; j--) {
                while (cnt[i][j]--) putchar(j + 'a');
            }
        } else { // 升序
            for (int j = 0; j <= 25; j++) {
                while (cnt[i][j]--) putchar(j + 'a');
            }
        }
    }
    puts("");
    return 0;
}
```

