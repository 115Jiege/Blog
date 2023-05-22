---
categories:
- - 研发
cover: https://cdn.pixabay.com/photo/2017/05/09/13/33/laptop-2298286_960_720.png
date: '2023-05-22T14:37:02.066365+08:00'
tags:
- qt
title: linux平台打包qt应用程序
updated: 2023-5-22T14:40:0.130+8:0
---
最近在做Linux平台的Qt开发，功能基本实现之后，就要考虑应用程序的打包了。

## LINUX打包步骤

### 环境

os：ubuntu 20.04

开发工具：qt5.15.2(默认安装目录/opt/Qt)

### 准备

需要准备两个脚本文件，

ldd.sh：在当前目录下新建lib文件夹，拷贝目标程序的依赖库，存放到新建的lib下；

mytest.sh：用于执行程序，要和生成的可执行程序同名;

```bash
chmod 777 ldd.sh
chmod 777 mytest.sh
```

准备目标文件夹(MyTest)：

```bash
mkdir MyTest
```

下面给出源码模板

**ldd.sh**

```cpp
#!/bin/bash
LibDir=$PWD"/lib"
Target=$1
lib_array=($(ldd $Target | grep -o "/.*" | grep -o "/.*/[^[:space:]]*"))
$(mkdir $LibDir)
for Variable in ${lib_array[@]}
do
    cp "$Variable" $LibDir
done
```

mytest.sh

```cpp
#!/bin/bash
appname=`basename $0 | sed s,\.sh$,,`
dirname=`dirname $0`
tmp="${dirname#?}"
if [ "${dirname%$tmp}" != "/" ]; then
dirname=$PWD/$dirname
fi
LD_LIBRARY_PATH=$dirname
export LD_LIBRARY_PATH
$dirname/$appname "$@" 
```

### 添加程序依赖

1)项目工程(mytest)编译Release版本，拷贝ldd.sh到build-mytest-Desktop_Qt_5_15_2_GCC_64bit-Release下，执行ldd.sh；

```bash
./ldd.sh mytest
```

2)拷贝lib目录下的全部文件到MyTest，删除lib文件夹和ldd.sh文件；

拷贝可执行程序mytest和脚本mytest.sh到MyTest；

### 添加qt依赖

拷贝ldd.sh到qt的platfroms文件夹下；

```bash
cp ldd.sh /opt/Qt/5.15.2/gcc_64/plugins/platforms/
cd /opt/Qt/5.15.2/gcc_64/plugins/platforms/
./ldd.sh libqxcb.so
```

拷贝/opt/Qt/5.15.2/gcc\_64/plugins/platforms/lib目录下的所有文件到MyTest，删除lib和ldd.sh；

拷贝/opt/Qt/5.15.2/gcc\_64/plugins/platforms文件夹到MyTest；

### 拷贝WebEngine依赖（可选）

如果项目工程里用到了QtWebEngine插件，那么为了WebEngine的正常运行，还需要拷贝其他依赖库;

#### 添加nss

拷贝/usr/lib/x86\_64-linux-gnu/nss文件夹到MyTest；

#### 添加XCB

拷贝/opt/Qt/5.15.2/gcc\_64/plugins/xcbglintegrations文件夹到MyTest；

#### 添加QtWebEngine程序

拷贝/opt/Qt/5.15.2/gcc\_64/libexec/QtWebEngineProcess程序到MyTest；

拷贝/opt/Qt/5.15.2/gcc\_64/resources下所有文件到MyTest，并拷贝/opt/Qt/5.15.2/gcc\_64/resources整个文件夹到MyTest；

拷贝/opt/Qt/5.15.2/gcc\_64/translations文件夹到MyTest；

打包MyTest。

## 打包程序执行

打包好的程序怎么执行呢？

解压压缩包

sudo执行mytest.sh

```bash
sudo ./mytest.sh
```
