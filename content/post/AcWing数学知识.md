---
title: "AcWing数学知识"
date: 2019-09-19T16:06:49+08:00
weight: 
description:
tags: []
categories: [ACM, Notes]
series: []
algorithms: []
comments: true
displayCopyright: true
toc: true
draft: true
---

[AcWing](<https://www.acwing.com/activity/content/11/>)

> 学习笔记

<!--more-->

## **数学知识**

### **质数**

#### 试除法

[AcWing 866. 试除法判定质数](https://www.acwing.com/problem/content/868/)

```cpp
bool is_prime(int n) {
    if (n < 2) return false;
    for (int i = 2; i <= n / i; i++) {
        if (n % i == 0) return false;
    }
    return true;
}
```

[AcWing 867. 分解质因数](https://www.acwing.com/activity/content/problem/content/936/1/)

```cpp
void divide(int n) {
    for (int i = 2; i <= n / i; i++) {
        if (n % i == 0) { 
            int s = 0;
            while (n % i == 0) {
                s++;
                n /= i;
            }
            printf("%d %d\n", i, s);
        }
    }
    if (n > 1) printf("%d %d\n", n, 1);
    puts("");
}
```

#### 线性筛法

[AcWing 868. 筛质数](https://www.acwing.com/problem/content/870/)

`if (i % primes[j] == 0) break; ` 将筛法优化成线性的。

每次筛去`primes[j]*i`，如果进入`if`，`primes[j]`一定是`i`的最小质因子，也是`primes[j]*i`的最小质因子；若没进入`if`，`primes[j]`一定小于`i`的所有质因子，`primes[j]`一定是`primes[j]*i`的最小质因子。

因此，筛去的每一个数都是由其最小质因子筛去的。

```cpp
int primes[N], cnt;
bool st[N];

void get_primes(int n) {
    for (int i = 2; i <= n; i++) {
        if (!st[i]) primes[cnt++] = i;
        for (int j = 0; primes[j] <= n / i; j ++) {
            st[primes[j] * i] = true;
            if (i % primes[j] == 0) break; 
        }
    }
}
```

&nbsp;

### **约数**

#### 试除法

[AcWing 869. 试除法求约数](https://www.acwing.com/problem/content/871/)

```cpp
vector<int> get_divisors(int n) {
    vector<int> res;
    for (int i = 1; i <= n / i; i++) {
        if (n % i == 0) {
            res.push_back(i);
            if (i != n / i) res.push_back(n / i); // 去重
        }
    }
    sort(res.begin(), res.end());
    return res;
}
```

#### 约数个数与约数之和

质因数分解：
$$
N=p_1^{\alpha_1}p_2^{\alpha_2}...p_k^{\alpha_k}
$$
约数个数：
$$
(\alpha_1+1)(\alpha_2+1)...(\alpha_k+1)
$$
约数之和：
$$
(p_1^0+p_1^1+···+p_1^{\alpha_1})(p_2^0+p_2^1+...+p_2^{\alpha_2})...(p_k^0+p_k^1+···+p_k^{\alpha_k})
$$


