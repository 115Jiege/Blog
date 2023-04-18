---
abbrlink: ''
categories:
- 研发
cover: https://cdn.pixabay.com/photo/2017/01/11/08/31/icon-1971128__340.png
date: '2023-03-22 14:20:39'
tags:
- android开发
title: android从0开发（一）
updated: Tue, 18 Apr 2023 08:28:41 GMT
---
开发安卓平台(ˉ▽ˉ;)...
痛苦至极，踩了好多坑/(ㄒoㄒ)/~~

## 开发流程

对于在安卓平台的开发，考虑进行以下过程
1)安装依赖库
2)gmssl在安卓平台的安装
3)工程调用c++源码并进行调试
4)安卓程序细节调整
5)导出工程文件

## 环境配置

**开发环境**
Vmware workstation
ubuntu 22.04

**开发平台**
Android studio

**依赖库**
sodium
gmssl

**调试**
真机调试

## android studio安装

### 安装jdk：

```
   sudo apt-get update
   sudo apt-get upgrade
   sudo apt-get install default-jre
   sudo apt-get install default-jdk
```

Android studio的安装有以下三种方法(亲测)
法一：apt在线安装
法二：官网下载直接安装
法三：源码安装

### apt在线安装

终端输入以下命令;

```bash
   sudo add-apt-repository ppa:maarten-fonville/android-studio
   sudo apt update
   sudo apt install android-studio
```

如果报错缺少公钥，则"apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 问题提示的公钥";

添加快捷方式:
'sudo ln -s /opt/android-studio/bin/studio.sh /usr/bin/AndroidStudio'
在终端输入AndroidStudio或者在应用中点击图标都可以运行Android studio;

### 官网下载直接安装

安装jdk;

```bash
   sudo aapt-get update
   sudo apt-get upgrade
   sudo apt-get install default-jre
   sudo apt-get install default-jdk
```

[下载](https://developer.android.google.cn/studio/#downloads) 压缩包;

解压，sudo  ./studio.sh运行;

### 源码安装

```bash
   sudo wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2021.1.1.22/android-studio-2021.1.1.22-linux.tar.gz
```

*ps:如果是虚拟机安装，最好把运行内存和分配的磁盘空间大一点(eg:8G 60G),AndroidStudio太大了会卡。不建议使用双核，处理器数量增多可能导致VMware变卡。*

## 调试

本意是使用Android Studio自带的模拟器，但是很卡，这里使用真机调试

### 使用adb连接手机

当然除了使用模拟器外，还可以通过usb或者wifi连接实体机;

1)lsusb 查看usb;
"Bus 001 Device 022: ID xxxx:XXXX Google Inc. MI 8"

2)修改文件
sudo gedit /etc/udev/rules.d/51-android.rules
"SUBSYSTEM=="usb", ATTR{idVendor}=="xxxx", ATTRS{idProduct}=="XXXX", MODE="0666", GROUP="plugdev""

3)授权
sudo chmod a+rx /etc/udev/rules.d/51-android.rules

4)连接
sudo service udev restart
sudo udevadm trigger
adb kill-server
adb start-server
adb devices

总之，这样安卓模拟器就安装好了，

### 使用usb连接真机

虚拟机->可移动设备->连接；

打开Android Studio，可以看到真机在devices manager的physical device板块;

## sodium-android编译

由于多数真机的cpu架构是arm64-v8a，所以这里编译的是android-arm64-v8a的libsodium库~

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

### 下载项目：

[libsodium项目](https://github.com/jedisct1/libsodium.git)

### 生成configure文件

```
   cd libsodium
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

经过一系列操作，得到了一个文件夹"libsodium-XXX"，内含android版的libsodium.so;
接下来进行依赖库的调用。

## Android Studio调用so（C++层面）

首先打开Android studio，新建native c++工程;
第一次打开需要下载很多包，时间可能长一点，耐心等待(*^_^*)

### libsodium.so调用

打开native c++工程;填写NDK安装位置(File->Project Structures:Android NDK location);
如果输入框无法填写，则修改项目的local.properties文件"ndk.dir=/home/Android/Sdk/ndk/23.1.7779620"
在app/src/main下新建jniLibs，把第三方so库放入jniLibs;

**修改Cmakelist.txt**

```
add_library(sodium
        SHARED
        IMPORTED)
set_target_properties( sodium
        PROPERTIES IMPORTED_LOCATION
        ${PROJECT_SOURCE_DIR}/../jniLibs/libsodium.so)

target_link_libraries( # Specifies the target library.
        XXX

        # Links the target library to the log library
        # included in the NDK.
        sodium
        ${log-lib})
```

**修改app/build.gradle**
配置 ndk 指定 ABI

```
android {
    defaultConfig {
        ndk {
            abiFilters 'arm64-v8a'
        }

    }
}
```

通过这种方式，编译过后，将项目目录切换至Android试图，可以看到，app目录下多了一个jniLibs文件夹，里面包含了引入的so文件和jar包，表示集成成功。

奇奇怪怪，这种方式我在win10、ubuntu2004(VM虚拟机)、mint2001(VM虚拟机)的Android Studio上都试过，都是可行的;
但是ubuntu2204(virtualbox)上编译build.grade时出现了怪怪的警告,所以按照要求删除local.properties文件中的ndk.dir，在setting中添加ndk版本;

## Android C++开发

配置好依赖的so库之后，就可以调用写好的C++文件了;

### android studio调用C++文件

c++文件的导入很简单，将源文件和头文件放入文件夹app/src/main/cpp;

**修改Cmakelist**

```
add_library( # Sets the name of the library.
        XXX

        # Sets the library as a shared library.
        SHARED

        # Provides a relative path to your source file(s).
        native-lib.cpp#源文件)
include_directories(include#头文件位置)
```

### java 与 c++ 数据类型对应

Android下jni所用的数据结构和c++不同；需要进行转化;

**转化对应关系如下**


| c++                 | java              | 说明             |
| :------------------ | :---------------- | :--------------- |
| char                | byte              | 8位整数          |
| char&#42;           | String            | \0结尾的字符数组 |
| char&#42;&#42;      | String&#91; &#93; | 字符串数组       |
| short               | short             | 16位整数         |
| int                 | int               | 32位整数         |
| long long,_int64    | long              | 64位整数         |
| float               | float             | 32位浮点数       |
| double              | double            | 64位浮点数       |
| struct&#42;/struct  | Structure         | 结构体数据       |
| (&#42fp)&#91; &#93; | Callback          | 函数指针         |

此外，Android中使用char有大坑，Android下的char默认是unsigned char;
要想用char类型,得显式的定义为 singed char c = -1.

开发目标：实现页面添加一个按钮，点击后进行连接，可实现函数某些功能等，再次点击则断开连接;
这里需要编写java活动，下一章再搞！
