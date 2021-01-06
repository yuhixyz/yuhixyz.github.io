---
title: "Codeforces961C Chessboard"
date: 2019-11-02T10:59:07+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DFS, 搜索]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[Codeforces961C](http://codeforces.com/contest/961/problem/C )

**题目大意**：一块 $01$ 棋盘被均分成 $4$ 个正方形，操作手段：每次可将 $0$ 变成 $1$，或者 $1$ 变成 $0$。求将四块棋盘平移组合后，变成一块 $01$ 间隔分布的棋盘，最少操作次数。

<!--more-->

> 搜索

最终的棋盘形式虽然有 $2$ 种，但将最终的棋盘 $4$ 分后，（无论哪种形式）只会得到 $2$ 种（每种 $2$ 块）不同的小正方形，因此只需要枚举 $C^2_4$ 种， 每种里面计算各小正方形到目标状态的步数之和。

代码解释：

`f[][]`, `!f[][]`存的是$4$分后的两种目标状态，我们将需要操作的$4$个小正方形，选$2$个变成`f[][]`, 选另外$2$个变成`!f[][]`即可，

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 110;

int n;
char w[4][N][N];
int f[N][N];
bool path[4];
int ans = 2e9;

// 正在选第u个位置，已经选好了k个数
void dfs(int u, int k) {   
    if (!u) memset(path, false, sizeof path);
    if (u == 4) {
        if (k == 2) {   
            int res = 0;
            // 此时4选2，成功，规定每次path=1的位置用f，否则用!f
            for (int i = 0; i < 4; i++) {
                if (path[i]) {
                    // 第i层，变换成f步数
                    for (int j = 0; j < n; j++)
                        for (int k = 0; k < n; k++)
                            res += (w[i][j][k] - '0') ^ f[j][k];
                } else {   // 变换成!f步数
                    for (int j = 0; j < n; j++)
                        for (int k = 0; k < n; k++)
                            res += (w[i][j][k] - '0') ^ !f[j][k];
                }
            }
            ans = min(ans, res);
        }
        return;
    }
    path[u] = true;
    dfs(u + 1, k + 1);
    path[u] = false;
    dfs(u + 1, k);
}

int main() {
    cin >> n;
    for (int i = 0; i < 4; i++) {
        for (int j = 0; j < n; j++)
            scanf("%s", w[i][j]);
    }
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
                f[i][j] = i + j & 1;  
    }
    dfs(0, 0); // 4选2: f, !f
    printf("%d\n", ans);
    return 0;
}
```