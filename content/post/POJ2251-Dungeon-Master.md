---
title: "POJ2251 Dungeon Master"
date: 2019-09-14T09:01:43+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [BFS, 搜索]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[POJ2251](<http://poj.org/problem?id=2251&lang=zh-CN&change=true>)

**题目大意**：三维迷宫

<!--more-->

> $\rm BFS$

```cpp
#include <iostream>
#include <queue>
#include <cstring>

using namespace std;

const int N = 33;

struct node {
    int z, x, y;
    node() {}
    node(int zz, int xx, int yy) : z(zz), x(xx), y(yy) {}
};

int h, n, m;
char g[N][N][N];
int d[N][N][N];

int dx[6] = {-1, 0, 1, 0, 0, 0};
int dy[6] = {0, 1, 0, -1, 0, 0};
int dz[6] = {0, 0, 0, 0, 1, -1};

node st, ed;

int bfs() {
    memset(d, -1, sizeof d);
    queue<node> q;
    q.push(st);
    d[st.z][st.x][st.y] = 0;
    while (q.size()) {
        node t = q.front();
        q.pop();
        if (t.x == ed.x && t.y == ed.y && t.z == ed.z) break;
        for (int i = 0; i < 6; i++) {
            int x = t.x + dx[i], y = t.y + dy[i], z = t.z + dz[i];
            if (z >= 0 && z < h && x >= 0 && x < n && y >= 0 && y < m && d[z][x][y] == -1 && g[z][x][y] != '#') {
                d[z][x][y] = d[t.z][t.x][t.y] + 1;
                q.push(node(z, x, y));
            }
        }
    }
    return d[ed.z][ed.x][ed.y];
}

int main() {
    while (cin >> h >> n >> m, h || n || m) {
        for (int i = 0 ; i < h; i++) {
            for (int j = 0; j < n; j++) {
                for (int k = 0; k < m; k++) {
                    cin >> g[i][j][k];
                    if (g[i][j][k] == 'S') st = node(i, j, k);
                    else if (g[i][j][k] == 'E') ed = node(i, j, k);
                }
            }
        }
        int t = bfs();
        if (t == -1) puts("Trapped!");
        else printf("Escaped in %d minute(s).\n", t);
    }
    return 0;
}
```