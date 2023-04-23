---
categories: []
cover: https://cdn.pixabay.com/photo/2017/05/09/13/33/laptop-2298286_960_720.png
date: '2023-04-23 10:18:34'
tags: []
title: ''
updated: Sun, 23 Apr 2023 02:25:21 GMT
---
Windows的qt壳子移植到linux上

qt获取屏幕分辨率

```
//获取主屏分辨率 
QRect mRect； 
mRect = QGuiApplication::primaryScreen()->geometry(); 
qDebug()<<"width:"<<mRect.width()<<"  height:"<<mRect.height();
```

.获取多个显示器屏幕大小

```cpp
// 获取多显示器,通过list存储当前主机所有显示器 
QList<QScreen *> list_screen = QGuiApplication::screens(); 
// 通过循环可以遍历每个显示器 
for (int i = 0; i < list_screen.size(); i++) 
{ 
    QRect rect = list_screen.at(i)->geometry(); 
    int desktop_width = rect.width(); 
    int desktop_height = rect.height(); 
    // 打印屏幕分辨率 
    qDebug() << desktop_width <<desktop_height; 
} 
```

error：

libQt5WebEngineCore.so: .dynsym local [symbol](https://so.csdn.net/so/search?q=symbol&spm=1001.2101.3001.7020) at index 3

解决：sudo ln -sf /usr/bin/x86\_64-linux-gnu-ld.gold /usr/bin/ld
