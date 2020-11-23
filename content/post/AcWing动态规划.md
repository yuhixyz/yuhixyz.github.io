---
title: "AcWing动态规划"
date: 2019-10-07T14:25:06+08:00
weight: 
description:
tags: []
categories: [ACM, Notes]
series: []
algorithms: [DP]
comments: true
displayCopyright: true
toc: true
draft: false
---

[AcWing](<https://www.acwing.com/activity/content/11/>)

> 学习笔记

<!--more-->

## **背包问题**

### **01背包**

[AcWing 2. 01背包问题](https://www.acwing.com/problem/content/2/)

> 有 $n$ 件物品和一个容量是 $m$ 的背包。每件物品只能使用一次。
>
> 第 $i$ 件物品的体积是 $v_i$，价值是 $w_i$。
>
> 求在不超过背包容量的前提下的最大价值。

**分析**

1. 状态表示 $f[i][j]$

   - 集合：从前 $ i $ 个物品中选，总体积不超过 $ j $ 的所有选法。
   - 属性：$ \max $（最大价值）
2. 状态计算

   - 集合划分依据：是否选择第$ i $个物品
   - 状态转移方程：

$$
f[i][j] = \max(f[i - 1][j], f[i - 1][j - v_i] + w_i)
$$

可以发现，每次计算 $f[i][j]$ 是由第 $i-1$ 层转移而来，因此可以用滚动数组优化至一维，将体积从大到小循环，就可以保证 $f[j]$ 计算时用到的都是上一层状态。
$$
f[j] = \max(f[j], f[j - v_i] + w_i)
$$

```cpp
for (int i = 1; i <= n; i++)
    for (int j = m; j >= v; j--)
        f[j] = max(f[j], f[j - v[i]] + w[i]);
```

&nbsp;

### **完全背包**

[AcWing 3. 完全背包问题](https://www.acwing.com/problem/content/3/)

> 有 $ n $ 种物品和一个容量是 $ m $ 的背包。每种物品都有无限件可用。
>
> 第 $ i $ 件物品的体积是 $ v_i $，价值是 $ w_i $。
>
> 求在不超过背包容量的前提下的最大价值。

**分析**

1. 状态表示 $ f[i][j] $

   + 集合：从前 $ i $ 种物品中选，总体积不超过 $ j $ 的所有选法。

   + 属性：$ \max $（最大价值）

2. 状态计算

   + 集合划分依据：第 $i$ 组物品选第 $k$ 个

   - 状态转移方程：

$$
f[i][j] = \max(f[i - 1][j], f[i - 1][j - v_i] + w[i])
$$

可以做如下推导：
$$
f[i][j] = \max \lbrace f[i-1][j],f[i-1][j-v_i]+w_i,f[i-1][j-2v_i]+2w_i,...\rbrace\quad①
$$

$$
f[i][j-v] = \max \lbrace f[i-1][j-v_i],f[i-1][j-2v_i]+w_i,f[i-1][j-3v_i]+2w_i,... \rbrace \quad ②
$$

可以发现，①式从第二项开始到最后，其项数与②式相同，大小相当于②式加上一个偏移量 $w_i$，因此等价可得：
$$
f[i][j] = \max(f[i - 1][j], f[i][j - v_i] + w_i)
$$
可以发现，如果用滚动数组优化至一维，将体积从小到大循环，就可以保证计算 $f[j]$ 时用到 $f[j - v]$ 已经是第 $i$ 层状态，而 $f[j]$ 当层计算前仍然是上一层状态，满足原来的二维状态转移方程。
$$
f[j] = \max(f[j], f[j - v_i] + w_i)
$$

```cpp
for (int i = 1; i <= n; i++)
    for (int j = v; j <= m; j++)
        f[j] = max(f[j], f[j - v[i]] + w[i]);
```

 &nbsp;

### **分组背包**

[AcWing 9. 分组背包问题](https://www.acwing.com/problem/content/9/)

> 有 $n$ 组物品和一个容量是 $m$ 的背包。
>
> 每组物品有若干个，同一组内的物品最多只能选一个 $i$ 是组号，$j$ 是组内编号。
>
> 每件物品的体积是 $v\_{ij}$。价值是 $w\_{ij}$。
>
> 求在不超过背包容量的前提下的最大价值。

分析

1. 状态表示 $f[i][j]$

   + 集合：从前 $ i $ 组物品中选，总体积不超过 $ j $ 的所有选法。

   + 属性：$ \max $（最大价值）

2. 状态计算

   集合划分依据：第$ i $组物品选哪个（第 $ k $ 个）或一个都不选
$$
f[i][j] = \max(f[i-1][j],f[i-1][j - v_ {ik} ]+w_{ik})
$$

#### 优化

每次计算 $f[i][j]$ 是由第 $i-1$ 层转移而来，因此可以用滚动数组优化至一维，体积大到小循环即可。

<div> 

$$
f[j] = \max(f[j], f[j - v_{ik}] + w_{ik})
$$

</div>

体积从大到小循环，枚举组内选择，其中 $ j≥v_{ik} $



```cpp
for (int i = 1; i <= n; i++) // 枚举组号
    for (int j = m; j >= 1; j--)  // 枚举体积
        for (int k = 1; k <= s[i]; k++) // 选第k个
            if (j >= v[i][k])
                f[j] = max(f[j], f[j - v[i][k]] + w[i][k]);
```

&nbsp;

### **多重背包**

> 有 $n$ 种物品和一个容量是 $m$ 的背包。
>
> 第 $i$ 种物品最多有 $s_i$ 件，每件体积是 $v_i$，价值是 $w_i$。
>
> 求在不超过背包容量的前提下的最大价值。

分析

1. 状态表示 $f[i][j]$

   - 集合：从前 $i$ 种物品中选，总体积不超过 $j$ 的所有选法。
   - 属性：$\max $（最大价值）

2. 状态计算

   - 集合划分依据：第$i$种物品选几个（ $k$ 个）

$$
f[i][j] = \max(f[i-1][j - v_i \cdot k] + w_i \cdot k)
$$

$$
k \cdot v_i≤j \ 并且 \ k=0, 1, 2,...s_i
$$

#### 暴力

```cpp
for (int i = 1; i <= n; i++)
    for (int j = 1; j <= m; j++)
        for (int k = 0; k <= s[i] & k * v[i] <= j; k++)
            f[i][j] = max(f[i][j], f[i - 1][j - v[i] * k] + w[i] * k);
```

#### 一维

[AcWing 4. 多重背包问题 I](https://www.acwing.com/problem/content/4/)

```cpp
for (int i = 1; i <= n; i++)
    for (int j = m; j >= 1; j--) // 体积从大到小即可
        for (int k = 0; k <= s[i] & k * v[i] <= j; k++)
            f[j] = max(f[j], f[j - v[i] * k] + w[i] * k);
```

#### 二进制优化

[AcWing 5. 多重背包问题 II](https://www.acwing.com/problem/content/4/)

将 $s_i$ 个物品分解成 $2^0, 2^1, ... , 2^k, c$ 个物品打包的组合。

其中 $k$ 为满足 $2^{k+1}-1 ≤ s_i$ 的最大 $k$，$c$ 为剩下的一部分。

最终满足 $2^0 + 2^1 + ... + 2^k + c = s_i$

打包后的物品就可以转化为 $01$ 背包问题。

时间复杂度：$ O(nm \log s) $

```cpp
#include <iostream>
#include <algorithm>

using namespace std;
// N取nlogs上取整
const int N = 12000, M = 2010;

int n, m;
int v[N], w[N];
int f[M];
int cnt; // 打包后的总物品个数

int main()
{
    cin >> n >> m;
    
    // 预处理出新的cnt个物品
    for (int i = 0; i < n; i++)
    {	// 体积，价值，个数
        int a, b, s;
        cin >> a >> b >> s;
        
        int k = 1;
        while (k <= s)
        {
            cnt++;
            v[cnt] = a * k;
            w[cnt] = b * k;
            s -= k;
            k <<= 1;
        }
        if (s > 0) // 还剩s个
        {
            cnt++;
            v[cnt] = a * s;
            w[cnt] = b * s;
        }
    }
    
    // 01
    for (int i = 1; i <= cnt; i++)
        for (int j = m; j >= v[i]; j--)
            f[j] = max(f[j], f[j - v[i]] + w[i]);
            
    cout << f[m] << endl;
    
    return 0;
}
```

#### 单调队列优化

[AcWing 6. 多重背包问题 III](https://www.acwing.com/problem/content/4/)

似懂非懂

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 20010;

int n, m;
int f[N], g[N];
int q[N];

int main()
{
    cin >> n >> m;
    
    for (int i = 0; i < n; i++)
    {
        int v, w, s;
        cin >> v >> w >> s;
        
        memcpy(g, f, sizeof f);
        for (int j = 0; j < v; j++)
        {
            int hh = 0, tt = -1;
            for (int k = j; k <= m; k += v)
            {
                if (hh <= tt && q[hh] < k - s * v) hh++;
                if (hh <= tt) f[k] = max(f[k], g[q[hh]] + (k - q[hh]) / v * w);
                while (hh <= tt && g[q[tt]] - (q[tt] - j) / v * w <= g[k] - (k - j) / v  * w) tt--;
                q[++tt] = k;
            }
        }
    }
    
    cout << f[m] << endl;
    
    return 0;
}
```

## **最长公共上升子序列**

[AcWing 272. 最长公共上升子序列](https://www.acwing.com/problem/content/274/)

![LICS.png](https://cdn.acwing.com/media/article/image/2019/10/08/6828_b025d28ce9-LICS.png) 

### 朴素版

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 3010;

int n;
int a[N], b[N];
int f[N][N];

int main()
{
    cin >> n;
    for (int i = 1; i <= n; i++) scanf("%d", &a[i]);
    for (int i = 1; i <= n; i++) scanf("%d", &b[i]);
    
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
        {
            f[i][j] = f[i - 1][j];
            if (a[i] == b[j])
            {   
                f[i][j] = max(f[i][j], 1);
                for (int k = 1; k < j; k++)
                    if (b[k] < b[j])
                        f[i][j] = max(f[i][j], f[i][k] + 1);
            }
        }
        
    int res = 0;
    for (int i = 1; i <= n; i++) res = max(res, f[n][i]);
    
    cout << res << endl;
    
    return 0;
}
```
### 优化

由朴素版本的代码
`for (int k = 1; k < j; k++) if (b[k] < b[j]) f[i][j] = max(f[i][j], f[i][k] + 1);`
这里是在`a[i] == b[j]`的前提下用`f[i][1]~f[i][j-1]`中的最大值来更新`f[i][j]`，而这个最大值是前缀最大值，也就是说，我们可以一个变量`maxv`存下这个最大值，每一轮更新`maxv`。这样我们枚举到第j轮时，`maxv`存的就是`f[i][1 ~ j-1]`中的最大值，本轮结束再更新`maxv`。

```cpp
for (int i = 1; i <= n; i++)
{   
    int maxv = 0; // 存f[i][1 ~ j-1]的最大值，初始为0
    for (int j = 1; j <= n; j++)
    {   // 此时maxv为f[i][1]~f[i][j-1]的最大值
        f[i][j] = f[i - 1][j];
        if (a[i] == b[j]) f[i][j] = max(f[i][j], maxv + 1);
        if (b[j] < a[i]) maxv = max(maxv, f[i][j]); // 将本轮maxv更新
    }
}
```

## **数字三角形模型**

[AcWing 898. 数字三角形]( https://www.acwing.com/problem/content/900/ )

从下往上走，只能选择向左或向上，边界初始化为0即可。

```cpp
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 510;

int n;
int w[N][N];
int f[N][N];

int main()
{
    cin >> n;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= i; j++)
            cin >> w[i][j];
            
    for (int i = n; i; i--)
        for (int j = i; j; j--)
            f[i][j] = max(f[i + 1][j], f[i + 1][j + 1]) + w[i][j];
            
    cout << f[1][1] << endl;
    
    return 0;
}
```

（咕咕咕