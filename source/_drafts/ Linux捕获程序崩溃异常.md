---
categories: []
cover: ''
date: '2023-05-08 15:58:08'
tags: []
title: ' Linux捕获程序崩溃异常——qbreakpad'
updated: Mon, 08 May 2023 08:54:24 GMT
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

构建成功后，会在`qBreakpad/handler` 目录下生成`libqBreakpad.a`文件，保存目录下的头文件`QBreakpadHandler.h、QBreakpadHttpUploader.h、singletone/call_once.h、singletone/singleton.h`。

## 调用qBreakpad

在自己的qt工程(qbreakpadTest)下新建qBreakpad目录，将`libqBreakpad.a`拷贝至，`qBreakpad\lib\`目录下；

将调用库所需的头文件`QBreakpadHandler.h、QBreakpadHttpUploader.h、call_once.h、singleton.h`共4个文件拷贝至`qBreakpad\include`下。

在qbreakTest.pro下增加以下内容：

```properties
############ for qBreakpad ############
# qBreakpad中需要使用到network模块
QT += network

# 启用多线程、异常、RTTI、STL支持
CONFIG += thread exceptions rtti stl

# without c++11 & AppKit library compiler can't solve address for symbols
CONFIG += c++11
macx: LIBS += -framework AppKit

# 配置头文件搜索路径和链接库路径
unix:!macx: LIBS += -L$$PWD/qBreakpad/lib/ -lqBreakpad

INCLUDEPATH += $$PWD/qBreakpad/include
DEPENDPATH += $$PWD/qBreakpad/include

unix:!macx: PRE_TARGETDEPS += $$PWD/qBreakpad/lib/libqBreakpad.a

############ for qBreakpad ############

```

在main.cpp中添加

` QBreakpadInstance.setDumpPath("crashes"); // 设置生成dump文件路径`

崩溃示例：

```cpp
void qBreakpadTest::on_pushButton_clicked()
{
    QLabel * label = nullptr;
    label->setText("crash");
}

```

编译，运行程序，生成的`dump`文件存放在`Debug/crashes`目录下。

## 编译breakpad

`Breakpad`为我们提供了两个工具`dump_syms`和`minidump_stackwalk`，我们将用他们来分析`dump`，定位`bug`。

下载`Breakpad`源码，将`LSS(linux-syscall-support)`源码拷贝至`breakpad\src\third_party`目录下，并重命名为lss；

```bash
cd breakpad
chmod 755 configure
./configure
sudo make
sudo make install
```

编译完成后，在`breakpad/src/tools/linux/dump_syms`目录下，生成了`dump_syms`；

在`breakpad/src/processor`目录下，生成了`minidump_stackwalk`。
