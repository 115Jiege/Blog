---
categories: []
cover: ''
date: '2023-05-08 15:58:08'
tags: []
title: ' Linux捕获程序崩溃异常——qbreakpad'
updated: Mon, 08 May 2023 07:58:09 GMT
---
在进行Linux平台的qt程序开发时，出现程序崩溃退出的情况，而且没有什么信息(ˉ▽ˉ；)...。

bing了一下发现一个可以定位崩溃位置的工具qbreakpad，这里记录一下qbreakpad的安装过程。

# qbreakpad的安装过程

## 源码准备

### 下载Breakpad源码

[下载地址](https://github.com/google/breakpad)

建议选择tags=**v2021.08.09**

### 下载LSS源码

[下载地址](https://github.com/ithaibo/linux-syscall-support) 需要注意，如果您的gcc版本高于9.0，在构建breakpad时可能会报错：

`linux\_syscall\_support.h: error: listing the stack pointer register 'rsp' in a clobber list is deprecated`

解决：更换修正版lss

[下载地址](https://chromium.googlesource.com/linux-syscall-support/+/8048ece6c16c91acfe0d36d1d3cc0890ab6e945c)

### 下载qBreakpad源码

[下载地址](https://github.com/buzzySmile/qBreakpad)

## 编译qBreakpad

下载qBreakpad源码，在`qBreakpad/third_party`目录下，把下载好的LSS源码和Breakpad源码放入其中；修改文件夹名为lss和breakpad;

用qtcreator打开qBreakpad.pro，直接构建；

构建成功后，会在`qBreakpad/handler` 目录下生成`libqBreakpad.a`文件

## 调用qBreakpad
