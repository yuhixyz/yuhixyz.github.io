---
title: "Codeforces461B Appleman and Tree"
date: 2020-05-16T00:47:46+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [树形DP, DP]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces461B](https://codeforces.ml/problemset/problem/461/B)

<!--more-->

**题目大意**：给定一棵树，每个点是白色或者黑色，保证至少有一个点是黑色。求将这棵树通过删边划分成，保证每个部分有且仅有一个黑色结点的方案数。

> 树形 DP

状态表示不看题解想不到，但分类讨论完推出来正确的转移方程，真是神清气爽。

## 解法

状态表示：$f[u][1]$ 表示对以 $u$ 为根的子树划分，$u$ 所在连通块有且一个黑色点的方案数，$f[u][0]$ 表示对以 $u$ 为根的子树划分，$u$ 所在连通块全是全是白色节点的方案数。

任选一个点作为根结点，这里选择 $0$ 作为根，那么答案就是 $f[0][1]$。

如果 $u=\texttt{black}$，那么初始化 $f[u][1]=1,f[u][0]=0$；如果 $u=\texttt{white}$，那么初始化 $f[u][0]=1,f[u][1]=0$ 。简化写就是 $f[u][\text{color}[u]]=1$ 。

下面我们考虑 $u$ 的所有子结点 $j$，看这条边 $u\rightarrow j$ 是否删去，能对 $f[u][0],f[u][1]$ 作出什么贡献。

一、$u=\texttt{black}$（显然此时 $f[u][0]$ 恒为 $0$，只要计算 $f[u][1]$ 即可）
1. 如果 $u$ 的子树 $j$ 所在的连通块中全是白色，那么边 $u\rightarrow j$ 必须保留，为 $f[u][1]$ 贡献的方案数为：$f[u][1]\times f[j][0]$ 。
2. 如果 $u$ 的子树 $j$ 所在连通块有一个黑色，那么边 $u\rightarrow j$ 必须删掉，因为一个连通块中只能有 $1$ 个黑色，而 $u$ 已经是黑色了。由于删边，让 $u$ 和 $j$ 相互独立了，那么能为 $f[u][1]$ 贡献的方案数：$f[u][1]\times f[j][1]$ 。

二、$u=\texttt{white}$（ $f[u][0]$ 和 $f[u][1]$ 均需要计算）
1. 如果 $j$ 的连通块全是白色，若选择保留边 $u\rightarrow j$，就能为 $f[u][0]$ 贡献的方案数：$f[u][0]\times f[j][0]$ 。
2. 如果 $j$ 的连通块有一个黑色，若删去这条边，那么为 $f[u][0]$ 贡献方案数：$f[u][0]\times f[j][1]$。若保留这条边，那么就可以和 $u$ 合并，为 $f[u][1]$ 贡献的方案数：$f[u][0]\times f[j][1]$ 。

**转移方程**  
$$
f[u][1]=f[u][1]\times(f[j][0]+f[j][1])+f[u][0]\times f[j][1]
$$

$$
f[u][0]=f[u][0]\times(f[j][0]+f[j][1])
$$
  
细节问题：由于 $f[u][1]$ 计算时需要用到上一层状态的 $f[u][0]$。因此，需要先计算第一个转移，再计算第二个转移。

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;

const int N = 100100, mod = 1e9 + 7;

int n;
int color[N];
int h[N], e[N << 1], ne[N << 1], idx;
LL f[N][2]; // f[u][1]表示对以u为根的子树划分，u所在连通块有且一个黑色点的方案数
// f[u][0]表示...没有黑色点的方案数

void add(int a, int b) {
    e[idx] = b, ne[idx] = h[a], h[a] = idx++;
}

void dfs(int u, int fa) {
    f[u][color[u]] = 1;
    for (int i = h[u]; ~i; i = ne[i]) {
        int j = e[i];
        if (j == fa) continue;
        dfs(j, u);
        f[u][1] = ((f[u][1] * (f[j][1] + f[j][0])) % mod + f[u][0] * f[j][1] % mod) % mod;
        f[u][0] = f[u][0] * (f[j][1] + f[j][0]) % mod;    
    }
}

int main() {
    memset(h, -1, sizeof h);
    cin >> n;
    for (int i = 0; i < n - 1; i++) {
        int x; scanf("%d", &x);
        add(i + 1, x), add(x, i + 1);
    }
    for (int i = 0; i < n; i++) scanf("%d", &color[i]);
    dfs(0, -1);
    cout << f[0][1] << endl;
    return 0;
}
```
