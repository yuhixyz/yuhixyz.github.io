---
title: "HDU4436 Str2int"
date: 2020-04-08T01:02:07+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [后缀自动机, 拓扑排序, DP, 字符串]
comments: true
displayCopyright: true
toc: true
draft: false
---

原题链接：[HDU4436](http://acm.hdu.edu.cn/showproblem.php?pid=4436)

**题目大意**：多组测试数据，每组给定 $n$ 个只含有数字 $0\sim 9$ 的字符串，求数值不同（认为 $0001$ 和 $001$ 相同）的所有连续子串之和。答案 $\rm mod\ 2012$。

<!--more-->

> 后缀自动机 && 拓扑序 $\rm DP$

## 解法

吐槽：好难啊。看了一些题解大致思路会了之后，被奇奇怪怪的细节卡了好几个小时然后一天就过去误了....

首先，将所有串拼接起来，用一个大于等于10的字符分割。然后对这个新串建立 SAM。那么在所有状态中的子串一定都是本质不同的，只要将`1~sam.sz`个状态里面所有子串数值求和即可。但是直接计算过于暴力，需要优化。

对于状态 $v$，定义 $cnt[v]$ 表示从初始状态 $1$ 到达状态 $v$ 的所有合法路径个数（每条路径都表示状态 $v$ 中的一个字符串）。这里的合法路径指的是不经过分隔符的路径，且不存在前导 $0$ 的路径；定义 $sum[v]$ 表示从初始状态 $1$ 到达状态 $v$ 的所有合法路径表示的字符串的数值之和。

那么对于状态 $u \stackrel{c}{\rightarrow} v$（状态 $u$ 通过添加一个字符 $c\in[0,9]$ 转移到了状态 $v$）可得转移方程为：

<div>

$$
cnt[v] = \Sigma_{u \stackrel{c}{\rightarrow} v}cnt[u] \\ 
sum[v] = \Sigma_{u \stackrel{c}{\rightarrow}v}(sum[u] \times10 + c \times cnt[u])
$$

</div>

考虑`trans[i][j]`构成了一个 $\rm DAG$，状态之间具有拓扑关系，然后就可以按照拓扑序递推了。

~~（但为什么我用拓扑序排序，再递推出来答案他就是不对呢，我也不知道）~~今天又调了好久最后发现是没写多测？？

只好采取大部分人的做法：对于任意的 $ u\rightarrow v$，有 $maxlen[u]<maxlen[v]，$因此只要以 $maxlen[i]$ 为关键字升序排序，就是状态的拓扑序了。

下面来处理前导 $0$，如 $0001,001,01,1$ 这些，都应该视为 $1$，也就是只能被计算一次。

对于任意一个含有前导 $0$ 的子串，一定都是从初始状态 $1$（空串） 通过依次添加一个字符 $c=0$，不断转移到下一个状态，那么我们只需要跳过这些转移即可。

举个例子：初始状态（空串）通过某条路径表示字符串 $00013$。如果我们发现空串第一步就通过字符 $0$ 来转移，那么直接跳过即可。也就是说这条路径，从第一步就停止了。某一次又遇到 $0013$，这条路径同样不会去走。除非路径为 $13$。那么就将 $13$ 计入即可。这样就一跳过了所有含有前导 $0$ 的子串。代码 $\rm Line55$

## 代码 1

```cpp
#include <iostream>
#include <cstdio>
#include <cstring>
#include <algorithm>

using namespace std;

typedef long long LL;

const int N = 101010, M = N * 2, mod = 2012;

int n;
char str[N];
struct SAM {
    int maxlen[M], trans[M][12], link[M], sz, last;
    void init() {
        memset(maxlen, 0, sizeof maxlen);
        memset(trans, 0, sizeof trans);
        memset(link, 0, sizeof link);
        sz = last = 1;
    }
    void extend(int ch) {
        int cur = ++sz, p = last;
        maxlen[cur] = maxlen[p] + 1;
        for(; p && !trans[p][ch]; p = link[p]) trans[p][ch] = cur;
        if(!p) link[cur] = 1;
        else {
            int q = trans[p][ch];
            if(maxlen[p] + 1 == maxlen[q]) link[cur] = q;
            else {
                int clone = ++sz;
                maxlen[clone] = maxlen[p] + 1;
                memcpy(trans[clone], trans[q], sizeof trans[clone]);
                link[clone] = link[q];
                for(; p && trans[p][ch] == q; p = link[p]) trans[p][ch] = clone;
                link[cur] = link[q] = clone;
            }
        }
        last = cur;
    }
} sam;

int cnt[M], sum[M], q[M];

void topo_dp() {
    for (int i = 1; i <= sam.sz; i++) q[i] = i;
    sort(q + 1, q + sam.sz + 1, [](const int &a, const int &b) {
        return sam.maxlen[a] < sam.maxlen[b]; 
    });
    cnt[1] = 1;
    for (int i = 1; i <= sam.sz; i++) {
        int u = q[i];
        for (int j = 0; j < 10; j++) {
            int v = sam.trans[u][j];
            if (u == 1 && j == 0) continue; // 如果u为初始状态，则不能通过加上j=0来转移到v（这样产生了前导0） 
            if (!v) continue;
            (cnt[v] += cnt[u]) %= mod;
            (sum[v] += sum[u] * 10 + j * cnt[u]) %= mod;
        }
    }
    int ans = 0;
    for (int i = 1; i <= sam.sz; i++) {
        (ans += sum[i]) %= mod;
    }
    printf("%d\n", ans);
}

int main() {
    while (cin >> n) {
        sam.init();
        memset(cnt, 0, sizeof cnt);
        memset(sum, 0, sizeof sum);
        while (n--) {
            scanf("%s", str);
            for (int i = 0; str[i]; i++) sam.extend(str[i] - '0');
            sam.extend(10);
        }
        topo_dp();
    }
    return 0;
}
```

## 代码 2

```cpp
#include <iostream>
#include <cstdio>
#include <cstring>
#include <algorithm>

using namespace std;

typedef long long LL;

const int N = 101010, M = N * 2, mod = 2012;

int n;
char str[N];
struct SAM {
    int maxlen[M], trans[M][12], link[M], sz, last;
    void init() {
        memset(maxlen, 0, sizeof maxlen);
        memset(trans, 0, sizeof trans);
        memset(link, 0, sizeof link);
        sz = last = 1;
    }
    void extend(int ch) {
        int cur = ++sz, p = last;
        maxlen[cur] = maxlen[p] + 1;
        for(; p && !trans[p][ch]; p = link[p]) trans[p][ch] = cur;
        if(!p) link[cur] = 1;
        else {
            int q = trans[p][ch];
            if(maxlen[p] + 1 == maxlen[q]) link[cur] = q;
            else {
                int clone = ++sz;
                maxlen[clone] = maxlen[p] + 1;
                memcpy(trans[clone], trans[q], sizeof trans[clone]);
                link[clone] = link[q];
                for(; p && trans[p][ch] == q; p = link[p]) trans[p][ch] = clone;
                link[cur] = link[q] = clone;
            }
        }
        last = cur;
    }
} sam;

int din[M], q[M], cnt[M], sum[M];
void topo_dp() {
    int hh = 0, tt = -1;
    for (int i = 1; i <= sam.sz; i++) {
        for (int j = 0; j <= 10; j++)
            din[sam.trans[i][j]]++;
    }
    for (int i = 1; i <= sam.sz; i++) {
        if (!din[i]) q[++tt] = i;
    }
    while (hh <= tt) {
        int u = q[hh++];
        for (int i = 0; i <= 10; i++) {
            int v = sam.trans[u][i];
            if (!v) continue;
            if (--din[v] == 0) q[++tt] = v;
        }
    }
    cnt[1] = 1;
    int ans = 0;
    for (int i = 0; i < sam.sz; i++) {
        int u = q[i];
        for (int j = 0; j < 10; j++) {
            int v = sam.trans[u][j];
            if (u == 1 && j == 0) continue;
            if (!v) continue;
            (cnt[v] += cnt[u]) %= mod;
            (sum[v] += sum[u] * 10 + j * cnt[u]) %= mod;
        }
        (ans += sum[u]) %= mod;
    }
    printf("%d\n", ans);
}

int main() {
    while (cin >> n) {
        sam.init();
        memset(cnt, 0, sizeof cnt);
        memset(sum, 0, sizeof sum);
        while (n--) {
            scanf("%s", str);
            for (int i = 0; str[i]; i++) sam.extend(str[i] - '0');
            sam.extend(10);
        }
        topo_dp();
    }
    return 0;
}
```



## 参考资料

1. 陈峰老师视频：[算法竞赛入门经典-训练指南-ch03-后缀自动机的典型应用](https://www.bilibili.com/video/BV1xJ411s7Fu)

