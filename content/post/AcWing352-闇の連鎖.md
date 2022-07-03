---
title: "AcWing352 闇の連鎖"
date: 2020-01-21T20:54:23+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [LCA, 树上差分, 图论]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[AcWing352](https://www.acwing.com/problem/content/description/354/)

**题目描述**：传说中的暗之连锁被人们称为 Dark。

Dark 是人类内心的黑暗的产物，古今中外的勇者们都试图打倒它。

经过研究，你发现 Dark 呈现无向图的结构，图中有 $N$ 个节点和两类边，一类边被称为主要边，而另一类被称为附加边。

Dark 有 $N – 1$ 条主要边，并且 Dark 的任意两个节点之间都存在一条只由主要边构成的路径。

另外，Dark 还有 $M$ 条附加边。

你的任务是把 Dark 斩为不连通的两部分。

一开始 Dark 的附加边都处于无敌状态，你只能选择一条主要边切断。

一旦你切断了一条主要边，Dark 就会进入防御模式，主要边会变为无敌的而附加边可以被切断。

但是你的能力只能再切断 Dark 的一条附加边。

现在你想要知道，一共有多少种方案可以击败 Dark。

注意，就算你第一步切断主要边之后就已经把 Dark 斩为两截，你也需要切断一条附加边才算击败了 Dark。

<!--more-->

**输入格式**

第一行包含两个整数 $N$ 和 $M$。

之后 $N – 1$ 行，每行包括两个整数 $A$ 和 $B$，表示 $A$ 和 $B$ 之间有一条主要边。

之后 $M$ 行以同样的格式给出附加边。

**输出格式**

输出一个整数表示答案。

**数据范围**

$N≤100000,M≤200000$,数据保证答案不超过 $2^{31}−1$

**输入样例**

```c
4 1 
1 2 
2 3 
1 4 
3 4 
```

**输出样例**

```c
3
```

> 树上差分

## 解法

题意：先砍一条树边，再砍一条非树边，使原图不连通。

{{< img src="AcWing352.png" >}}

1. 添加 $1$ 条非树边，会形成一个环，在环上的树边，权值全部加 $1$，要使得图不连通，只要砍断环上绿色的任意一条树边，并砍掉一条红色的非树边。
2. 添加 $2$ 条非树边，就会出现 $2$ 个环，在环上的树边，权值全部加 $1$，这时候就会有一些权值为 $2$ 的边，表明如果要砍去这条边来使得图不连通，就必须砍去 $2$ 条对应环上的非树边。当然，如果权值为 $0$，表明不在环上， 那么砍去这条树边已经使图不连通了，再砍去任意一条非树边即可。

因此我们可以扫描所有的非树边，对环上的树边全部权值加 $1$，这个操作可以用树上差分来做。

## 树上差分操作

1. 将 $[a, b]$ 路径上的边全部加 $c$，即 `d[a]+=c, d[b]+=c, d[lca(a,b)]-=2*c`

2. $u \rightarrow v$ 的边权，即 $u$ 的子树的边权之和

## 解法

1. 建树并预处理 $\rm LCA$ 倍增数组。
2. 对于每一条非树边，将与其构成环的树边全部加 $1$ 。
3. $\rm DFS$ 求树边的权值 $s$，若 $s=0$，则砍去这条树边，再砍去任意一条非树边即可，答案加上 $m$；若 $s=1$，则砍去这条树边，还需要砍去它所在环上对应的那条非树边，答案加上 $1$；若 $s>1$，则不能为答案做出贡献。


```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 100010, M = N * 2;

int n, m;
int h[N], e[M], ne[M], idx;
int depth[N], fa[N][17];
int d[N], q[N];
int res;

void add(int a, int b) {
    e[idx] = b, ne[idx] = h[a], h[a] = idx++;
}

void bfs(int root) {
    memset(depth, -1, sizeof depth);
    depth[0] = 0, depth[root] = 1;
    int hh = 0, tt = 0;
    q[0] = root;
    while (hh <= tt) {
        int t = q[hh++];
        for (int i = h[t]; ~i; i = ne[i]) {
            int j = e[i];
            if (depth[j] == -1) {
                depth[j] = depth[t] + 1;
                q[++tt] = j;
                fa[j][0] = t;
                for (int k = 1; k <= 16; k++) {
                    fa[j][k] = fa[fa[j][k - 1]][k - 1];
                }
            }
        }
    }
}

int lca(int a, int b) {
    if (depth[a] < depth[b]) swap(a, b);
    for (int k = 16; k >= 0; k--) {
        if (depth[fa[a][k]] >= depth[b])
            a = fa[a][k];
    }
    if (a == b) return a;
    for (int k = 16; k >= 0; k--) {
        if (fa[a][k] != fa[b][k])
            a = fa[a][k], b = fa[b][k];
    }
    return fa[a][0];
}

int dfs(int u, int father) {
    int sum = d[u];
    for (int i = h[u]; ~i; i = ne[i]) {
        int j = e[i];
        if (j == father) continue;
        int s = dfs(j, u);
        sum += s;
        if (s == 0) res += m;
        else if (s == 1) res++;
    }
    return sum;
}

int main() {
    cin >> n >> m;
    memset(h, -1, sizeof h);
    for (int i = 0; i < n - 1; i++) {
        int a, b;
        cin >> a >> b;
        add(a, b), add(b, a);
    }
    bfs(1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        d[a]++, d[b]++, d[lca(a, b)] -= 2;
    }
    dfs(1, -1);
    cout << res << endl;
    return 0;
}
```

