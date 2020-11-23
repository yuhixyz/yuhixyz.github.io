---
title: "Codeforces140C New Year Snowmen"
date: 2020-06-09T03:31:24+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [贪心]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces140C](https://codeforces.com/problemset/problem/140/C)

<!--more-->

## 题意

给定 $n$ 个数，三个一组，要求组内数字互不相同，求最多能分成几组。

## 解法

> 贪心 + 优先队列

基于贪心，我们不希望在分完组后，留下大量相同的数字，因为他们将无法组队，因此对于同一个数字，如果出现次数较多，应该先进行分组。所以做法很简单，用 `unordered_map` 统计一下每个数字出现的次数，丢到优先队列里面，每次选择出现次数最多的 $3$ 个数字为 $1$ 组即可。

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

int n;
struct Node {
    int r1, r2, r3;
};
vector<Node> res;
unordered_map<int, int> mp; 
priority_queue<PII> heap;

int main() {
    cin >> n;
    for (int i = 0; i < n; i++) {
        int x; scanf("%d", &x);
        mp[x]++;
    }
    for (auto item : mp) heap.push({item.second, item.first});
    int cnt = 0;
    while (heap.size() >= 3) {
        auto a = heap.top(); heap.pop();
        auto b = heap.top(); heap.pop();
        auto c = heap.top(); heap.pop();
        int ra = a.second, rb = b.second, rc = c.second;
        int t[3] = {ra, rb, rc};
        sort(t, t + 3);
        res.push_back({t[2], t[1], t[0]});
        cnt++;
        if (--a.first) heap.push(a);
        if (--b.first) heap.push(b);
        if (--c.first) heap.push(c);
    }
    cout << cnt << endl;
    for (auto x : res) printf("%d %d %d\n", x.r1, x.r2, x.r3);
    return 0;
}
```
