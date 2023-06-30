---
categories:
- - tips整理
cover: ''
date: '2023-06-30T15:40:10.601658+08:00'
tags:
- 踩坑
title: github拉取上传失败的解决
updated: 2023-6-30T15:40:13.351+8:0
---
今天久违的更新一下国密，结果push的时候提示`could not find UI helper 'GitHub.UI'`，并且卡死在这里。

bing了一下，两种原因；

### 1.缺少凭据

打开控制面板->用户账户->凭据管理器->管理Windows凭据；

添加普通凭据，

地址输入[https://gitee.com/](https://gitee.com/ "https://gitee.com/")，或者你的github地址，填写用户名密码。

### 2.已配置其他凭据

就像我。凭据是已经配置了的，但是！！我的git全局配置居然设了另一个凭据。

(git config --list可以查看当前git目录的配置)

```bash
git-credential-manager configure

git-credential-manager get
```

然后就有登录页面辣！重登就好~

### 终极解决方法

安装github Desktop！！！
