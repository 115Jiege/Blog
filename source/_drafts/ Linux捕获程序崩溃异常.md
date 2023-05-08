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

`Breakpad`提供了两个工具`dump_syms`和`minidump_stackwalk`，用于分析`dump`，定位`bug`。

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

## 使用dump\_syms和minidump\_stackwalk定位bug

### 1、生成符号文件

使用`dump_syms`读取带调试信息的程序文件，并生成符号文件`qBreakpadTest.sym`。

```bash
dump_syms ./qBreakpadTest > qBreakpadTest.sym
```

### 2、将符号文件移动到特定路径

在自己的qt工程(qBreakpadTest)所在目录下，创建目录结构：

* 第一级目录，固定为`symbols`；
* 第二级目录，为即将放入的`符号文件名称`，如`qBreakpadTest.sym`，则目录名为`qBreakpadTest`；
* 第三级目录，在sym文件中第一行内容，有一串`16进制`编号，将其作为`目录名`。

建立好以上路径后，将`qBreakpadTest.sym`移动到此路径下。

### 3、生成崩溃处调用堆栈信息

将`crashes目录`拷贝到和`symbols目录`一个级别目录下；

然后执行如下命令，生成调用堆栈信息：

```bash
minidump_stackwalk ./crashes/7211c8b8-126d-4de2-7f8f00a4-db86eecc.dmp ./symbols > error.log
```

第一个参数，是dump文件名；
第二个参数，固定为./symbols，应该是指定符号文件位于当前symbols目录下默认路径位置；
第三个参数，将命令执行结果，写入到error.log文件中。

查看生成的堆栈调用信息文件`error.log`，找到`“crashed”`字样，与它最近的一行，就是发生崩溃时，程序的调用堆栈。

### 4、dump文件上报

将生成的`dump`文件上传到指定的服务器。

* 先通过setDumpPath设置dump文件生成目录；以便在发生崩溃时，自动在该目录下生成dump文件。
* 再通过setUploadUrl设置上报地址，以便后续将dump文件，上传到该地址。
* 最后，通过sendDumps将dump文件发送至服务器。该函数会自动遍历，前面设置的dump生成目录，将每一个dump文件进行发送。

上报演示程序，位于`qBreakpad\demo\reporter`下。
