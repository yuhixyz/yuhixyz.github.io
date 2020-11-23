---
title: "写了一个 cpp 高精度运算含负数无除法封装的板子"
date: 2020-08-08T03:12:38+08:00
weight: 
description:
tags: []
categories: [ACM, Templates]
series: []
algorithms: [高精度]
comments: true
displayCopyright: true
toc: true
draft: false
---

鉴于上次用 py 写高精度 T 掉之后，决定自己整理一份 cpp 的高精度模板。于是学习了各方代码思路，但好像几乎找不到支持负数的板子，只好自己手撸了一个比较顺手的高精度板子，支持负数，目前不支持除法。代码细节有待完善，可能有未知 bug。  

以下板子声明一个高精度变量 `hll ans;` 此时 `ans` 相当于一个空的 `vector`，而并不代表数值 $0$ 。  
下面的第二份板子，将 `ans` 初始化为数值 $0$ 。

```cpp
struct hll {
	int num[4010], len, sign;
	hll() { len = 0, sign = 1; }
	hll(int x) { *this = x; }
	hll(long long x) { *this = x; }
	hll(char *ss) { *this = ss; }
	hll(string ss) { *this = ss; }
	hll& operator = (const int &x) {
		int val = x;
		if (val >= 0) sign = 1, len = 0;
		else if (val < 0) sign = -1, val = -val, len = 0;
		do { 
			num[len++] = val % 10, val /= 10;
		} while (val);
		return *this;
	}
	hll& operator = (const long long &x) {
		long long val = x;
		if (val >= 0) sign = 1, len = 0;
		else if (val < 0) sign = -1, val = -val, len = 0;
		do {
			num[len++] = val % 10, val /= 10;
		} while (val);
		return *this;
	}
	hll& operator = (const string &ss) {
		len = ss.size();
		int start;
		if (ss[0] == '-') sign = -1, start = 1;
        else sign = 1, start = 0;
		for (int i = len - 1; i >= start; i--) num[len - i - 1] = ss[i] - '0';
		if (sign == -1) len--;
		return *this;
	}
	hll& operator = (const char *ss) {
		len = strlen(ss);
		int start;
		if (ss[0] == '-') sign = -1, start = 1;
        else sign = 1, start = 0;
		for (int i = len - 1; i >= start; i--) num[len - i - 1] = ss[i] - '0';
		if (sign == -1) len--;
		return *this;
	}
	hll& operator = (const hll &t) {
        len = t.len, sign = t.sign;
    	for (int i = 0; i < len; i++) num[i] = t.num[i];
        return *this;
    }
    int abs_cmp(const hll &a, const hll &b) const { // |a|>|b|时返回1，相等返回0，小于返回-1
        if (a.len > b.len) return 1;
        else if (a.len < b.len) return -1;
        else {
            for (int i = a.len - 1; i >= 0; i--) {
                if (a.num[i] < b.num[i]) return -1;
                if (a.num[i] > b.num[i]) return 1;
            }
            return 0;
        }
    }
    int cmp(const hll &t) const { // *this与t比较，小于返回-1，等于返回0，大于返回1
		if (sign != t.sign) {
			if (sign == 1) return 1;
			else return -1;
		} else {
			if (abs_cmp(*this, t) == 1) return sign;
			else if (abs_cmp(*this, t) == 0) return 0;
			else return -sign;
		}
	}
	hll abs_plus(const hll &a, const hll &b) { // |a|+|b|, ans的符号与a和b原来的符号相同 
		hll ans;
		ans.sign = a.sign;
		for (int i = 0, carry = 0; i < a.len || i < b.len || carry; i++) {
			if (i < a.len) carry += a.num[i];
			if (i < b.len) carry += b.num[i];
			ans.num[ans.len++] = carry % 10;
			carry /= 10;
		}
		return ans;
	}
	hll abs_minus(const hll &a, const hll &b) { // ||a|-|b||, ans的符号为|a|-|b|的符号 
		hll ans, c, d;
		if (abs_cmp(a, b) >= 0) ans.sign = 1, c = a, d = b;
        else ans.sign = -1, c = b, d = a;
        for (int i = 0, borrow = 0; i < c.len; i++) {
            borrow = c.num[i] - borrow;
            if (i < d.len) borrow -= d.num[i];
            ans.num[ans.len++] = (borrow + 10) % 10;
            if (borrow >= 0) borrow = 0;
            else borrow = 1;
		}
		while (ans.len > 1 && ans.num[ans.len - 1] == 0) ans.len--; // 去除前导0 
		return ans;
	}
    bool operator == (const hll &t) const { return cmp(t) == 0; }
    bool operator != (const hll &t) const { return !(cmp(t) == 0); }
    bool operator < (const hll &t) const { return cmp(t) == -1;	}
	bool operator > (const hll &t) const { return cmp(t) == 1; }
	bool operator <= (const hll &t) const {	return !(cmp(t) == 1); }
	bool operator >= (const hll &t) const { return !(cmp(t) == -1); }
	hll operator + (const hll &t) {
        hll ans;
        if (sign == t.sign) { // 同号 直接相加，符号不变 
        	ans = abs_plus(*this, t);
		} else { // 异号 
			if (sign == 1) { // 前正 + 后负 == 前绝对值 - 后绝对值 
				ans = abs_minus(*this, t);
			} else { // 前负 + 后正 == 后绝对值 - 前绝对值 
				ans = abs_minus(t, *this);
			}
		}
        return ans;
    }
    hll operator - (const hll &t) {
        hll ans;
        if (sign == t.sign) { // 同号
            ans = abs_minus(*this, t);
            if (sign == 1) { // 前正 - 后正
                ; // 不用做了
            } else { // 前负 - 后负
                ans.sign *= -1;
            }
		} else { // 异号 
			if (sign == 1) { // 前正 - 后负 == 前绝对值 + 后绝对值 
				ans = abs_plus(*this, t);
			} else { // 前负 - 后正 == -(前绝对值 + 前绝对值) 
				ans = abs_plus(t, *this);
                ans.sign = -1;
			}
		}
        return ans;
    } 
    hll operator * (const hll &t) { // 高精度*高精度 
        hll ans;
		memset(ans.num, 0, len + t.len << 2);
        ans.sign = sign * t.sign;
        ans.len = len + t.len - 1; // a位数乘以b位数，得到的结果是a+b-1位数，或a+b位数 
        for (int i = 0; i < len; i++) {
        	for (int j = 0; j < t.len; j++)
        		ans.num[i + j] += num[i] * t.num[j];
		}
		for (int i = 0; i < ans.len - 1; i++) {
			if (ans.num[i] >= 10) {
				ans.num[i + 1] += ans.num[i] / 10;
				ans.num[i] %= 10;
			}
		}
		// 看最高位是否需要进位，如果有进位，答案最终是a+b位数，否则是a+b-1位数 
		if (ans.num[ans.len - 1] >= 10) {
			ans.num[ans.len] = ans.num[ans.len - 1] / 10;
			ans.num[ans.len - 1] %= 10;
			ans.len++;
		}
		while (ans.len > 1 && ans.num[ans.len - 1] == 0) ans.len--; // 去除前导0 
        return ans;
    }
    hll operator += (const hll &t) {
        return *this + t;
    }
    hll operator *= (const hll &t) {
        return *this * t;
    }
	void print() {
		if (sign == -1) putchar('-');
		for (int i = len - 1; i >= 0; i--) putchar(num[i] + '0');
	}
};
```

```cpp
struct hll {
	int num[150], len, sign;
	hll() { num[0] = 0, len = 1, sign = 1; }
	hll(int x) { *this = x; }
	hll(long long x) { *this = x; }
	hll(char *ss) { *this = ss; }
	hll(string ss) { *this = ss; }
	hll& operator = (const int &x) {
		int val = x;
		if (val >= 0) sign = 1, len = 0;
		else if (val < 0) sign = -1, val = -val, len = 0;
		do { 
			num[len++] = val % 10, val /= 10;
		} while (val);
		return *this;
	}
	hll& operator = (const long long &x) {
		long long val = x;
		if (val >= 0) sign = 1, len = 0;
		else if (val < 0) sign = -1, val = -val, len = 0;
		do {
			num[len++] = val % 10, val /= 10;
		} while (val);
		return *this;
	}
	hll& operator = (const string &ss) {
		len = ss.size();
		int start;
		if (ss[0] == '-') sign = -1, start = 1;
        else sign = 1, start = 0;
		for (int i = len - 1; i >= start; i--) num[len - i - 1] = ss[i] - '0';
		if (sign == -1) len--;
		return *this;
	}
	hll& operator = (const char *ss) {
		len = strlen(ss);
		int start;
		if (ss[0] == '-') sign = -1, start = 1;
        else sign = 1, start = 0;
		for (int i = len - 1; i >= start; i--) num[len - i - 1] = ss[i] - '0';
		if (sign == -1) len--;
		return *this;
	}
	hll& operator = (const hll &t) {
        len = t.len, sign = t.sign;
    	for (int i = 0; i < len; i++) num[i] = t.num[i];
        return *this;
    }
    int abs_cmp(const hll &a, const hll &b) const { // |a|>|b|时返回1，相等返回0，小于返回-1
        if (a.len > b.len) return 1;
        else if (a.len < b.len) return -1;
        else {
            for (int i = a.len - 1; i >= 0; i--) {
                if (a.num[i] < b.num[i]) return -1;
                if (a.num[i] > b.num[i]) return 1;
            }
            return 0;
        }
    }
    int cmp(const hll &t) const { // *this与t比较，小于返回-1，等于返回0，大于返回1
		if (sign != t.sign) {
			if (sign == 1) return 1;
			else return -1;
		} else {
			if (abs_cmp(*this, t) == 1) return sign;
			else if (abs_cmp(*this, t) == 0) return 0;
			else return -sign;
		}
	}
	hll abs_plus(const hll &a, const hll &b) { // |a|+|b|, ans的符号与a和b原来的符号相同 
		hll ans; ans.len = 0;
		ans.sign = a.sign;
		for (int i = 0, carry = 0; i < a.len || i < b.len || carry; i++) {
			if (i < a.len) carry += a.num[i];
			if (i < b.len) carry += b.num[i];
			ans.num[ans.len++] = carry % 10;
			carry /= 10;
		}
		return ans;
	}
	hll abs_minus(const hll &a, const hll &b) { // ||a|-|b||, ans的符号为|a|-|b|的符号 
		hll ans, c, d; ans.len = 0;
		if (abs_cmp(a, b) >= 0) ans.sign = 1, c = a, d = b;
        else ans.sign = -1, c = b, d = a;
        for (int i = 0, borrow = 0; i < c.len; i++) {
            borrow = c.num[i] - borrow;
            if (i < d.len) borrow -= d.num[i];
            ans.num[ans.len++] = (borrow + 10) % 10;
            if (borrow >= 0) borrow = 0;
            else borrow = 1;
		}
		while (ans.len > 1 && ans.num[ans.len - 1] == 0) ans.len--; // 去除前导0 
		return ans;
	}
    bool operator == (const hll &t) const { return cmp(t) == 0; }
	bool operator != (const hll &t) const { return !(cmp(t) == 0); }
    bool operator < (const hll &t) const { return cmp(t) == -1;	}
	bool operator > (const hll &t) const { return cmp(t) == 1; }
	bool operator <= (const hll &t) const {	return !(cmp(t) == 1); }
	bool operator >= (const hll &t) const { return !(cmp(t) == -1); }
	hll operator + (const hll &t) {
        hll ans;
        if (sign == t.sign) { // 同号 直接相加，符号不变 
        	ans = abs_plus(*this, t);
		} else { // 异号 
			if (sign == 1) { // 前正 + 后负 == 前绝对值 - 后绝对值 
				ans = abs_minus(*this, t);
			} else { // 前负 + 后正 == 后绝对值 - 前绝对值 
				ans = abs_minus(t, *this);
			}
		}
        return ans;
    }
    hll operator - (const hll &t) {
        hll ans;
        if (sign == t.sign) { // 同号
            ans = abs_minus(*this, t);
            if (sign == 1) { // 前正 - 后正
                ; // 不用做了
            } else { // 前负 - 后负
                ans.sign *= -1;
            }
		} else { // 异号 
			if (sign == 1) { // 前正 - 后负 == 前绝对值 + 后绝对值 
				ans = abs_plus(*this, t);
			} else { // 前负 - 后正 == -(前绝对值 + 前绝对值) 
				ans = abs_plus(t, *this);
                ans.sign = -1;
			}
		}
        return ans;
    } 
    hll operator * (const hll &t) { // 高精度*高精度 
        hll ans; ans.len = 0;
		memset(ans.num, 0, len + t.len << 2);
        ans.sign = sign * t.sign;
        ans.len = len + t.len - 1; // a位数乘以b位数，得到的结果是a+b-1位数，或a+b位数 
        for (int i = 0; i < len; i++) {
        	for (int j = 0; j < t.len; j++)
        		ans.num[i + j] += num[i] * t.num[j];
		}
		for (int i = 0; i < ans.len - 1; i++) {
			if (ans.num[i] >= 10) {
				ans.num[i + 1] += ans.num[i] / 10;
				ans.num[i] %= 10;
			}
		}
		// 看最高位是否需要进位，如果有进位，答案最终是a+b位数，否则是a+b-1位数 
		if (ans.num[ans.len - 1] >= 10) {
			ans.num[ans.len] = ans.num[ans.len - 1] / 10;
			ans.num[ans.len - 1] %= 10;
			ans.len++;
		}
		while (ans.len > 1 && ans.num[ans.len - 1] == 0) ans.len--; // 去除前导0 
        return ans;
    } 
	hll operator += (const hll &t) {
        return *this + t;
    }
    hll operator *= (const hll &t) {
        return *this * t;
    }
	void print() {
		if (sign == -1) putchar('-');
		for (int i = len - 1; i >= 0; i--) putchar(num[i] + '0');
	}
};
```

