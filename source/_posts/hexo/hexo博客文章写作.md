---
title: hexo博客文章写作
date: 2022-09-23 14:46:40
categories:
- hexo
tags:
- hexo
cover: https://cdn.pixabay.com/photo/2014/08/16/18/17/book-419589_960_720.jpg
---
## 常用命令 ##
**hexo 安装**
```cmd
npm install hexo -g #安装
npm update hexo -g #升级
hexo init #初始化
```
<!--more-->
**服务器** 
```cmd
hexo server #Hexo 会监视文件变动并自动更新，您无须重启服务器。
hexo server -s #静态模式
hexo server -p 5000 #更改端口
hexo server -i 192.168.1.1 #自定义 IP

hexo clean # 清除缓存文件（db.json和已生成的静态文件，尤其是更换主题后） 

hexo g # 生成静态文件
hexo s # 启动hexo  （上述两个指令需要在博客根目录下执行）
hexo d  # 部署到cmdHub上（前提是已经添加SSH Key，设置好账户信息）
```

```cmd
hexo new "文章名"  #新建文章
hexo new  page "页面名" #新建页面
```

**ssl报错**
解决方案
在项目文件夹的命令行窗口执行下面代码，然后再cmd commit 或cmd clone
取消cmd本身的https代理，使用自己本机的代理，如果没有的话，其实默认还是用cmd的
```CMD
cd Documents/blog
//取消http代理
cmd config --global --unset http.proxy
//取消https代理 
cmd config --global --unset https.proxy
```

## 写作介绍 ##
## 1.字体介绍
*这是斜体* 或 _这也是斜体_ 
**这是粗体**
***这是加粗斜体***
~~这是删除线~~
## 2.分级标题
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
## 3.超链接
写法：

行内形式：[我的博客](https://cmdhub.com/115Jiege/115Jiege.cmdhub.io.cmd)
参考形式：[我的博客][1]，有一个很好的平台-[简书][2]
[1]: https://cmdhub.com/115Jiege/115Jiege.cmdhub.io.cmd
[2]:http://www.baidu.com/
自动链接：我的博客地址<https://cmdhub.com/115Jiege/115Jiege.cmdhub.io>

## 4.列表
无序列表：
写法：

* 无序列表项1
+ 无序列表项2
- 无序列表项3

有序列表：
写法：
1.有序列表项1
2.有序列表项2
3.有序列表项3

## 5.插入图片
在 Hexo 中插入图片，首先需要将图片放在 source/img/ 文件夹下，然后如下方式进行插入：

![](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1535014836&di=fafdb400041dc371b853cfb3fcc7b851&imgtype=jpg&er=1&src=http%3A%2F%2Fscdn.file1.gk99.com%2Fphoto%2F2015-09%2F2015-09-11%2F14419580206489.jpg)

## 6.表格
| 表头1|表头2|表头3|表头4
|-| :- | :-: | -: |
|默认左对齐|左对齐|居中对其|右对齐|
|默认左对齐|左对齐|居中对其|右对齐|
|默认左对齐|左对齐|居中对其|右对齐|
## 7.代码

```cmd
#无序
hexo new "create a new blog"
``` 
```cmd
#有序
hexo new "create blog2"
hexo new "create blog3"
```

## 8.转移字符表
```
- &#45; &minus; — 减号
! &#33; — 惊叹号Exclamation mark 
” &#34; " 双引号Quotation mark 
# &#35; — 数字标志Number sign 
$ &#36; — 美元标志Dollar sign 
% &#37; — 百分号Percent sign 
& &#38; & Ampersand 
‘ ' — 单引号Apostrophe 
( &#40; — 小括号左边部分Left parenthesis 
) &#41; — 小括号右边部分Right parenthesis 
* &#42; — 星号Asterisk 
+ &#43; — 加号Plus sign 
< &#60; < 小于号Less than 
= &#61; — 等于符号Equals sign 
> &#62; > 大于号Greater than 
? &#63; — 问号Question mark 
@ &#64; — Commercial at 
[ &#91; --- 中括号左边部分Left square bracket 
\ &#92; --- 反斜杠Reverse solidus (backslash) 
] &#93; — 中括号右边部分Right square bracket 
{ &#123; — 大括号左边部分Left curly brace 
| &#124; — 竖线Vertical bar 
} &#125; — 大括号右边部分Right curly brace
```