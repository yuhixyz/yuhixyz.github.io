---
title: "Codeforces253D Table with Letters - 2"
date: 2020-06-09T07:16:45+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [前缀和, 双指针]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces253D](https://codeforces.com/problemset/problem/253/D)

<!--more-->

## 题意

给定一个 $n \times m$ 的矩阵，只包含小写英文字母，求该矩阵有多少个子矩阵满足包含不超过 $k$ 个 `a`，且四个角都是相同字母。

## 解法

> 二维前缀和 + 双指针

做法实在很妙啊。考虑如何优化枚举子矩阵的过程。

首先，用二维前缀和统计字母 `a` 出现的个数。

然后，暴力枚举子矩阵的上下边界，将它限定在 $i$ 行和 $j$ 行之间，然后定义两个列指针 $l,r$，$l$ 表示当前子矩阵的左边界（初始为 $1$ ），$r$ 从第 $1$ 列开始向右扫描。

枚举时我们固定左边界 $l\in [1,m]$（必须保证第 $l$ 列的第 $i$ 行元素和第 $j$ 行元素相同），只要被限定在 $(i,j,l,r)$（表示子矩阵的上下左右闭边界）区域内的这个子矩阵包含的字母 `a` 数量不超过 $k$，那么 $r$ 指针就不断后移（ $\text{Line34,36}$ ），最终跳出 `while` 循环时，一定有：被限定在 $(i,j,l,r-1)$ 中的子矩阵中字母 `a` 的个数不超过 $k$，且再加上第 $r$ 列一定就不满足了，就说明 $r$ 指针也没有必要再后移动了，因为在 $(i,j,l)$ 都不变的情况下，若 $r$ 右移则字母 `a` 的数量一定不会减小。

在这里，我们其实是枚举固定的左边界 $l$，然后移动 $r$ 指针，这个过程中，右边界不断变化，就得到被限定在 $(i,j,l,r'), r'\in[l+1,r-1]$ 的一组子矩阵，对于这一组子矩阵我们维护一个 $cnt[\ ]$ 数组，表示在该子矩阵的上下边界 $i,j$ 上同一列出现的相同字母对的次数。比如对于某一个 $r'$，有 $g[i][r']=g[j][r']$，则令 `cnt[g[i][r']]++`。最后当 $r$ 指针停下后，我们需要看前面扫过的这个子矩阵 $(i,j,l,r-1)$ 中字母对 $g[i][l]$ 出现的次数，如果出现了 $cnt[g[i][l]]$ 对，那么其中一对是左上角和左下角的字母对，$cnt[g[i][l]]-1$ 就是有多少不同的右边界，因此对答案的贡献就是 $cnt[g[i][l]]-1$，下一步 $l$ 右移，处理新的一组限定了上下左边界的子矩阵的贡献。

时间复杂度：$\mathcal{O}(n^2m)$ 。



## 代码

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef pair<int, int> PII;
typedef long long LL;

const int N = 410;

int n, m, k;
char g[N][N];
int s[N][N], cnt[N];
LL res;

int get(int x1, int y1, int x2, int y2) {
    return s[x2][y2] - s[x1 - 1][y2] - s[x2][y1 - 1] + s[x1 - 1][y1 - 1];
}

int main() {
    freopen("input.txt", "r", stdin); // 题目要求写文件读写
    freopen("output.txt", "w", stdout);
    cin >> n >> m >> k;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            cin >> g[i][j];
            s[i][j] = s[i - 1][j] + s[i][j - 1] - s[i - 1][j - 1] + (g[i][j] == 'a');
        }
    }
    for (int i = 1; i <= n; i++) {
        for (int j = i + 1; j <= n; j++) {
            int r = 1;
            for (int l = 1; l <= m; l++) {
                if (g[i][l] != g[j][l]) continue;
                while (r <= m && get(i, l, j, r) <= k) {
                    if (g[i][r] == g[j][r]) cnt[g[i][r]]++;
                    r++;
                }
                if (cnt[g[i][l]]) res += --cnt[g[i][l]] ;
            }
        }
    }
    cout << res << endl;
    return 0;
}
```
