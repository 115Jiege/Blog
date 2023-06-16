---
title: android-jni入门
date: 2023-02-24 14:54:55
categories:
- 平台-android
tags:
- android studio
cover: https://cdn.pixabay.com/photo/2019/04/04/15/17/smartphone-4103051_960_720.jpg
---
未完待续~
首先介绍一下Android studio生成的项目文件架构。
<!--more-->
## 简单项目架构
Android 项目文件:
	Gradle Script:显示项目的所有与构建相关的配置文件
	manifests:包含 AndroidManifest.xml 文件（应用清单概览）
	java:包含java源代码
	res:包含所有非代码资源（eg:XML布局，img等）
项目架构：
Test1
│  
└─app
    │  ├─build	#包含构建输出。
    │  │  
    │  ├─libs	#包含专用库。
    │  │  
    │  └─src	#包含相应模块在以下子目录中的所有代码和资源文件。
    │      ├─androidTest	#包含在 Android 设备上运行的插桩测试的代码。
    │      │                      
    │      ├─main	#包含“主”源代码集文件：所有 build 变体共享的 Android 代码和资源（其他 build 变体的文件位于同级目录中，例如调试 build 类型的文件位于 src/debug/ 中）
    │      │  │  AndroidManifest.xml	#描述应用及其各个组件的性质。
    │      │  │  
    │      │  ├─java	#包含 Java 源代码。
    │      │  │             
    │      │  ├─jni	#包含使用 Java 原生接口 (JNI) 的原生代码。(主要封装位置）
    │      │  │       
    │      │  ├─gen	#包含 Android Studio 生成的 Java 文件。
    │      │  │  
    │      │  ├─res	#包含应用资源，例如可绘制对象文件、布局文件和界面字符串。
    │      │  │  
    │      │  └─assets	#包含应按原样编译为 .apk 文件的文件。
    │      │              
    │      └─test	#包含在主机 JVM 上运行的本地测试代码。
    │                              
    └─build.gradle（模块）	#这定义了特定于模块的构建配置。
└─build.gradle（项目）  	#这定义了适用于所有模块的构建配置。

## 包含c、c++的Android项目              
向项目添加C、C++代码:
将C、C++代码放在项目模块的CPP目录中，java代码可以通过java原生接口(jni)调用原生库中的函数。
   步骤:
         1.下载 NDK 和构建工具;
	https://developer.android.google.cn/studio/projects/add-native-code?hl=zh-cn#download-ndk
         2.创建支持 C/C++ 的新项目
	https://developer.android.google.cn/studio/projects/add-native-code?hl=zh-cn#new-project

### JNI
  全名 Java Native Interface，是Java本地接口，JNI是Java调用Native 语言的一种特性，通过JNI可以使得Java与C/C++机型交互。
简单点说就是JNI是Java中调用C/C++的统称。
2.NDK 
  全名Native Develop Kit，官方说法：Android NDK 是一套允许您使用 C 和 C++ 等语言，以原生代码实现部分应用的工具集。
在开发某些类型的应用时，这有助于您重复使用以这些语言编写的代码库。

### Android Studio JNI开发 
   1.File->New->New Project 新建native C++项目；
   2.配置CMake、NDK环境：
   
  Tools->SDK Manager->SDK Tools下载:NDK(Side by side)、CMake、Android Emulator、Android SDK Platform-Tools等；
  打开File->Project Structure，配置SDK、NDK目录；
（notices:在SDK Manager中下载完NDK后，打开File->Project Structure->Android NDK location无法配置，无法选中修改；
  可能是NDK是存在本地的，Android studio本身没有下载导致的。
  尝试在local.properties 中手动添加本地ndk.dir路径。
  成功解决）
  
  3.实现在Android中调用c++代码：
  Android 中调用C/C++库的步骤：
  1）通过System.loadLibrary引入C代码库名；
  2）在cpp目录下的natice-lib.cpp中编写C/C++代码

