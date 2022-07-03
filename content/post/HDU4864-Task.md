---
title: "HDU4864 Task"
date: 2020-05-20T13:55:48+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [贪心, 二分图匹配]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[HDU4864](http://acm.hdu.edu.cn/showproblem.php?pid=4864)

<!--more-->

**题目大意**：有 $m$ 个任务，第 $i$ 个任务的难度级别为 $y_i$，完成任务所需时间为 $x_i$ 。如果完成此任务，将获得 $500x_i + 2y_i$ 的收入。现有 $n$ 台机器，每台机器都有最长工作时间 $x_i$ 和级别 $y_i$ 。其中 $1≤N,M≤100000 ,0<x_i<1440,0≤y_i≤100$ 。

每台机器一天内只能完成一项任务。每个任务只能由一台机器完成。

求最大利润以及完成的任务数。

> 带点权的二分图匹配，贪心

## 解法

带点权的二分图匹配问题，考虑贪心。由数据范围可知，$x_i$ 取最小 $1$，那么贡献为 $500$，$y_i$ 取最大 $100$，贡献只有 $200$，因此，$x_i$ 只要不同，那么必然是 $x_i$ 较大的任务贡献更大，在 $x_i$ 相同的条件下，才会考虑 $y_i$ 。因此，我们以 $x_i$ 为第一关键字排序，再以 $y_i$ 为第二关键字排序。

基于贪心，我们优先考虑 $x_i$ 大的任务，然后在所有最长工作时长大于等于 $x_i$ 的机器中，选择级别大于等于 $y_i$ 的最小的机器。

代码解释：按 $x_i$ 从大到小枚举所有任务，用一个 `multiset` 来维护任务 $i$ 的候选机器的级别，首先将所有最长工作时长大于等于 $x_i$ 的机器的..级别..加入集合，然后，二分查找，集合中大于等于 $y_i$ 的最小值，如果存在这个值，那么就把任务 $i$ 和该机器匹配。然后从集合中删去这个机器，考虑下一个任务的匹配。

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

const int N = 100100;

int n, m;
PII task[N], machine[N];
LL cnt, res;

int main() {
    while (cin >> n >> m) {
        for (int i = 0; i < n; i++) {
            scanf("%d%d", &machine[i].first, &machine[i].second);
        }
        for (int i = 0; i < m; i++) {
            scanf("%d%d", &task[i].first, &task[i].second);
        }
        sort(machine, machine + n);
        sort(task, task + m);
        cnt = res = 0;
        multiset<int> S;
        for (int i = m - 1, j = n - 1; i >= 0; i--) {
            while (j >= 0 && machine[j].first >= task[i].first) S.insert(machine[j--].second);
            auto it = S.lower_bound(task[i].second);
            if (it != S.end()) {
                S.erase(it);
                cnt++;
                res += 1ll * task[i].first * 500 + task[i].second * 2;
            }
        }
        cout << cnt << " " << res << endl;
    }
    return 0;
}
```