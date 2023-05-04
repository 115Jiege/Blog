---
categories: []
cover: ''
date: '2023-05-04 16:33:56'
tags: []
title: qtcreator的安装与常见问题
updated: Thu, 04 May 2023 08:33:57 GMT
---
### qtcreator安装

```bash
sudo apt-get install build-essential
```

#### apt-get安装

[参考文章](https://blog.csdn.net/weixin_48560325/article/details/124373125)

#### 在线安装

[Download Qt: Get Qt Online Installer](https://www.qt.io/download-qt-installer)

双击在线安装

没有账户的话需要注册

安装目录(/opt/Qt)

创建快捷方式:

```bash
ln -s /opt/Qt/Tools/QtCreator/bin/qtcreator /usr/bin/qtcreator
```

创建桌面文件：

cp /opt/Qt/Tools/QtCreator/share/applications/org.qt-project.qtcreator.desktop /usr/share/applications/org.qt-project.qtcreator.desktop

#### pro文件报错

/opt/Qt/5.15.2/gcc_64/include/QtGui/qopengl.h:141:13: fatal error: GL/gl.h: No such file or directory
141 | #   include <GL/gl.h>
|             ^~~~~~~~~

解决：

```bash
sudo apt-get install mesa-common-dev
```
