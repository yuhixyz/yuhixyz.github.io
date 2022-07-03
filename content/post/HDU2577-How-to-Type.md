---
title: "HDU2577 How to Type"
date: 2019-11-22T14:03:48+08:00
weight: 
description:
tags: []
categories: [ACM, Solutions]
series: []
algorithms: [DP]
comments: true
displayCopyright: true
toc: true
draft: true 
---

原题链接：[HDU2577](http://acm.hdu.edu.cn/showproblem.php?pid=2577 )

**题目大意**：Cathy 打字，有大写字母也有小写字母，她想尽可能少的敲键盘，可以按大写锁定键 $\rm Caps$，可以按$\rm shift$ 键来进行敲字 母。输出最少按键次数。注意，最后大写锁定键灯必须是灭的。

<!--more-->

> DP

状态表示：$f[i][0],f[i][1]$，已经敲完了前 $1$~$i$ 个字母，当前 $\rm Caps$ 状态为 $\rm off/on$，的最少按键次数

状态计算见代码，注意 $\rm Caps$ 处于 $\rm on$ 时，按 $\rm Shift$ 可以打出小写字母；最终以 $f[n][1]$ 结束则必须 $+1$ 关闭大写锁定。

答案：$min(f[n][0], f[n][1] + 1)$

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 110;

int T;
char str[N];
int f[N][2];

int main() {
	cin >> T;
	while (T--) {
		scanf("%s", str + 1);
		int n = strlen(str + 1);
		memset(f, 0x3f, sizeof f);
		f[0][0] = 0;
		f[0][1] = 1;
		for (int i = 1; i <= n; i++) {
			if (isupper(str[i])) { // 大写 
				f[i][0] = min(f[i - 1][1] + 2, f[i - 1][0] + 2);
				f[i][1] = min(f[i - 1][1] + 1, f[i - 1][0] + 2);
			} else { // 小写 
				f[i][0] = min(f[i - 1][0] + 1, f[i - 1][1] + 2);
				f[i][1] = min(f[i - 1][1] + 2, f[i - 1][0] + 2);
			}
		}
		printf("%d\n", min(f[n][0], f[n][1] + 1));
	}
	return 0;
}
```