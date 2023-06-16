---
categories:
- 平台-Linux
cover: https://cdn.pixabay.com/photo/2017/05/09/13/33/laptop-2298286_960_720.png
date: '2023-05-22T14:37:02.066365+08:00'
tags:
- qt
- linuxdeployqt
title: linux平台打包qt应用程序
updated: 2023-5-22T14:40:0.130+8:0
---

最近在做Linux平台的Qt开发，功能基本实现之后，就要考虑应用程序的打包了。

## LINUX打包步骤

### 环境

os：ubuntu 20.04

开发工具：qt5.15.2(默认安装目录/opt/Qt)

### linuxdeployqt打包

linux平台打包qt可以用linuxdeployqt一键部署，不用担心会少了什么，推荐先使用这个方法！

1. 下载
   [Download linuxdeployqt](https://github.com/probonopd/linuxdeployqt/releases)
   下载编译好的linuxdeployqt应用程序，我这里用的是linuxdeployqt-continuous-x86_64.AppImage，或者也可以下载源码创建linuxdeployqt docker版。

2. 安装
   
   ```bash
   chmod +x linuxdeployqt-5-x86_64.AppImage
   cp linuxdeployqt-5-x86_64.AppImage /usr/local/bin/linuxdeployqt
   ```

3. 添加环境变量
   
   ```bash
   # QT_HOME是自己安装的路径
   export QT_HOME=/opt/Qt/5.15.2/gcc_64  #修改QT_HOME
   export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:${QT_HOME}/lib
   export QT_PLUGIN_PATH=$QT_PLUGIN_PATH:${QT_HOME}/plugins
   export QML2_IMPORT_PATH=$QML2_IMPORT_PATH:${QT_HOME}/qml
   PATH=$PATH:${QT_HOME}/bin
   ```

4. 打包qt程序
   编译Release版本的目标程序，执行linuxdeployqt。
   
   ```bash
   # linuxdeployqt 程序名称 -appimage -always-overwrite
   linuxdeployqt VPNClient_Web -appimage -always-overwrite
   ```

5. 运行打包好的程序
   运行linuxdeployqt中生成的AppRun程序。

### 自制脚本打包

当然linuxdeployqt可能会拷贝不全，从而导致程序运行出错。
比如对含有QtWebEngine的程序，使用linuxdeployqt一键打包，运行时出现缺少libsoftokn3.so库、缺少libmozsqlite3.so库等错误。
根本原因就是缺少了需要的nss，这时需要手动把nss目录下的所有文件拷贝到linuxdeployqt生成的lib文件夹下。
这时可以寄几制作打包脚本，运行脚本一键打包，不过脚本的制作需要考虑全面，可能比较复杂，可以对比两种方式实现打包。

#### 准备ldd.sh

`ldd.sh`：在当前目录下新建lib文件夹，拷贝目标程序的依赖库，存放到新建的lib下。

```bash
chmod 777 ldd.sh
```
#### 制作打包脚本（copy_lib.sh）

1. 变量设置

   设置QT安装路径 QT_HOME= 

   设置目标文件夹 target_dir=

   设置应用程序命 appname=

2. 添加目标程序
   将目标程序(mytest)、ldd.sh 和它的依赖库拷贝到目标文件夹。

   ```bash
   cp mytest $target_dir
   cp ldd.sh $target_dir
   ```

3. 添加程序依赖

   ```bash
   ./ldd.sh mytest
   ```
   会在目标文件夹下生成lib目录，存放程序的依赖库。

4. 添加qt依赖
   创建plugins目录，拷贝qt的platfroms文件夹到目标文件夹的plugins目录;对platforms目录下的libqxcb.so生成qt依赖库。

   ```bash
   mkdir plugins
   cp -r $QT_HOME/plugins/platforms  $target_dir/plugins
   cd $target_dir/plugins/platforms
   ./ldd.sh libqxcb.so
   ```

   拷贝platfroms/lib目录下的所有文件到目标文件夹的lib目录，删除lib目录和目标文件夹中的ldd.sh文件。
   
   ```bash
   cp $target_dir/platforms/lib/* $target_dir/lib
   rm -r $target_dir/platforms/lib
   rm $target_dir/ldd.sh
   ```

5. 添加XCB

   拷贝qt的xcbglintegrations目录到目标文件夹的plugins目录；
   
   ```bash
   cp -r $QT_HOME/plugins/xcbglintegrations  $target_dir/plugins
   ```

4. （可选）拷贝WebEngine依赖

   如果项目工程里用到了QtWebEngine插件，那么为了WebEngine的正常运行，还需要拷贝其他依赖库。

   1) 添加QtWebEngine程序

   目标文件夹下新建libexec目录，拷qt的QtWebEngineProcess程序到libexec目录下。
   
   ```bash
   cd  $target_dir
   mkdir libexec
   cp $QT_HOME/libexec/QtWebEngineProcess $target_dir/libexec/
   ```

2) 拷贝插件
   拷贝qt目录的bearer、imageformats、platforminputcontexts、platformthemes拷贝到目标文件夹的plugins目录下。
   
   ```bash
   cp -r $QT_HOME/plugins/bearer $target_dir/plugins/
   cp -r $QT_HOME/plugins/imageformats $target_dir/plugins/
   cp -r $QT_HOME/plugins/platforminputcontexts $target_dir/plugins/
   cp -r $QT_HOME/plugins/platformthemes $target_dir/plugins/
   ```

3) 拷贝资源文件
   拷贝qt的resources目录到目标文件夹。
   ```bash
   cp -r $QT_HOME/resources $target_dir
   ```

4) 拷贝翻译文件
   拷贝qt的translations目录到目标文件夹；
   ```bash
   cp -r $QT_HOME/translations $target_dir
   ```

5) 添加nss
   拷贝系统的nss文件夹下所有文件到到目标文件夹的lib目录；
   ```bash
   nss_path=`find /usr/ -name nss`
   cp $nss_path/* $target_dir/lib
   ```

#### 制作运行脚本

   打包好的程序怎么执行呢？

   解压压缩包，sudo执行mytest.sh。

   ```bash
   sudo ./mytest.sh
   ```

### 脚本示例：
源码模板
1. ldd.sh

   ```bash
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

2. 运行脚本mytest.sh(与可执行程序同名)

   ```bash
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