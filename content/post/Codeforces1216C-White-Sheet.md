---
title: "Codeforces1216C White Sheet"
date: 2019-09-25T23:56:36+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [几何]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[Codeforces1216C](https://codeforces.com/problemset/problem/1216/C)

**题目大意**：给定 $ 2 $ 个黑色 $ 1 $ 个白色的长方形的对角坐标，白色是否被完全覆盖。

<!--more-->

> 平面几何

计算黑 $1$ 与白色的相交矩形 $ M_1 $，面积 $ S_1 $

计算黑 $ 2 $ 与白色的相交矩形 $ M_2 $，面积 $ S_2 $

计算 $ M_1 $ 与 $ M_2 $ 相交面积 $ S_3 $

如果 $S_{\rm white}$ $ > $ $S_1  + S_2 - S_3$，说明没遮住

```cpp
#include <iostream>
#include <algorithm>

#define x first
#define y second

using namespace std;

typedef pair<int, int> PII;
typedef pair<PII, PII> PIIS;
typedef long long LL;

LL calc(PII a, PII b, PII c, PII d, PII &e, PII &f) {
    e.x = max(a.x, c.x);
    e.y = max(a.y, c.y);
    f.x = min(b.x, d.x);
    f.y = min(b.y, d.y);
    if (e.x > f.x || e.y > f.y) {
        e.x = e.y = f.x = f.y = 0;
        return 0;
    }
    return (LL)(f.x - e.x) * (f.y - e.y);
}

int main() {
    PII wl, wr, al, ar, bl, br;
    cin >> wl.x >> wl.y >> wr.x >> wr.y;
    cin >> al.x >> al.y >> ar.x >> ar.y;
    cin >> bl.x >> bl.y >> br.x >> br.y;
    PIIS M1, M2, M3;
    LL S1 = calc(wl, wr, al, ar, M1.x, M1.y);
    LL S2 = calc(wl, wr, bl, br, M2.x, M2.y);
    LL S3 = calc(M1.x, M1.y, M2.x, M2.y, M3.x, M3.y);
    LL S = (LL)(wr.x - wl.x) * (wr.y - wl.y); 
    if (S > S1 + S2 - S3) puts("YES");
    else puts("NO");
    return 0;
}
```