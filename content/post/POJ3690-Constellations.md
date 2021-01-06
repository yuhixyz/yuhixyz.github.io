---
title: "POJ3690 Constellations"
date: 2020-03-10T22:17:34+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [字符串哈希, STL]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[POJ3690](http://poj.org/problem?id=3690)

**题目大意**：给定一个 $n$ 行 $m$ 列的矩阵，再给出 $q$ 个 $a$ 行 $b$ 列的矩阵，求 $q$ 个矩阵中有几个在原矩阵中出现过。

<!--more-->

> 字符串哈希

吐槽：一直TLE，各种歪歪优化，发现都会T，似乎各处题解都是用了`multiset`，真是做过再也不想做的题。

## 暴力解法

比较直观的做法，就是预处理出原矩阵的哈希值，暴力枚举 $a\times b$ 的子矩阵去匹配...复杂度爆炸。二维哈希的子矩阵哈希公式长得就像是带权的二维前缀和，这里就当存个二维哈希板子吧。

{{% admonition note 暴力做法 "true" %}}
```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

typedef unsigned long long ULL;

const int N = 1010, M = N * N;
const int row = 131, col = 13331;

int n, m, T, P, Q;
char str[N][N];
ULL h[N][N], h2[N][N];
ULL p1[M], p2[M];

void init(char s[][N], ULL h[][N], int n, int m) {
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            h[i][j] = h[i - 1][j] * row + h[i][j - 1] * col - h[i - 1][j - 1] * row * col + s[i][j];
        }
    }
}

ULL get(ULL h[][N], int x1, int y1, int x2, int y2) {
    return h[x2][y2] - h[x1 - 1][y2] * p1[x2 - x1 + 1] - h[x2][y1 - 1] * p2[y2 - y1 + 1]
                     + h[x1 - 1][y1 - 1] * p1[x2 - x1 + 1] * p2[y2 - y1 + 1];
}

int main() {
    p1[0] = p2[0] = 1;
    for (int i = 1; i <= 1e6; i++) p1[i] = p1[i - 1] * row, p2[i] = p2[i - 1] * col;
    while (cin >> n >> m >> T >> P >> Q, n) {
        int Case = 0;
        for (int i = 1; i <= n; i++) scanf("%s", str[i] + 1);
        init(str, h, n, m);
        int ans = 0;
        while (T--) {
            for (int i = 1; i <= P; i++) scanf("%s", str[i] + 1);
            init(str, h2, P, Q);
            bool flag = false;
            for (int i = 1; i <= n - P + 1; i++) {
                for (int j = 1; j <= m - Q + 1; j++) {
                    if (get(h, i, j, i + P - 1, j + Q - 1) == h2[P][Q]) {
                        flag = true;
                        break;
                    }
                }
                if (flag) break;
            }
            if (flag) ans++;
        }
        printf("Case %d: %d\n", ++Case, ans);
    }
    return 0;
}

```
{{% /admonition %}}

## 优化思路

写在前面：下面的哈希只用了一个进制 $base$，把一个矩阵看成一个 $base$ 进制的数。

{{% admonition note 高低位的顺序如下 "true" "open" %}}
{{< img src="POJ3690_example.png" >}}
{{% /admonition %}}

直接说做法吧。对于整个原矩阵而言，我们并不需要处理出原矩阵整个的哈希值，因为我们只需要其中 $a \times b$ 的子矩阵，共有 $(n-a+1)(m-b+1)$ 个。

如何快速的得到所有 $a \times b$ 的子矩阵的哈希值呢，可以这样做：我们先预处理出每一行前缀的哈希值 $h[i][j]$：表示第 $i$ 行的前缀长度为 $j$ 的哈希值。那么第 $i$ 行 $[l,r]$ 区间的哈希值就是：
$$
h[i][r] - h[i][l - 1] \times p[r-l+1]
$$
为了叙述方便，写成一个函数，那么上式就可以表示为`get(h[i], l, r)`

```cpp
ULL get(ULL hs[], int l, int r) {
    return hs[r] - hs[l - 1] * p[r - l + 1];
}
```

首先我们通过循环得到最左上角的一个 $a \times b$ 的子矩阵的哈希值，然后我们考虑 $a\times b$ 的子矩阵相互之间的关系，如下图所示：

{{% admonition note 递推来求所有axb的矩形哈希值 "true" "open" %}}
{{< img src="POJ3690_hash.png" title="对应代码39~45行">}}
{{% /admonition %}}

**关键**，另一个优化是用`multiset`：将所有需要查询的矩阵的哈希值，先插入`multiset`，再枚举所有 $a\times b$ 的子矩阵的哈希值，到集合中删除，那么集合大小的变化，就是原矩阵中存在的需要查询的子矩阵个数。由于本题并不是一个在线处理的问题，因此可以使用这种先把查询插入集合，再枚举所有情况，再在集合中删除与查询相等的元素，通过集合大小的变化，来判断有几个给定的子矩阵出现在原矩阵中。

原先我的做法是，将原矩阵中所有 $a\times b$ 的子矩阵的哈希值全部插入一个`set`，然后对题目给出的子矩阵求对应哈希值，到集合中去查找。这个只和上面思路的顺序不同，但复杂度高了很多（讲道理要是POJ给用`unordered_set`估计就水过去了）。


## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <set>

using namespace std;

typedef unsigned long long ULL;

const int N = 1010, M = N * N, base = 131;

int n, m, a, b, q, Case;
ULL h[N][N], p[M];
char str[N];

ULL get(ULL hs[], int l, int r) {
    return hs[r] - hs[l - 1] * p[r - l + 1];
}

int main() {
    p[0] = 1;
    for (int i = 1; i <= 1e6; i++) p[i] = p[i - 1] * base;
    while (cin >> n >> m >> q >> a >> b, n) {
        for (int i = 1; i <= n; i++) {
            scanf("%s", str + 1);
            for (int j = 1; j <= m; j++) h[i][j] = h[i][j - 1] * base + str[j];
        }
        multiset<ULL> S;
        int tot = q;
        while (q--) {
            ULL s = 0;
            for (int i = 0; i < a; i++) {
                scanf("%s", str + 1);
                for (int j = 1; j <= b; j++) s = s * base + str[j];
            }
            S.insert(s);
        }
        // 求原矩阵所有a*b的子矩阵的哈希值
        // 先枚举列，再枚举行（即枚举右下角的位置）
        for (int j = b; j <= m; j++) {
            ULL s = 0;
            for (int i = 1; i <= n; i++) {
                s = s * p[b] + get(h[i], j - b + 1, j); // 向高位移动一位，再加上第i行的哈希值 
                if (i - a + 1 > 1) { // i-a+1为上边界，如果大于1了说明需要减去第i-a行的哈希值
                    s -= get(h[i - a], j - b + 1, j) * p[a * b];
                }
                if (i - a + 1 >= 1) { // 说明恰好构成一个a*b的子矩阵，将其哈希值从集合中删去
                    S.erase(s);
                }
            }
        }
        printf("Case %d: %d\n", ++Case, tot - (int)S.size());
    }
    return 0;
}
```

## 参考资料

1. [LuYouQi233的博客](https://www.cnblogs.com/luyouqi233/p/8010951.html)