---
title: "POJ1204 Word Puzzles"
date: 2020-03-22T15:36:53+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [AC自动机, 搜索]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[POJ1204](http://poj.org/problem?id=1204)

**题目大意**：给定一个 $n \times m$ 的字符矩阵，再给定 $k$ 组查询，每次询问给定一个字符串，求这个字符串在字符矩阵中出现的起始位置，以及字符串的方向。方向：以顺时针定义 A ~ H 共 8 个方向。（这个字符串甚至可以是斜着的）。

<!--more-->

> ( $\rm AC$ 自动机 || $\rm Trie$ 图 ) && 搜索

## 解法

吐槽：题面吓人其实不难。

思路：将所有查询的字符串，建立 $\rm AC$ 自动机没跑了。由于有八个方向，我们需要从将原来的矩阵中找出所有不同方向的所有可能的不同的母串。参考了一些题解比如[_TCgogogo_的博客](https://blog.csdn.net/Tc_To_Top/article/details/44106923)，都用到技巧：只枚举矩阵四周边上的所有点，以这些点，朝 $8$ 个方向扩展，那么每一种扩展方向的路径就构成了一个母串。对于所有这样的母串都要去匹配，如果能匹配成功，就找到了一种查询对应的答案。

其他技巧：将所有查询插入 $\rm Trie$ 树的时候，如果找到一组答案，要求解其起始位置，仍需要倒序递推；如果逆序插入，那么找到的匹配的结尾位置其实就是原串的起始位置。另一个注意点：插入 $\rm Trie$ 树时，需要记录其对应的查询编号。

求解答案的核心代码在 $\rm Line62 \sim 77$。

## 代码

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <map>

#define x first
#define y second

using namespace std;

typedef pair<int, int> PII; 

const int N = 1000010, M = 1010;

int n, m, k;
int son[N][26], cnt[N], idx;
int ne[N];
char g[M][M], str[M];
int q[N]; 	// 队列 
int id[N];	// id[p]表示以p结尾(由于反过来存，因此实际表示的是开头)对应的查询编号 
int dir[M]; // 存每个询问的方向
PII pos[M]; // 存每个询问的坐标

int dx[8] = {-1, -1, 0, 1, 1, 1, 0, -1};
int dy[8] = {0, 1, 1, 1, 0, -1, -1, -1};
int opposite[8] = {4, 5, 6, 7, 0, 1, 2, 3}; // 存每个方向的相反方向

void insert(int query_id, char str[]) {
	int p = 0;
	int len = strlen(str);
	for (int i = len - 1; i >= 0; i--) {
		int u = str[i] - 'A';
		if (!son[p][u]) son[p][u] = ++idx;
		p = son[p][u];
	}	
	cnt[p]++;
	id[p] = query_id; // 以p结尾的单词对应的询问编号
}

void build() {
    int hh = 0, tt = -1;
    for (int i = 0; i < 26; i++) {
        if (son[0][i]) q[++tt] = son[0][i];
    }
    while (hh <= tt) {
        int t = q[hh++];
        for (int i = 0; i < 26; i++) {
            if (!son[t][i]) son[t][i] = son[ne[t]][i];
            else {
                ne[son[t][i]] = son[ne[t]][i];
                q[++tt] = son[t][i];
            }
        }
    }
}

// 判断是否越界 
bool check(int x, int y) {
	return x >= 0 && x < n && y >= 0 && y < m;
}

void search(int sx, int sy, int t) { // 从(sx, sy)向t方向搜
	for (int si = sx, sj = sy, j = 0; check(si, sj); si += dx[t], sj += dy[t]) {
		int u = g[si][sj] - 'A';
		j = son[j][u];
		int k = j;
		while (k) {
			if (cnt[k]) {
				int query_id = id[k];
				pos[query_id] = make_pair(si, sj);
				dir[query_id] = opposite[t];
			}
			cnt[k] = 0;
			k = ne[k];
		}
	}
}

int main() {
	scanf("%d%d%d", &n, &m, &k);
	for (int i = 0; i < n; i++) scanf("%s", g[i]);
	for (int i = 0; i < k; i++) {
		scanf("%s", str);
		insert(i, str);
	}
	build(); // 建立AC自动机
	// 枚举四周边上的每一个字母，分别搜索8个方向
	// 先枚举左右两侧的 即第0列和第m-1列的所有格子 
	for (int r = 0; r < n; r++) {
		// 搜(r, 0)和(r, m - 1)
		for (int j = 0; j < 8; j++) {
			search(r, 0, j), search(r, m - 1, j);
		}
	}
	// 再枚举上下两行 即第0行和第n-1行的所有格子 
	for (int c = 0; c < m; c++) {
		for (int j = 0; j < 8; j++) {
			search(0, c, j), search(n - 1, c, j);
		}
	}
	// 给八个方向对应字母
	map<int, char> mp;
	for (int i = 0; i < 8; i++) mp[i] = 'A' + i;
	// 输出每个询问对应的答案
	for (int i = 0; i < k; i++) printf("%d %d %c\n", pos[i].x, pos[i].y, mp[dir[i]]);
	return 0;
}
```

### 参考资料

1. [_TCgogogo_的博客](https://blog.csdn.net/Tc_To_Top/article/details/44106923)