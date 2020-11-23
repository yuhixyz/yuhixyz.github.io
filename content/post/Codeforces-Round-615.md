---
title: "Codeforces Round #615 (Div. 3)"
date: 2020-01-24T01:04:01+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [贪心, 分解质因数]
comments: true
displayCopyright: true
toc: true
draft: false
---

解题以及补题报告。

<!--more-->

题目链接：[Codeforces Round #615 (Div. 3)](https://codeforces.com/contest/1294/problems)

## A. Collecting Coins

列方程，判是否有解。

```cpp
#include <iostream>

using namespace std;

int main () {
    int T, a, b, c, n;
    cin >> T;
    while (T--) {
        cin >> a >> b >> c >> n;
        int t = n + a + b + c;
        if (t % 3 == 0 && ( t >= 3 * a && t >= 3 * b && t >= 3 * c)) puts("YES");
        else puts("NO");
    }
    return 0;
}
```

## B. Collecting Packages

题意：给定一些坐标 $(x,y)$，求从 $(0,0)$ 出发只能向右($R$)和向上($U$)走，如何以最小步数走完所有点，输入步数以及走法（字典序最小的方案），无解输出 NO。

分析：用 $pair$ 存坐标，从左到右从下到上排个序，如果发现后一个在前一个的下面，那么无解。否则就看一下两点的相对位置，优先考虑向右走。

```cpp
#include <bits/stdc++.h>

#define x first
#define y second

using namespace std;

typedef pair<int, int> PII;

const int N = 1010;

int T, n;
PII a[N];

int main() {
    cin >> T;
    while (T--) {
        cin >> n;
        for (int i = 1; i <= n; i++) {
            cin >> a[i].x >> a[i].y;
        }
        sort(a + 1, a + n + 1);
        int step = 0;
        bool flag = true;
        string res;
        for (int i = 0; i < n; i++) {
            if (a[i + 1].y < a[i].y) {
                flag = false;
                break;
            }
            for (int x = a[i].x; x < a[i + 1].x; x++) res += 'R';
            for (int y = a[i].y; y < a[i + 1].y; y++) res += 'U';
        }
        if (!flag) puts("NO");
        else {
            puts("YES");
            cout << res << endl;
        }
    }
    return 0;
}
```

## C. Product of Three Numbers

题意：给定整数 $n$，找到两两不同的三个数 $a,b,c$ 满足 $a,b,c \ge 2$ 且 $a \cdot b\cdot c = n$，输出任意一组 $a,b,c$ 无解输出 NO。

分析：要将 $n$ 分解成 $3$ 个数的乘积，考虑对 $n$ 分解质因数。

1. 如果 $n$ 有 $\ge 3$ 个不同的质因子，那么显然是有解的，取前两个作为 $a,b$ 即可；

2. 如果 $n$ 只有 $2$ 个不同的质因子，即 $n = p_1^{q_1} \cdot p_2^{q_2}$，让 $a，b$ 尽可能取到最小且不同的值，$c$ 才越大越不易冲突，那么 $a = p_1$，① $b = p_2$ ② $b=p_1^2，q_1 \ge 3$。只需要验证这两组情况是否成立即可。
3. 如果 $n$ 只有一个质因子，即 $n = p^q$，如果这种情况有解，那么 $a = p,b=p^2$ 一定是一组解，我们只需验证这组解是否成立即可。

上面的思路主要基于贪心（证明逃）。

```cpp
#include <bits/stdc++.h>

using namespace std;

int T, n;

int main() {
    cin >> T;
    while (T--) {
        cin >> n;
        int x = n;
        unordered_map<int, int> primes;
        for (int i = 2; i <= x / i; i++) {
            while (x % i == 0) {
                x /= i;
                primes[i]++;
            }
        }
        if (x > 1) primes[x]++;
        int a, b, c, k = 0, p1, p2, q1, q2;
        for (auto item: primes) {
            int p = item.first, q = item.second;
            if (k == 0) {
                p1 = p, q1 = q;
            } else if (k == 1) {
                p2 = p, q2 = q;
            }
            k++;
        }
        bool has_answer = true;
        if (k >= 3) {
            a = p1, b = p2, c = n / (a * b);
        } else if (k == 2) {
            a = p1;
            if (q1 >= 3) b = p1 * p1;
            else b = p2;
            c = n / (a * b);
            if (c >= 2 && a * b * c == n && a != c && b != c) has_answer = true;
            else has_answer = false;
        } else {
            a = p1, b = p1 * p1, c = n / (a * b);
            if (c >= 2 && a * b * c == n && a != c && b != c) has_answer = true;
            else has_answer = false;
        }
        if (!has_answer) {
            puts("NO");
        } else {
            puts("YES");
            printf("%d %d %d\n", a, b, c);
        }
    }
    return 0;
}
```

## D. MEX maximizing

题意：给定一个操作数 $x，$$q$ 次询问，每次询问时向数组 $a$ （初始为空）中加入一个数，并可以对数组中的任意一项 $a_i$ 与 $x$ 做任意次($a_i \pm x$)运算，但要保证操作后 $a_i \ge 0$。每次询问前清除之前的加减操作，对每个询问回答：不在数组 $a$ 中的最小的非负整数最大是多少。

分析：要使原数组 $a$ 中尽可能按自然数补满 $[0,1,2,...]$，而对于一个 $a_i$，加减 $x$ 操作，其模 $x$ 的值是不变的，因此我们可以通过模 $x$ 的值来统计当前拥有的可供使用的数，以及填每个位置需要的数。用 $j$ 来记录当前已经填到的位置，对于 $j$ 位置来说，他需要一个 $j \% x$ 来填，如果不够，那么就输出 $j$，否则 $j\%x$ 的数量减少 $1$，$j$ 后移。

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 400010;

int q, x;
int a[N];

int main() {
    cin >> q >> x;
    for (int i = 0, t, j = 0; i < q; i++) {
        cin >> t;
        a[t % x]++;
        for (; j <= q; j++) {
            if (a[j % x] == 0) { // 不够填补j位置
                cout << j << endl;
                break;
            }
            a[j % x]--; // 能够填上，那么就用掉一个
        }
        
    }
    return 0;
}
```

## E. Obtain a Permutation

做法挺妙的，显然每一列单独处理取最优即可。为便于处理，将所有读入的 $a[i][j]--$ 。

我们考虑第 $j$ 列，需要最少操作几次。假设我们对第 $j$ 列循环移动了 $delta$ 次，能够使得 $cnt$ 个元素到达各自的目标位置，也就是说有 $cnt$ 个元素不需要改变值，只需要通过循环移位就能到达目标位置；而剩下的 $n-cnt$ 个元素需要直接修改为目标值。那么 $n-cnt+delta$ 就是一种答案，我们只需要在这类答案中取最小值，就是该列的最优答案，然后加到总答案中。

对于第 $j$ 的列的某一个元素 $a[i][j]$ 而言，令 $col=a[i][j]\text{%}m$ 就是它应该所处的列号，$row=a[i][j]\text{/}m$ 就是目标位置的行号，显然求出来的列号必须为 $j$ 且行号必须在 $[0,n-1]$ 之间。不合法就直接跳过。如果合法，那么计算 $a[i][j]$ 到达目标位置最少循环移动的次数，那么令 $delta=(i-row+n)\text{%}n$（ $delta$ 含义：当前处于第 $i$ 行，需要循环上移，到达第 $row$ 行所需要的最小次数）。设置一个 `map` 来统计循环移动 $delta$ 次能使得多少个数到达目标位置（ $cnt$ 个），即令 `mp[delta]++`。当枚举完该列的所有数字，再遍历 `map` 根据公式 $n-cnt+delta$ 算该列的最优解即可。

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

int n, m;

int main() {
    cin >> n >> m;
    vector<vector<int>> a(n, vector<int>(m));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            scanf("%d", &a[i][j]);
            a[i][j]--;
        }
    }
    int ans = 0;
    for (int j = 0; j < m; j++) {
        map<int, int> mp;
        for (int i = 0; i < n; i++) {
            if (a[i][j] % m != j) continue;
            if (a[i][j] / m >= n) continue;
            // 求a[i][j]循环移位多少次能达到目标位置：第row行
            int row = a[i][j] / m;
            int delta = (i - row + n) % n;
            mp[delta]++;
        }
        int res = n;
        for (auto item : mp) {
            int delta = item.first, cnt = item.second;
            res = min(res, n - cnt + delta);
        }
        ans += res;
    }
    cout << ans << endl;
    return 0;
}
```

## F. Three Paths on a Tree

官方题解写的可好了，[Tutorial](https://codeforces.ml/blog/entry/73274)，不再赘述做法了。还学习到了 `pair<int, int>` 可以使用 `max` 运算。

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

const int N = 200010, M = N * 2;

int n;
int h[N], e[M], ne[M], idx;
int parent[N];
int dist[N], q[N];
vector<int> path;

void add(int a, int b) {
    e[idx] = b, ne[idx] = h[a], h[a] = idx++;
}

PII dfs(int u, int fa, int d) {
    parent[u] = fa;
    PII res = {d, u}; // u向下的最大深度初始化为0，u向下能到达的最远的点为u
    for (int i = h[u]; ~i; i = ne[i]) {
        int j = e[i];
        if (j == fa) continue;
        res = max(res, dfs(j, u, d + 1));
    }
    return res;
}

int main() {
    cin >> n;
    memset(h, -1, sizeof h);
    for (int i = 0; i < n - 1; i++) {
        int a, b;
        scanf("%d%d", &a, &b);
        add(a, b), add(b, a);
    }
    // 求直径
    PII A = dfs(1, -1, 0);
    PII B = dfs(A.second, -1, 0);
    // 判断直径长度是否为n
    int des = B.second;
    while (des != A.second) {
        path.push_back(des);
        des = parent[des];
    }
    path.push_back(A.second);
    if (path.size() == n) { // 当前直径经过了n个点，即一条链的形，那么答案就是n-1
        printf("%d\n%d %d %d\n", n - 1, A.second, B.second, path[1]);
    } else { // 否则需要遍历A->B直径上的所有点，找到其中某一个点往下的最大值是多少
        int hh = 0, tt = -1;
        memset(dist, -1, sizeof dist);
        for (auto ver : path) {
            q[++tt] = ver;
            dist[ver] = 0;
        }
        while (hh <= tt) {
            int t = q[hh++];
            for (int i = h[t]; ~i; i = ne[i]) {
                int j = e[i];
                if (dist[j] == -1) {
                    dist[j] = dist[t] + 1;
                    q[++tt] = j;
                }
            }
        }
        PII C = {-1, -1};
        for (int i = 1; i <= n; i++) {
            if (i == A.second || i == B.second) continue;
            C = max(C, {dist[i], i});
        }
        int len = path.size() - 1 + C.first;
        printf("%d\n%d %d %d\n", len, A.second, B.second, C.second);
    }
    return 0;
}
```