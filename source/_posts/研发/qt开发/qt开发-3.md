---
categories:
- 研发
cover: https://cdn.pixabay.com/photo/2017/05/09/13/33/laptop-2298286_960_720.png
date: '2023-03-06 09:20:24'
tags:
- qt开发
title: qt开发-信号槽和样式表
updated: Sun, 23 Apr 2023 02:05:26 GMT
---
最近使用按钮很多，本节学习一下按钮的一些用法。

## 信号槽

### 信号和槽

信号和槽都是函数，对于一个窗口中的按钮，我们期望实现点击按钮后可以调用某个函数，此时就用到了信号槽。

例：src/03/3-4
**目标**
单击按钮弹出对话框。

**实现**
ui界面添加Push Button(start、stop)，修改窗口类属性名;

头文件添加槽声明:

```CPP
   public slots:
    void showconn();
    void showdisconn();
```

cpp添加槽的实现:

```CPP
    QLabel *label = new QLabel();
    label->setText(QObject::tr("Connect."));
    label->resize(200,100);
    label->show();
```

更改窗口构造函数:
"connect(ui->startButton, &QPushButton::clicked,this, &MyWidget::showconn);"
//使用connect()函数将单击信号clicked()与新建的槽进行关联,参数(发射信号的对象，发射的信号，接收信号的对象，要执行的槽);

### 自定义对话框

**未完**

## 样式

### Qt样式表语法

Qt样式表的术语和语法规则和HTML CSS基本相同，可以通过The Style Sheet Syntax关键字在帮助中查看详细讲解。

#### 样式规则

样式规则由选择器和声明组成，选择器指明了受该规则影响的部件，声明指明了这个部件上要设置的属性。
eg:"QPushButton{color:red}"
QPushButton是选择器，{color:red}是声明，其中，color是属性，red是值。这套规则适用于QpushButton和其子类。
值得注意的是，Qt样式表中一般不区分大小写，这又类名、对象名、Qt属性名是区分大小写的。

不同的选择器可以指定相同的声明;
eg:"QPushButton,QLabel,QComboBox{color:green}"

同一的选择器可以指定不同的声明;
eg:"QPushButton{color:red,background-color:white)"

Qt支持的所有属性在关键字Qt Syntax Sheet Reference对应的帮助文档List of Properties中查看。

#### 选择器类型

Qt样式表支持CSS2中定义的所有选择器:


| 选择器     | 示例                                    | 说明                                      |
| :--------- | :-------------------------------------- | :---------------------------------------- |
| 通用选择器 | &#42;                                   | 匹配所有部件                              |
| 类型选择器 | QPushButton                             | 匹配QPusButton实例和其子类                |
| 属性选择器 | QPushButton&#91;checkable = "true"&#93; | 匹配QPusButton的属性checkable为true的实例 |
| 类选择器   | .QPushButton                            | 匹配所有QPushButton实例，但不包含其子类   |
| ID选择类   | QPushButton&#35;startButton             | 匹配QPusButton中对象名为startButton的实例 |
| 后代选择器 | QWidget QPushButton                     | 匹配所有QWidget中的QPushButton子孙部件    |
| 孩子选择器 | QWidget&#62;QPushButton                 | 匹配所有QWidget中的QPushButton直接子部件  |

#### 子控件

选择器可以包含子空间来对部件的特定子控件应用规则;
eg:
"QComboBox::drop=down{image:url(drown.png)}"
为QComboBox的下拉按钮设置图片。

#### 伪状态

选择器可以包含伪状态来限制规则在部件的指定状态上应用。
eg:
"QPushButton:hover{color:white}";		//鼠标悬停在按钮上时设置按钮颜色为白色
"QPushButton:checked{color:green}";		//按钮选中时设置其颜色未绿色
"QPushButton:hover:!checked{color:pink}"; //鼠标悬停并且按钮未选中时设置其颜色为粉色

#### 冲突解决

不同的样式对相同的属性规则指定了不同的值会发生冲突;
eg:
"QPushButton:{color:white}";
"QPushButton# startButton{color:pink}";
解决冲突的原则：特殊的选择器优先，Qt样式表使用CSS2规范来确定规则的特殊性;
有伪状态比没有伪状态的优先;如果两个选择器特殊性相同则后面出现的比前面的有限;部件的样式优先于继承的样式表。

#### 继承

使用Qt样式表时，部件不会自动从父部件继承字体和颜色设置。
eg:
"qApp->setStyleSheet("qGroupBox{color:pink})"    //这里QGroupBox的子部件QPushButton不会继承样式，颜色仍然是默认色。

可以添加不同类型的选择器，实现样式继承。
eg:
"qApp-setStyleSheet("qGroupBox, .QComboBox &#42; {color:pink}) "  //这里QGroupBox的所有子部件都会继承样式

#### 设置QObject属性

可以使用"qproperty-属性名"设置样式表;
eg:
"Mylabel {qproperty-titleColor: rgb(100,200,100);}"

### 自定义部件外观

#### 盒子模型

每个部件都可以看作是由内容(content)、填衬(padding)、边框(bordor)、边距(margin)组成的盒子，默认下，padding、bordor、margin值为0;
使用background-image指定部件的背景时，默认background-image只在border以内的区域内绘制，可以通过修改backgroung-clip属性更改;

可以通过修改background-repeat属性，实现用一个比较小的图案重复铺满整个背景;其中，background-origin属性可以指定背景重复的原点;

background-image不能随部件大小自动缩放，使用border-image实现背景图片随部件大小自动缩放;
同时指定了background-image和border-image，会使得border-image绘制在background-image上;

使用的图片和指定部件大小不匹配时，图片不会平铺或拉伸，可以使用image-position属性设置图片位置。
#### 自定义部件样式

将要使用的资源文件(js、image、video etc)添加到项目文件中,添加Qt资源文件(add New->Qt Resource File)，添加前缀(add Perfix)"/image",添加项目文件下的资源。


**未完**
### 3. 布局管理
