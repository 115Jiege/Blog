---
title: gmssl_android编译
date: 2023-04-17 08:17:58
categories:
- 研发
tags:
- android开发
cover: https://cdn.pixabay.com/photo/2017/01/11/08/31/icon-1971128__340.png
---
   说来就来，国密gmssl的Android版编译;
### 编译环境
   os: mint 20.1(5.4.0-58-generic #64-Ubuntu SMP Wed Dec 9 08:16:25 UTC 2020 x86_64 x86_64 x86_64 GNU/Linux)
   NDK: android-r14b
   Android-abi: android-19
   
### 初步准备
   android-ndk-r14b，可以在[此处](https://www.androiddevtools.cn/)下载合适版本;
   下载[openssl for android](https://github.com/rjmangubat23/OpenSSL.git)
   配置环境变量
```
```
   ./config shared no-ssl2 no-ssl3 no-comp no-hw no-sdf no-skf  no-zuc --openssldir=/usr/local/ssl/android-19 --prefix=/usr/local/ssl/android-19
SKF/SDF/SAF/SOF来自于标准中接口函数的前缀，



