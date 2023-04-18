---
categories:
- - 研发
cover: https://cdn.pixabay.com/photo/2017/01/11/08/31/icon-1971128__340.png
date: '2023-04-18 13:56:30'
tags:
- android开发
title: ''
updated: Tue, 18 Apr 2023 05:59:41 GMT
---
## 编译环境

os: mint 20.1

(5.4.0-58-generic #64-Ubuntu SMP Wed Dec 9 08:16:25 UTC 2020 x86_64 x86_64 x86_64 GNU/Linux)

NDK: android-r14b

Android-abi: android-21

## 初步准备

### gmssl

官址[click here]()

我的项目[click here](https://github.com/115Jiege/Gmssl.git)

### NDK

选用android-ndk-r14b，可以在[此处](https://www.androiddevtools.cn/)下载合适版本;

### 环境变量

将android-ndk-r14b所在位置添加到系统环境变量中;

```
sudo vim /etc/profile
#编辑文件
export ANROID_NDK_PATH=/usr/local/android-ndk-r14b
#:wq保存
source /etc/profile
```

## 编译合适版本

编写sh文件，在linux系统上使用ndk进行交叉编译

### x86

```
#!/bin/bash
 
ANDROID_PATH=$ANDROID_NDK_PATH
PLATFORM_VERSION=21
 
MAKE_TOOLCHAIN=$ANDROID_PATH/build/tools/make-standalone-toolchain.sh
export TOOLCHAIN_PATH=$ANDROID_PATH/x86
$MAKE_TOOLCHAIN --arch=x86 --platform=android-$PLATFORM_VERSION --install-dir=$TOOLCHAIN_PATH
 
export CROSS_SYSROOT=$TOOLCHAIN_PATH/sysroot
export TOOL_BASENAME=$TOOLCHAIN_PATH/bin
export PATH=$CROSS_SYSROOT:$PATH
export PATH=$TOOL_BASENAME:$PATH
 
./Configure --prefix=/usr/local --cross-compile-prefix=i686-linux-android- no-asm no-async shared android-x86
make && make install
```

### x86_64

```
#!/bin/bash
 
ANDROID_PATH=$ANDROID_NDK_PATH
PLATFORM_VERSION=21
 
MAKE_TOOLCHAIN=$ANDROID_PATH/build/tools/make-standalone-toolchain.sh
export TOOLCHAIN_PATH=$ANDROID_PATH/x86_64
$MAKE_TOOLCHAIN --arch=x86_64 --platform=android-$PLATFORM_VERSION --install-dir=$TOOLCHAIN_PATH
 
export CROSS_SYSROOT=$TOOLCHAIN_PATH/sysroot
export TOOL_BASENAME=$TOOLCHAIN_PATH/bin
export PATH=$CROSS_SYSROOT:$PATH
export PATH=$TOOL_BASENAME:$PATH
 
./Configure --prefix=/usr/local --cross-compile-prefix=x86_64-linux-android- no-asm no-async shared android64
make && make install
```

### arm64-v8a

```
#!/bin/bash
 
ANDROID_PATH=$ANDROID_NDK_PATH
PLATFORM_VERSION=21
 
MAKE_TOOLCHAIN=$ANDROID_PATH/build/tools/make-standalone-toolchain.sh
export TOOLCHAIN_PATH=$ANDROID_PATH/aarch64-linux-android
$MAKE_TOOLCHAIN --arch=arm64 --platform=android-$PLATFORM_VERSION --install-dir=$TOOLCHAIN_PATH

export CROSS_SYSROOT=$TOOLCHAIN_PATH/sysroot
export TOOL_BASENAME=$TOOLCHAIN_PATH/bin
export PATH=$CROSS_SYSROOT:$PATH
export PATH=$TOOL_BASENAME:$PATH
 
./Configure --prefix=/usr/local --cross-compile-prefix=aarch64-linux-android- no-asm no-async shared android64-aarch64
make && make install
```

### arm-v7a

```
#!/bin/bash
 
ANDROID_PATH=$ANDROID_NDK_PATH
PLATFORM_VERSION=21
 
MAKE_TOOLCHAIN=$ANDROID_PATH/build/tools/make-standalone-toolchain.sh
export TOOLCHAIN_PATH=$ANDROID_PATH/arm-linux-android
$MAKE_TOOLCHAIN --arch=arm --platform=android-$PLATFORM_VERSION --install-dir=$TOOLCHAIN_PATH
 
export CROSS_SYSROOT=$TOOLCHAIN_PATH/sysroot
export TOOL_BASENAME=$TOOLCHAIN_PATH/bin
export PATH=$CROSS_SYSROOT:$PATH
export PATH=$TOOL_BASENAME:$PATH
 
./Configure --prefix=/usr/local --cross-compile-prefix=arm-linux-androideabi- no-asm no-async shared android-armeabi
make && make install

```

### 查看so库信息

编译后通过

```
readelf -h libcrypto.so.1.1
```

查看系统架构等信息

例如：

Magic：   7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00
类别:                              ELF64
数据:                              2 补码，小端序 (little endian)
Version:                           1 (current)
OS/ABI:                            UNIX - System V
ABI 版本:                          0
类型:                              DYN (共享目标文件)
系统架构:                          AArch64
版本:                              0x1
入口点地址：               0x78240
程序头起点：          64 (bytes into file)
Start of section headers:          2968008 (bytes into file)
标志：             0x0
Size of this header:               64 (bytes)
Size of program headers:           56 (bytes)
Number of program headers:         6
Size of section headers:           64 (bytes)
Number of section headers:         32
Section header string table index: 29
