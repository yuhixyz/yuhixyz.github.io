---
title: "kuangbin 树链剖分专题"
date: 2020-12-05T17:54:21+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [树链剖分, 线段树]
comments: true
displayCopyright: true
toc: true
draft: false
---

树链剖分专题。

<!--more-->

[[kuangbin]各种各样的题单(去重后)](https://vjudge.net/article/752)

## FZU2082 过路费

题意：有 $n$ 个点的树，有边权。两种操作：① $0\ a\ b$，表示更新第 $a$ 条边权为 $b$，② $1\ a\ b$， 表示询问 $a$ 到 $b$ 的最短路径边权之和。

分析：树链剖分后转化为序列问题用线段树维护，由于线段树没法维护边权，因此在原来树中需要将边权下放到点权，由于每个结点（除根结点）只有 $1$ 个父亲，因此可以将父亲 -> 儿子的边权下放到儿子的点权上。求树上两点 $u,v$ 距离时，需要注意不能把 $\mathrm{LCA}(u,v)$ 的点权计算进去。

```cpp
#include <iostream>
#include <algorithm>
#include <cstdio>
#include <cstring>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

const int N = 50010, M = N << 1;

int n, m;
int h[N], e[M], w[M], ne[M], idx;
struct Tree {
    int l, r;
    LL sum;
} tr[N << 2];
int dfn[N], ts; // dfn表示dfs序（优先遍历重儿子）
int dep[N], sz[N], top[N], fa[N], son[N];
// dep[i]表示i的深度（根节点的深度为1）,sz[i]表示以i为根的子树的大小
// top[i]表示i所在重链的顶点，fa[i]表示i的父结点，son[i]表示子树i的重儿子

void add(int a, int b, int c) {
    e[idx] = b, w[idx] = c, ne[idx] = h[a], h[a] = idx++;
}

void dfs1(int u, int father, int depth) {
    dep[u] = depth, fa[u] = father, sz[u] = 1;
    for (int i = h[u]; ~i; i = ne[i]) {
        int j = e[i];
        if (j == father) continue;
        dfs1(j, u, depth + 1);
        sz[u] += sz[j];
        if (sz[son[u]] < sz[j]) son[u] = j;
    }
}

// 点u所属的重链的顶点为t
void dfs2(int u, int t) {
    dfn[u] = ++ts, top[u] = t;
    if (!son[u]) return; // u为叶结点
    dfs2(son[u], t); // 处理重儿子
    // 处理轻儿子
    for (int i = h[u]; ~i; i = ne[i]) {
        int j = e[i];
        if (j == fa[u] || j == son[u]) continue;
        dfs2(j, j); // 轻儿子所处重链的顶点就是自己 
    }
}

void pushup(int u) {
    tr[u].sum = tr[u << 1].sum + tr[u << 1 | 1].sum;
}

void build(int u, int l, int r) {
    if (l == r) {
        tr[u].l = l, tr[u].r = r, tr[u].sum = 0;
    } else {
        tr[u].l = l, tr[u].r = r;
        int mid = l + r >> 1;
        build(u << 1, l, mid), build(u << 1 | 1, mid + 1 , r);
    }
}

// 将x位置修改成y
void update(int u, int x, int y) {
    if (tr[u].l == x && tr[u].r == x) {
        tr[u].sum = y;
    } else {
        int mid = tr[u].l + tr[u].r >> 1;
        if (x <= mid) update(u << 1, x, y);
        else update(u << 1 | 1, x, y);
        pushup(u);
    }
}

// 求线段树中[l,r]区间和
LL query(int u, int l, int r) {
    if (tr[u].l >= l && tr[u].r <= r) {
        return tr[u].sum;
    } else {
        LL res = 0;
        int mid = tr[u].l + tr[u].r >> 1;
        if (l <= mid) res += query(u << 1, l, r);
        if (r > mid) res += query(u << 1 | 1, l, r);
        return res;
    }
}

// 求树上u-v之间的路径和
LL query_path(int u, int v) {
    LL res = 0;
    while (top[u] != top[v]) { // u,v不在同一个重链上
        if (dep[top[u]] < dep[top[v]]) swap(u, v);
        // 加上u所在的重链和
        // 其区间为[dfn[top[u]], dfn[u]]
        res += query(1, dfn[top[u]], dfn[u]);
        u = fa[top[u]];
    }
    if (u == v) return res;
    if (dep[u] < dep[v]) swap(u, v); // 保证u在下面v在上面
    // 加上u-v之间路径的和，v当前在LCA位置，这个点的点权不能算上。
    res += query(1, dfn[son[v]], dfn[u]);
    return res;
}

int main() {
    while (cin >> n >> m) {
        for (int i = 1; i <= n; i++) {
            h[i] = -1, dfn[i] = 0, son[i] = 0;
        }
        idx = ts = 0;
        for (int i = 0; i < n - 1; i++) {
            int a, b, c;
            scanf("%d%d%d", &a, &b, &c);
            add(a, b, c), add(b, a, c);
        }
        dfs1(1, -1, 1); // 预处理dep,fa,sz
        dfs2(1, 1); // 求dfs序dfn,top
        build(1, 1, n);
        for (int i = 0; i < idx; i += 2) {
            int u = e[i], v = e[i ^ 1];
            if (dep[u] > dep[v]) swap(u, v);
            update(1, dfn[v], w[i]);
        }
        while (m--) {
            int type, x, y;
            cin >> type >> x >> y; 
            if (type == 0) { // 更新第x条路的过路费为y
                // 第1条 idx=0,1
                // 第2条 idx=2,3
                // 第x条 idx=2x-2,2x-1
                int v = e[2 * x - 2], u = e[2 * x - 1];
                if (dep[u] > dep[v]) swap(u, v);
                // u是父亲, v是儿子，令点v权值更新为y
                update(1, dfn[v], y);
            } else {
                printf("%lld\n", query_path(x, y));
            }
        }
    }
    return 0;
}
```

## HDU3966 Aragorn's Story

分析：树剖后线段树搞一搞也是板子。

```cpp
#include <iostream>
#include <algorithm>
#include <cstdio>
#include <cstring>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

const int N = 50010, M = N << 1;

int n, m, p;
int a[N], new_a[N];
int h[N], e[M], w[M], ne[M], idx;
struct Tree {
    int l, r;
    LL add, sum;
} tr[N << 2];
int dfn[N], ts;
int dep[N], sz[N], top[N], fa[N], son[N];

void add(int a, int b) {
    e[idx] = b, ne[idx] = h[a], h[a] = idx++;
}

void dfs1(int u, int father, int depth) {
    dep[u] = depth, fa[u] = father, sz[u] = 1;
    for (int i = h[u]; ~i; i = ne[i]) {
        int j = e[i];
        if (j == father) continue;
        dfs1(j, u, depth + 1);
        sz[u] += sz[j];
        if (sz[son[u]] < sz[j]) son[u] = j;
    }
}

// 点u所属的重链的顶点为t
void dfs2(int u, int t) {
    dfn[u] = ++ts, new_a[ts] = a[u], top[u] = t;
    if (!son[u]) return; // u为叶结点
    dfs2(son[u], t); // 重儿子
    // 处理轻儿子
    for (int i = h[u]; ~i; i = ne[i]) {
        int j = e[i];
        if (j == fa[u] || j == son[u]) continue;
        dfs2(j, j); // 轻儿子所处重链的顶点就是自己 
    }
}

void pushup(int u) {
    tr[u].sum = tr[u << 1].sum + tr[u << 1 | 1].sum;
}

void pushdown(int u) {
    if (tr[u].add) {
        tr[u << 1].add += tr[u].add, tr[u << 1 | 1].add += tr[u].add;
        tr[u << 1].sum += tr[u].add * (tr[u << 1].r - tr[u << 1].l + 1);
        tr[u << 1 | 1].sum += tr[u].add * (tr[u << 1 | 1].r - tr[u << 1 | 1].l + 1);
        tr[u].add = 0;
    }
}

void build(int u, int l, int r) {
    if (l == r) {
        tr[u] = {l, r, 0, new_a[r]};
    } else {
        tr[u] = {l, r, 0};
        int mid = l + r >> 1;
        build(u << 1, l, mid), build(u << 1 | 1, mid + 1 , r);
        pushup(u);
    }
}

// 线段树[l,r]区间加上x
void update(int u, int l, int r, int x) {
    if (tr[u].l >= l && tr[u].r <= r) {
        tr[u].add += x;
        tr[u].sum += x * (tr[u].r - tr[u].l + 1);
    } else {
        pushdown(u);
        int mid = tr[u].l + tr[u].r >> 1;
        if (l <= mid) update(u << 1, l, r, x);
        if (r > mid) update(u << 1 | 1, l, r, x);
        pushup(u);
    }
}

// 树上u->v路径上点权都加上x
void update_path(int u, int v, int x) {
    while (top[u] != top[v]) {
        if (dep[top[u]] < dep[top[v]]) swap(u, v);
        update(1, dfn[top[u]], dfn[u], x);
        u = fa[top[u]];
    }
    if (dep[u] < dep[v]) swap(u, v);
    update(1, dfn[v], dfn[u], x);
}

// 求线段树单点查询
LL query(int u, int x) {
    if (tr[u].l == x && tr[u].r == x) {
        return tr[u].sum;
    } else {
        pushdown(u);
        int mid = tr[u].l + tr[u].r >> 1;
        if (x <= mid) return query(u << 1, x);
        else return query(u << 1 | 1, x);
    }
}

int main() {
    while (cin >> n >> m >> p) {
        for (int i = 1; i <= n; i++) {
            scanf("%d", &a[i]);
            h[i] = -1, dfn[i] = son[i] = 0;
        }
        idx = ts = 0;
        while (m--) {
            int a, b;
            scanf("%d%d", &a, &b);
            add(a, b), add(b, a);
        }
        dfs1(1, -1, 1);
        dfs2(1, 1);
        build(1, 1, n);
        while (p--) {
            char op[2]; int x, y, k;
            scanf("%s", op);
            if (*op == 'I') {
                scanf("%d%d%d", &x, &y, &k);
                update_path(x, y, k);
            } else if (*op == 'D') {
                scanf("%d%d%d", &x, &y, &k);
                update_path(x, y, -k);
            } else {
                scanf("%d", &x);
                printf("%lld\n", query(1, dfn[x]));
            }
        }
    }
    return 0;
}
```

## POJ2763 Housewife Wind 

分析：边权化点权基本套路，线段树维护区间和，查询两点距离不能算上 LCA 的点权。

```cpp
#include <iostream>
#include <algorithm>
#include <cstdio>
#include <cstring>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

const int N = 100010, M = N << 1;

int n, q, s;
int h[N], e[M], w[M], ne[M], idx;
struct Tree {
    int l, r;
    LL sum;
} tr[N << 2];
int dfn[N], ts; 
int dep[N], sz[N], top[N], fa[N], son[N];

void add(int a, int b, int c) {
    e[idx] = b, w[idx] = c, ne[idx] = h[a], h[a] = idx++;
}

void dfs1(int u, int father, int depth) {
    dep[u] = depth, fa[u] = father, sz[u] = 1;
    for (int i = h[u]; ~i; i = ne[i]) {
        int j = e[i];
        if (j == father) continue;
        dfs1(j, u, depth + 1);
        sz[u] += sz[j];
        if (sz[son[u]] < sz[j]) son[u] = j;
    }
}

void dfs2(int u, int t) {
    dfn[u] = ++ts, top[u] = t;
    if (!son[u]) return;
    dfs2(son[u], t);
    for (int i = h[u]; ~i; i = ne[i]) {
        int j = e[i];
        if (j == fa[u] || j == son[u]) continue;
        dfs2(j, j);
    }
}

void pushup(int u) {
    tr[u].sum = tr[u << 1].sum + tr[u << 1 | 1].sum;
}

void build(int u, int l, int r) {
    if (l == r) {
        tr[u].l = l, tr[u].r = r, tr[u].sum = 0;
    } else {
        tr[u].l = l, tr[u].r = r;
        int mid = l + r >> 1;
        build(u << 1, l, mid), build(u << 1 | 1, mid + 1 , r);
    }
}

// 将x位置修改成y
void update(int u, int x, int y) {
    if (tr[u].l == x && tr[u].r == x) {
        tr[u].sum = y;
    } else {
        int mid = tr[u].l + tr[u].r >> 1;
        if (x <= mid) update(u << 1, x, y);
        else update(u << 1 | 1, x, y);
        pushup(u);
    }
}

// 求线段树中[l,r]区间和
LL query(int u, int l, int r) {
    if (tr[u].l >= l && tr[u].r <= r) {
        return tr[u].sum;
    } else {
        LL res = 0;
        int mid = tr[u].l + tr[u].r >> 1;
        if (l <= mid) res += query(u << 1, l, r);
        if (r > mid) res += query(u << 1 | 1, l, r);
        return res;
    }
}

// 求树上u-v之间的路径和
LL query_path(int u, int v) {
    LL res = 0;
    while (top[u] != top[v]) {
        if (dep[top[u]] < dep[top[v]]) swap(u, v);
        res += query(1, dfn[top[u]], dfn[u]);
        u = fa[top[u]];
    }
    if (u == v) return res;
    if (dep[u] < dep[v]) swap(u, v);
    res += query(1, dfn[son[v]], dfn[u]);
    return res;
}

int main() {
    cin >> n >> q >> s;
    memset(h, -1, sizeof h);
    for (int i = 0; i < n - 1; i++) {
        int a, b, c;
        scanf("%d%d%d", &a, &b, &c);
        add(a, b, c), add(b, a, c);
    }
    dfs1(1, -1, 1);
    dfs2(1, 1);
    build(1, 1, n);
    for (int i = 0; i < idx; i += 2) {
        int u = e[i], v = e[i ^ 1];
        if (dep[u] > dep[v]) swap(u, v);
        update(1, dfn[v], w[i]);
    }
    while (q--) {
        int type, x, y;
        scanf("%d", &type);
        if (type == 0) {
            scanf("%d", &x);
            printf("%d\n", query_path(s, x));
            s = x;
        } else {
            scanf("%d%d", &x, &y);
            int v = e[2 * x - 2], u = e[2 * x - 1];
            if (dep[u] > dep[v]) swap(u, v);
            update(1, dfn[v], y);
        }
    }
    return 0;
}
```

## POJ3237 Tree

分析：树剖，边权化点权，线段树维护区间 `minv` 和 `maxv`，懒标记 `flag` 标记是否取相反数。`pushdown` 的时候只要思考一下 `minv` 和 `maxv` 的转化。

```cpp
#include <iostream>
#include <algorithm>
#include <cstdio>
#include <cstring>
#include <climits>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

const int N = 100010, M = N << 1;

int n, T;
int h[N], e[M], w[M], ne[M], idx;
struct Tree {
    int l, r;
    int flag;  // flag=1表示需要变成相反数
    int minv, maxv;
} tr[N << 2];
int dfn[N], ts; 
int dep[N], sz[N], top[N], fa[N], son[N];

void add(int a, int b, int c) {
    e[idx] = b, w[idx] = c, ne[idx] = h[a], h[a] = idx++;
}

void dfs1(int u, int father, int depth) {
    dep[u] = depth, fa[u] = father, sz[u] = 1;
    for (int i = h[u]; ~i; i = ne[i]) {
        int j = e[i];
        if (j == father) continue;
        dfs1(j, u, depth + 1);
        sz[u] += sz[j];
        if (sz[son[u]] < sz[j]) son[u] = j;
    }
}

void dfs2(int u, int t) {
    dfn[u] = ++ts, top[u] = t;
    if (!son[u]) return;
    dfs2(son[u], t);
    for (int i = h[u]; ~i; i = ne[i]) {
        int j = e[i];
        if (j == fa[u] || j == son[u]) continue;
        dfs2(j, j);
    }
}

void pushup(int u) {
    tr[u].maxv = max(tr[u << 1].maxv, tr[u << 1 | 1].maxv);
    tr[u].minv = min(tr[u << 1].minv, tr[u << 1 | 1].minv);
}

void pushdown(int u) {
    if (tr[u].flag) {
        tr[u << 1].flag ^= tr[u].flag;
        tr[u << 1 | 1].flag ^= tr[u].flag; // 这里直接写成等号调的人傻了
        int t = tr[u << 1].maxv;
        tr[u << 1].maxv = -tr[u << 1].minv, tr[u << 1].minv = -t;
        t = tr[u << 1 | 1].maxv;
        tr[u << 1 | 1].maxv = -tr[u << 1 | 1].minv, tr[u << 1 | 1].minv = -t;
        tr[u].flag = 0;
    } 
}

void build(int u, int l, int r) {
    tr[u].l = l, tr[u].r = r, tr[u].flag = 0;
    if (l == r) return;
    int mid = l + r >> 1;
    build(u << 1, l, mid), build(u << 1 | 1, mid + 1 , r);
}

void update_dot(int u, int x, int y) {
    if (tr[u].l == x && tr[u].r == x) {
        tr[u].flag = 0;
        tr[u].maxv = tr[u].minv = y;
    } else {
        pushdown(u);
        int mid = tr[u].l + tr[u].r >> 1;
        if (x <= mid) update_dot(u << 1, x, y);
        else update_dot(u << 1 | 1, x, y);
        pushup(u);
    }
}

// 将[l,r]区间都置为相反数
void update(int u, int l, int r) {
    if (tr[u].l >= l && tr[u].r <= r) {
        tr[u].flag ^= 1;
        int t = tr[u].maxv;
        tr[u].maxv = -tr[u].minv, tr[u].minv = -t;
    } else {
        pushdown(u);
        int mid = tr[u].l + tr[u].r >> 1;
        if (l <= mid) update(u << 1, l, r);
        if (r > mid) update(u << 1 | 1, l, r);
        pushup(u);
    }
}

void update_path(int u, int v) {
    while (top[u] != top[v]) {
        if (dep[top[u]] < dep[top[v]]) swap(u, v);
        update(1, dfn[top[u]], dfn[u]);
        u = fa[top[u]];
    }
    if (u == v) return;
    if (dep[u] < dep[v]) swap(u, v);
    update(1, dfn[son[v]], dfn[u]);
}

// 求线段树中[l,r]区间最大值
int query(int u, int l, int r) {
    if (tr[u].l >= l && tr[u].r <= r) {
        return tr[u].maxv;
    } else {
        pushdown(u);
        int res = INT_MIN;
        int mid = tr[u].l + tr[u].r >> 1;
        if (l <= mid) res = max(res, query(u << 1, l, r));
        if (r > mid) res = max(res, query(u << 1 | 1, l, r));
        return res;
    }
}

// 求树上u-v之间的路径最大值
int query_path(int u, int v) {
    if (u == v) return 0;
    int res = INT_MIN;
    while (top[u] != top[v]) {
        if (dep[top[u]] < dep[top[v]]) swap(u, v);
        res = max(res, query(1, dfn[top[u]], dfn[u]));
        u = fa[top[u]];
    }
    if (u == v) return res;
    if (dep[u] < dep[v]) swap(u, v);
    res = max(res, query(1, dfn[son[v]], dfn[u]));
    return res;
}

int main() {
    for (cin >> T; T--; ) {
        cin >> n;
        for (int i = 1; i <= n; i++) {
            h[i] = -1, son[i] = 0;
        }
        idx = ts = 0;
        for (int i = 0; i < n - 1; i++) {
            int a, b, c;
            scanf("%d%d%d", &a, &b, &c);
            add(a, b, c), add(b, a, c);
        }
        dfs1(1, -1, 1);
        dfs2(1, 1);
        build(1, 1, n);
        for (int i = 0; i < idx; i += 2) {
            int u = e[i], v = e[i ^ 1];
            if (dep[u] > dep[v]) swap(u, v);
            update_dot(1, dfn[v], w[i]);
        }
        char op[10]; int x, y;
        while (scanf("%s", op)) {
            if (*op == 'D') break;
            scanf("%d%d", &x, &y);
            if (*op == 'C') {
                int v = e[2 * x - 2], u = e[2 * x - 1];
                if (dep[u] > dep[v]) swap(u, v);
                update_dot(1, dfn[v], y);
            } else if (*op == 'N') {
                update_path(x, y);
            } else {
                printf("%d\n", query_path(x, y));
            }
        }
    }
    return 0;
}
```

## SPOJQTREE4 Query on a tree IV