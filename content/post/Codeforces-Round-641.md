---
title: "Codeforces Round #641 (Div. 2)"
date: 2020-05-13T15:44:33+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DP, 数论, GCD]
comments: true
displayCopyright: true
toc: true
draft: true
---

解题以及补题报告。

<!--more-->

题目连接：[Codeforces Round #641 (Div. 2)](https://codeforces.com/contest/1350/problems)

## A. Orac and Factors

如果 $n$ 为奇数，那么 $f(n)$ 也是奇数，如果 $n$ 是偶数，$f(n)=2$，因此第一步 $n=n+f(n)$ 后就会变成偶数，后面 $k-1$ 次都是 $n=n+2$。

```cpp
#include <bits/stdc++.h>

using namespace std;

int T, n, k;

int f(int n) {
    for (int i = 2; i <= n / i; i++) {
        if (n % i == 0) return i;
    }
    return n;
}

int main() {
    cin >> T;
    while (T--) {
        scanf("%d%d", &n, &k);
        long long res = 0;
        res += n + f(n);
        if (k >= 2) res += (k - 1) * 2;
        cout << res << endl;
    }
    return 0;
}
```

## B. Orac and Models

$f[i]$ 表示以 $i$ 结尾的子序列的最大长度，枚举 $i$ 的所有约数 $j$，如果 $s[i]>s[j]$ 就可以转移：$f[i]=max(f[i],f[j]+1)$，记得初始化 $f[i]=1$。枚举约数 $j$ 需要在 $\sqrt{i}$ 以内枚举，通过对称性得到另一个约数 $i/j$ ，不然就 TLE 了。

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 100010;

int n, T;
int s[N], f[N];

int main() {
    scanf("%d", &T);
    while (T--) {
        cin >> n;
        for (int i = 1; i <= n; i++) {
            scanf("%d", &s[i]);
            f[i] = 1;
            for (int j = 1; j <= i / j; j++) {
                if (i % j == 0) {
                    if (s[i] > s[j]) f[i] = max(f[i], f[j] + 1);
                    if (s[i] > s[i / j]) f[i] = max(f[i], f[i / j] + 1);
                }
            }
        }
        int res = 0;
        for (int i = 1; i <= n; i++) res = max(res, f[i]);
        printf("%d\n", res);
    }
    return 0;
}
```

## C. Orac and LCM

题意：给定 $n$ 个数，先求任两个数的 $\rm lcm$，再求这些 $\rm lcm$ 的 $\gcd$。

解法：从质因数分解的角度来考虑。我们对任意两个数 $x,y$ 分别进行质因数分解，对 $\mathrm{lcm}(x,y)$ 同样分解质因数，那么对于 $\mathrm{lcm}(x,y)$ 中的任意一个质因子 $p$，$p$ 的次数一定是 $x,y$ 中 $p$ 的次数较大的那个。同样地，对于 $\gcd(x,y)$ 中的任意一个质因子 $p$，$p$ 的次数一定是 $x,y$ 中 $p$ 的次数较小的那个。  

有了这两个性质，可以发现，对任意两个数求解 $\rm lcm$ 后得到的数的集合，其实是筛去了，每个质因子的次数最小的那一项；对所得的 $\rm lcm$ 的集合求解 $\gcd$，其实是从中选取每个质因子次数最小的一项，把它们乘起来就是答案。  

总结一下，就是对所有 $a[i]$ 质因子分解，如果存在质因子 $p$，那么取 $p$ 的次数为..次小..（最小的被 $\rm lcm$ 筛去了）的那一项。所以本题就是统计所有 $a[i]$ 中的所有质因子的次数的次小值（ $0$ 次也算）。

**可能的坑点**  
因为 $0$ 次幂的存在，可以取巧只去统计次数至少为 $1$ 的质因子在几个 $a[i]$ 中出现，如果它在 $n$ 个数中都出现，那么直接取该质因子次数的次小值即可，如果在 $n-1$ 个数中出现，那么取最小值即可（因为最小其实是 $0$，但是这种做法没有统计 $0$ ）。如果出现次数少于 $n-1$ 那么次小值和最小值就都是 $0$。  
还有一种做法，就是考虑 $0$，但是没有把所有质因子次数为 $0$ 的情况都统计上，就会出问题。

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long LL;

const int N = 200010;

int n;
int a[N];
int primes[N], cnt;
bool st[N];
int mp1[N], mp2[N];
int tot[N];

void euler(int n) {
    for (int i = 2; i <= n; i++) {
        if (!st[i]) primes[cnt++] = i;
        for (int j = 0; primes[j] <= n / i; j++) {
            st[primes[j] * i] = true;
            if (i % primes[j] == 0) break;
        }
    }
}

int ksm(int a, int b) {
    int res = 1;
    while (b) {
        if (b & 1) res = res * a;
        a = a * a;
        b >>= 1;
    }
    return res;
}

int main() {
    euler(N - 1);
    for (int i = 0; i < cnt; i++) {
        mp1[primes[i]] = mp2[primes[i]] = 1e5;
    }
    cin >> n;
    for (int i = 1; i <= n; i++) {
        scanf("%d", &a[i]);
        for (int j = 0; primes[j] <= a[i] / primes[j]; j++) {
            int p = primes[j];
            if (a[i] % p == 0) {
                tot[p]++;
                int s = 0;
                while (a[i] % p == 0) a[i] /= p, s++;
                if (s <= mp1[p]) {
                    mp2[p] = mp1[p];
                    mp1[p] = s;
                } else if (s < mp2[p]) {
                    mp2[p] = s;
                }
            }
        }
        if (a[i] > 1) {
            tot[a[i]]++;
            if (1 < mp1[a[i]]) {
                mp2[a[i]] = mp1[a[i]];
                mp1[a[i]] = 1;
            } else if (1 < mp2[a[i]]) {
                mp2[a[i]] = 1;
            }
        }
        
    }
    LL res = 1;
    for (int i = 0; i < cnt; i++) {
        int p = primes[i], k;
        if (tot[p] < n - 1) continue;
        if (tot[p] == n - 1) k = mp1[p];
        else if (tot[p] == n) k = mp2[p];
        if (k == 1e5) continue;
        res *= ksm(p, k);
    }
    cout << res << endl;
    return 0;
}
```

## D. Orac and Medians

很妙的一个题（想不到），可以发现，如果通过某些操作，能够使得某个长度为 $2$ 的子区间变成 $kk$，那么整个序列就能全部变成 $k$ 。首先序列必须存在 $k$，不存在就是无解。如果 $a[i]=k$，如果 $a[i]$ 的左边或者右边有一个 $\ge k$ 的数，那么就能产生 $kk$ 。否则，我们需要尝试制造这样的情况，如果有两个相邻的大于等于 $k$ 的数，那么这个区间可以不断向外扩展，把扩展的数字都变成 $\ge k$ 的数，直到遇到 $k$，就变成了上面的情况，也就是说只要有两个相邻的大于等于 $k$ 的数，就一定有解。值得注意的是，即使没有两个相邻的大于等于 $k$ 的数，只要这样的两个数存在于同一个长度为 $3$ 的区间，同样可以把这个区间全部变成大于等于 $k$ 的数，那么就和上面一样了。否则无解。

```cpp
#include <bits/stdc++.h>

using namespace std;

const int N = 100010;

int T, n, k;
int a[N];

int main() {
	for (cin >> T; T--; ) {
		cin >> n >> k;
		bool flag = false;
		for (int i = 0; i < n; i++) {
			scanf("%d", &a[i]);
			if (a[i] == k) flag = true;
		}
		if (!flag) { puts("no"); continue; }
		if (n == 1) { puts("yes"); continue; }

		flag = false;
		for (int i = 0; i < n - 1; i++) {
			if (a[i] >= k && a[i + 1] >= k)
				flag = true;
		}	
		for (int i = 0; i < n - 2; i++) {
			if (a[i] >= k && a[i + 2] >= k)
				flag = true;
		}
		puts(flag ? "yes" : "no");
	}
	return 0;
}
```

## E. Orac and Game of Life

这题怎么这么水啊（qwq）。`dist[i][j]`表示`(i,j)`位置第一次变化的前一个时刻。先把所有初始时刻的下一个时刻，会发生变化的`(i,j)`全部入队，初始化`dist[i][j] = 0`，然后 bfs 求一下 `dist[][]`。查询的时候：`dist[i][j] == -1`表示永远不变；`p <= dist[i][j]`表示`p`时刻还没到第一次变化，否则判断一下`p - dist[i][j]`的奇偶性即可。

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef pair<int, int> PII;

const int N = 1010;

int n, m, T;
char g[N][N];
int dist[N][N];
queue<PII> q;

int dx[4] =  {-1, 0, 1, 0}, dy[4] = {0, 1, 0, -1};

void dfs(int x, int y) {
    for (int i = 0; i < 4; i++) {
         int a = x + dx[i], b = y + dy[i];
         if (a < 1 || a > n || b < 1 || b > m) continue;
         if (g[x][y] != g[a][b]) continue;
         dist[a][b] = 0;
         q.push({a, b});
    }
}

void init() {
    memset(dist, -1, sizeof dist);
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            dfs(i, j);
        }
    }
    while (q.size()) {
        auto t = q.front();
        q.pop();
        int x = t.first, y = t.second;
        for (int i = 0; i < 4; i++) {
            int a = x + dx[i], b = y + dy[i];
            if (a < 1 || a > n || b < 1 || b > m) continue;
            if (g[x][y] == g[a][b] || dist[a][b] != -1) continue;
            dist[a][b] = dist[x][y] + 1;
            q.push({a, b});
        }
    }
}

int main() {
    cin >> n >> m >> T;
    for (int i = 1; i <= n; i++) cin >> g[i] + 1;
    init();
    while (T--) {
        int i, j;
        long long p;
        scanf("%d%d%lld", &i, &j, &p);
        if (p <= dist[i][j] || dist[i][j] == -1) putchar(g[i][j]);
        else if ((p - dist[i][j]) % 2 == 0) putchar(g[i][j]);
        else putchar(g[i][j] ^ 1);
        puts("");
    }
    return 0;
}
```