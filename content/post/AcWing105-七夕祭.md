---
title: "AcWing105 七夕祭"
date: 2020-03-06T20:53:12+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [贪心, 中位数]
comments: true
displayCopyright: true
toc: true
draft: true
---

原题链接：[AcWing105](https://www.acwing.com/problem/content/107/)

<!--more-->

**题目描述**：矩形的祭典会场由 $N$ 排 $M$ 列共计 $N×M$ 个摊点组成。

虽然摊点种类繁多，不过cl只对其中的一部分摊点感兴趣。

Vani预先联系了七夕祭的负责人zhq，希望能够通过恰当地布置会场，使得各行中cl感兴趣的摊点数一样多，并且各列中cl感兴趣的摊点数也一样多。

不过zhq告诉Vani，摊点已经随意布置完毕了，如果想满足cl的要求，唯一的调整方式就是交换两个相邻的摊点。

两个摊点相邻，当且仅当他们处在同一行或者同一列的相邻位置上。

由于zhq率领的TYVJ开发小组成功地扭曲了空间，每一行或每一列的第一个位置和最后一个位置也算作相邻。

现在Vani想知道他的两个要求最多能满足多少个。

在此前提下，至少需要交换多少次摊点。

**输入格式**

第一行包含三个整数 $N$ 和 $M$ 和 $T$，$T$ 表示cl对多少个摊点感兴趣。

接下来 $T$ 行，每行两个整数 $x,y$，表示cl对处在第 $x$ 行第 $y$ 列的摊点感兴趣。

**输出格式**

首先输出一个字符串。

如果能满足Vani的全部两个要求，输出`both`；

如果通过调整只能使得各行中cl感兴趣的摊点数一样多，输出`row`；

如果只能使各列中cl感兴趣的摊点数一样多，输出`column`；

如果均不能满足，输出`impossible`。

如果输出的字符串不是`impossible`， 接下来输出最小交换次数，与字符串之间用一个空格隔开。

**数据范围**

$1≤N,M≤100000$,
$0≤T≤min(N∗M,100000)$,
$1≤x≤N$,
$1≤y≤M$

**输入样例**

```c
2 3 4
1 3
2 1
2 2
2 3
```

**输出样例**

```c
row 1
```

## 解法

由于行列互不影响，因此可以分别考虑这两个一维的问题。即环形均分纸牌问题，相关题目：[AcWing122糖果传递](https://www.acwing.com/problem/content/124/)，[AcWing104货仓选址](https://www.acwing.com/problem/content/106/)。

{{% admonition note 环形均分纸牌详解 "true" "open" %}}
{{< img src="AcWing105.png" >}}
{{% /admonition %}}

## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;

const int N = 100010;

int n, m, T;
int row[N], col[N];
LL s[N];
int r, c, rx, cx;

LL solve(int a[], int n, int x) {
    for (int i = 1; i < n; i++) s[i] = s[i - 1] + a[i] - x;
    sort(s, s + n);
    LL res = 0;
    for (int i = 0; i < n / 2; i++) res += abs(s[i] - s[n - i - 1]);
    return res;
}

int main() {
    cin >> n >> m >> T;
    r = T % n, rx = T / n;
    c = T % m, cx = T / m;
    while (T--) {
        int x, y;
        scanf("%d%d", &x, &y);
        row[x]++, col[y]++;
    }
    if (r && c) puts("impossible");
    else if (!r && !c) printf("both %lld\n", solve(row, n, rx) + solve(col, m, cx));
    else if (!r) printf("row %lld\n", solve(row, n, rx));
    else if (!c) printf("column %lld\n", solve(col, m, cx));
    return 0;
}
```

