---
cover: https://cdn.pixabay.com/photo/2016/06/09/17/45/hacker-1446193_960_720.jpg
date: '2023-04-21 17:10:07'
categories:
- tips整理
tags: 
- sodium
title: sodium各平台编译
updated: Sun, 23 Apr 2023 02:13:29 GMT
---

# sodium各平台编译

## linux版编译

```bash
wget https://download.libsodium.org/libsodium/releases/LATEST.tar.gz
tar -zxvf LATEST.tar.gz
cd libsodium-stable
 ./configure
make && make check
sudo make install
sudo ldconfig
```

## 安卓版编译

### 交叉编译环境:

打开终端，apt安装

```bash
   apt-get install build-enssitial
   apt-get install clang
   apt-get install libtool
   apt-get install autoconf
   apt-get install automake
```

### 设置环境变量

sudo vim /etc/profile
添加:
export ANDROID_NDK_HOME=/home/Android/Sdk/ndk/23.1.7779620
export PATH=$PATH:$ANDROID_NDK_HOME

source  /etc/profile

](https://github.com/jedisct1/libsodium.git)

### 生成configure文件

```
   cd libsodium-stable
   ./autogen.sh -s
   #可以先用./autogen.sh -h查看使用说明;
```

### 选择合适的版本编译

```
cp ./dist-build/android-build.sh android-build.sh
cp ./dist-build/android-armv8-a.sh android-armv8-a.sh
chmod a+x android-build.sh
chmod a+x android-armv8-a.sh
./android-armv8-a.sh
```

如果编译过程中报错，需要clean，然后重新编译
make distclean
