---
title: 国密SM2签名
date: 2023-02-22 16:50:10
categories:
- 研发
tags: 
- c++
cover: https://cdn.pixabay.com/photo/2016/06/09/17/45/hacker-1446193_960_720.jpg
---
## About GMSSL
GmSSL是由由北京大学自主开发的国产商用密码开源库，实现了对国密算法、标准和安全通信协议的全面功能覆盖，支持包括移动端在内的主流操作系统和处理器，支持密码钥匙、密码卡等典型国产密码硬件，提供功能丰富的命令行工具及多种编译语言编程接口。
<!--more-->
## SM2签名
SM2签名算法实际上就是使用椭圆曲线密码算法进行数字签名和验证，以通信为例，服务器使用私钥签名，客户端使用公钥验签。

### 椭圆曲线 
椭圆曲线公钥密码所基于的曲线性质如下：
——有限域上椭圆曲线在点加运算下构成有限交换群 ,且其阶与基域规模相近；
——类似于有限域乘法群中的乘幂运算 ,椭圆曲线多倍点运算构成一个单向函数；

根据椭圆曲线的性质，找到曲线基点G在素数域(GFp)或二元扩域（GF2m）的k倍点P(x,y)，即：
`(x,y) = kG `
则点P(x,y)为公钥，k为私钥。

### SM2签名算法
[GMSSL官方项目地址](https://github.com/guanzhi/GmSSL.git) 
在使用GMSSL-v1 SM2签名算法的过程中，发现了一下问题：
1.函数SM2_do_sign()中约每100次生成含有padding的签名
2.程序源码存在内存泄露问题

因此，本项目对GMSSL-v1做出以下改进：
1.按照标准文档修改函数SM2_do_sign_ex()的逻辑，返回ECDSA_SIG结构签名
```CPP
struct ECDSA_SIG_st {
    BIGNUM *r;
    BIGNUM *s;
};
```
2.网络中一般以字节流的形式传输，因此新增结构体SM2_SIGNATURE_STRUCT
```CPP
typedef struct sm2_sig_structure
{
	unsigned char r_coordinate[32];
	unsigned char s_coordinate[32];
} SM2_SIGNATURE_STRUCT;
```
3.解决随机生成含有padding的签名，修改函数SM2_do_sign()，内置BN_bn2binpad()
4.规范代码格式，增加可读性

官网中GMSSL-v2相比v1并没有对SM2签名、密钥交换、加解密做出改进；GMSSL-3.0.0稳定版本增加Windows+VS编译，去掉了perl的使用，但编译失败；GMSSL-3.1.0-dev版编译成功，但GMSSL-3.0以上的版本都独立于openssl，并且SM2签名、密钥交换相关仍在开发。
因此，本项目参考标准文档对稳定并使用广泛的GMSSL-V1进行开发改进，[项目地址](https://github.com/115Jiege/Gmssl.git) 。


