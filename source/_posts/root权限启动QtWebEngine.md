---
categories:
- - 研发
cover: https://cdn.pixabay.com/photo/2017/05/09/13/33/laptop-2298286_960_720.png
date: '2023-05-22T15:12:45.668815+08:00'
tags:
- qt
title: root权限启动QtWebEngine
updated: 2023-5-22T15:24:39.544+8:0
---
QtWebEngine这个部件用到了chrome的插件，众所周知，chrome不允许在root权限下启动，除非加上--no-sandbox；

所以这里的解决方案也是一样，选择无沙盒启动。

### Qt调试

对于以root权限在Qtcreator中调试含QtWebEngine的工程的情况，可以项目->运行->环境中添加一个新的变量

QTWEBENGINE_DISABLE_SANDBOX，并置其为1。

### 脚本启动

对于脚本启动则需要在脚本中添加

```bash
export XDG_RUNTIME_DIR=/tmp/runtime-root
export QTWEBENGINE_DISABLE_SANDBOX=1
```

### 自定义宏编译

题外话，在编译阶段，如果想根据宏的开关选择不同的链接库活着编译不同的代码，

可以在项目->构建->构建的步骤->qmake->额外的参数中添加'DEFINES+=XXX'(单引号不要漏掉)；

这样就可以在pro文件和工程其他文件中使用了。

```cpp
#ifdef XXX
 ......
#else
 ......
#endif
```
