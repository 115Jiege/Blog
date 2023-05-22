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

开发工具：qt5.15.2

### 准备

需要准备两个脚本文件，

ldd.sh：在当前目录下新建lib文件夹，拷贝目标程序的依赖库，存放到新建的lib下；

mytest.sh：用于执行程序，要和生成的可执行程序同名

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
