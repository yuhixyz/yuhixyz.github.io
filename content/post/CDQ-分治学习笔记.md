---
title: "CDQ 分治学习笔记"
date: 2020-07-15T19:24:23+08:00
weight: 
description:
tags: []
categories: [ACM, Notes]
series: []
algorithms: [CDQ 分治]
comments: true
displayCopyright: true
toc: true
draft: true
---

> 学习笔记

咕咕咕。

<!--more-->

## 算法思想

CDQ（陈丹琦）分治，基于时间轴的分治算法。


## 例题

### 陌上花开（三维偏序）



```cpp
#include <bits/stdc++.h>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

const int N = 100010, M = N << 1;

int n, k;
struct Node {
    int a, b, c, f, cnt;
    bool operator == (const Node &W) const {
        return a == W.a && b == W.b && c == W.c;
    }
} node[N], p[N];
int tot;
int ans[N];
int c[M];

inline int lowbit(int x) {
    return x & -x;
}

inline void add(int x, int y) {
    for (int i = x; i <= k; i += lowbit(i)) c[i] += y;
}

inline int sum(int x) {
    int res = 0;
    for (int i = x; i; i -= lowbit(i)) res += c[i];
    return res;
}

void solve(int l, int r) {
    if (l == r) return;
    int mid = l + r >> 1;
    solve(l, mid), solve(mid + 1, r);
    // 按照第二维b从小到大排序
    auto cmpb = [](const Node &x, const Node &y) {
        if (x.b != y.b) return x.b < y.b;
        else if (x.c != y.c) return x.c < y.c;
        return x.a < y.a;
    };
    sort(p + l, p + mid + 1, cmpb);
    sort(p + mid + 1, p + r + 1, cmpb);
    // 双指针+树状数组统计答案，对于每一个j找到所有i，满足a[i]<=a[j]且b[i]<=b[j]，将这些节点i的c值插入树状数组
    // memset(c, 0, sizeof c); // TLE
    int i = l, j = mid + 1;
    while (j <= r) {
        while (i <= mid && p[i].b <= p[j].b) {
            add(p[i].c, p[i].cnt);
            i++;
        }
        p[j].f += sum(p[j].c);
        j++;
    }
    // 直接清空用过的就行了
    for (int t = l; t < i; t++) add(p[t].c, -p[t].cnt);
}

int main() {
    cin >> n >> k;
    for (int i = 0; i < n; i++) {
        int a, b, c;
        scanf("%d%d%d", &a, &b, &c);
        node[i] = {a, b, c};
    }
    // 按照第一维a从小到大排序
    sort(node, node + n, [](const Node &x, const Node &y) {
        if (x.a != y.a) return x.a < y.a;
        else if (x.b != y.b) return x.b < y.b;
        return x.c < y.c;
    });
    // 去重后得到新的p结构体
    for (int i = 0; i < n; i++) {
        int j = i;
        while (j + 1 < n && node[j + 1] == node[j]) j++;
        p[tot++] = {node[i].a, node[i].b, node[i].c, 0, j - i + 1};
        i = j;
    }
    // CDQ分治
    solve(0, tot - 1);
    // 统计答案
    for (int i = 0; i < tot; i++) ans[p[i].f + p[i].cnt - 1] += p[i].cnt;
    for (int i = 0; i < n; i++) printf("%d\n", ans[i]);
    puts("");
    return 0;
}
```

归并可以把 `sort` 优化掉。

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

const int N = 100010, M = N << 1;

int n, k;
struct Node {
    int a, b, c, f, cnt;
    bool operator == (const Node &W) const {
        return a == W.a && b == W.b && c == W.c;
    }
} node[N], p[N], tmp[N];
int tot;
int ans[N];
int c[M];

inline int lowbit(int x) {
    return x & -x;
}

inline void add(int x, int y) {
    for (int i = x; i <= k; i += lowbit(i)) c[i] += y;
}

inline int sum(int x) {
    int res = 0;
    for (int i = x; i; i -= lowbit(i)) res += c[i];
    return res;
}

void solve(int l, int r) {
    if (l == r) return;
    int mid = l + r >> 1;
    solve(l, mid), solve(mid + 1, r);
    // 归并排序+树状数组统计答案，对于每一个j找到所有i，满足a[i]<=a[j]且b[i]<=b[j]，将这些节点i的c值插入树状数组
    int k = 0, i = l, j = mid + 1;
    while (i <= mid && j <= r) {
        if (p[i].b <= p[j].b) {
            add(p[i].c, p[i].cnt);
            tmp[k++] = p[i++];
        } else {
            p[j].f += sum(p[j].c);
            tmp[k++] = p[j++];
        }
    }
    while (i <= mid) {
        add(p[i].c, p[i].cnt);
        tmp[k++] = p[i++];
    }
    while (j <= r) {
        p[j].f += sum(p[j].c);
        tmp[k++] = p[j++];
    }
    // 清空树状数组
    for (int t = l; t < i; t++) add(p[t].c, -p[t].cnt);
    // 归并结束时把对于第二维b有序的tmp复制到p中
    for (int i = l, j = 0; i <= r; i++, j++) p[i] = tmp[j];
}

int main() {
    cin >> n >> k;
    for (int i = 0; i < n; i++) {
        int a, b, c;
        scanf("%d%d%d", &a, &b, &c);
        node[i] = {a, b, c};
    }
    // 按照第一维a从小到大排序
    sort(node, node + n, [](const Node &x, const Node &y) {
        if (x.a != y.a) return x.a < y.a;
        else if (x.b != y.b) return x.b < y.b;
        return x.c < y.c;
    });
    // 去重后得到新的p结构体
    for (int i = 0; i < n; i++) {
        int j = i;
        while (j + 1 < n && node[j + 1] == node[j]) j++;
        p[tot++] = {node[i].a, node[i].b, node[i].c, 0, j - i + 1};
        i = j;
    }
    // CDQ分治
    solve(0, tot - 1);
    // 统计答案
    for (int i = 0; i < tot; i++) ans[p[i].f + p[i].cnt - 1] += p[i].cnt;
    for (int i = 0; i < n; i++) printf("%d\n", ans[i]);
    puts("");
    return 0;
}
```


### 学习资料

1. [肖然大佬的视频讲解](https://www.bilibili.com/video/BV1mC4y1s7ic?from=search&seid=15145207713611042520)

2. [OI-Wiki](https://oi-wiki.org/misc/cdq-divide/)





