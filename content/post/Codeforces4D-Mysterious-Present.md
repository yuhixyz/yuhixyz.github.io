---
title: "Codeforces4D Mysterious Present"
date: 2019-10-12T09:10:16+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DP, LIS]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces4D](https://codeforces.com/problemset/problem/4/D)

**题目大意**：有 $n$ 个信封，一张贺卡，都有长宽两种属性，根据尺寸将贺卡装进信封，大信封可以装小信封，求礼物外面最多有几层信封。

<!--more-->

> 排序 + 双关键字 LIS

先对`{w, h}`升序排序，再求双关键字最长严格上升子序列，注意子序列首个信封必须比`card`要大。

需要记录方案，结构体加一维，存编号，即`{w, h, pos}`

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

const int N = 5010;

int n;
int f[N];
int pre[N];
vector<int> path;

struct node {
    int w, h, pos;
    bool operator < (const node &W) const {
        if (w != W.w) return w < W.w;
        else return h < W.h;
    }
} a[N];

int main() {
    cin >> n;
    for (int i = 0; i <= n; i++) {
        cin >> a[i].w >> a[i].h;
        a[i].pos = i;
    }
    sort(a + 1, a + n + 1);
    int res = 0, des = 0;
    for (int i = 1; i <= n; i++) {   
        if (a[i].w <= a[0].w || a[i].h <= a[0].h) continue; 
        f[i] = 1;
        for (int j = 1; j < i; j++) {
            if (a[j].h < a[i].h && a[j].w < a[i].w) {
                if (f[i] < f[j] + 1) {
                    f[i] = f[j] + 1;
                    pre[i] = j;
                }
            }
        }
        if (res < f[i]) {
            res = f[i];
            des = i;
        }
    }
    cout << res << endl; 
    for (int i = des; i; i = pre[i]) path.push_back(a[i].pos);
    for (int i = path.size() - 1; i >= 0; i--) printf("%d ", path[i]);
    return 0;
}
```