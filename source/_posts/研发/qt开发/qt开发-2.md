---
categories:
- 研发
cover: https://cdn.pixabay.com/photo/2017/05/09/13/33/laptop-2298286_960_720.png
date: '2023-03-03 13:23:55'
tags:
- qt开发
title: qt开发-鼠标事件与进程
updated: Sun, 23 Apr 2023 02:04:55 GMT
---
继续学习qt开发，学习一下事件和进程，想做点花里胡哨的~~

## 事件过滤器

例：源码 src/06/6-2/myevent
mylineedit.cpp定义函数,MyLineEdit的evebt()函数中使用了QEvent的type()函数获取事件类型，如果是键盘按下事件QEvent::KeyPress则输出信息。
（event()函数返回bool型操作结果）

```CPP
bool MyLineEdit::event(QEvent *event)  // 事件
{
   if(event->type() == QEvent::KeyPress)
      qDebug() << tr("MyLineEdit的event()函数");
   return QLineEdit::event(event);   // 执行QLineEdit类event()函数的默认操作
}
```

widget.cpp添加事件过滤器函数定义

```CPP
bool Widget::eventFilter(QObject *obj, QEvent *event) // 事件过滤器
{
   if(obj == lineEdit){           // 如果是lineEdit部件上的事件
      if(event->type() == QEvent::KeyPress)
         qDebug() << tr("Widget的事件过滤器");
   }
   return QWidget::eventFilter(obj, event);
}
```

在事件过滤器中，先判断事件的对象是不是lineEdit，是则判断事件类型，最后返回QWidget默认的事件过滤器的执行结果。
运行结果:"Widget的事件过滤器" "MyLineEdit的event()函数" "MyLineEdit键盘按下事件" "Widget键盘按下事件";

事件的传递顺序:
（Widget窗口启动，声明MyLineEdit类对象lineEdit，移动位置到坐标(100,100),在Widget上为lineEdit安装事件过滤器)
事件进入事件过滤器(Widget部件)，判断事件的对象是不是lineEdit，是则判断事件类型；判断是否为键盘按下事件，返回事件过滤器执行结果；
进入焦点部件(lineEdit部件)的event(),获取事件类型，如果是键盘按下事件QEvent::KeyPress则输出信息，返回event操作结果;
进入焦点部件的事件处理函数(keyPressEvent)，如果焦点部件忽略了该事件("event->ignore();")，则执行父部件的事件处理函数。

## 鼠标事件和滚轮事件

### 鼠标事件

QMouseEvent类用来表示一个鼠标事件，QWheelEvent类用来表示鼠标滚轮事件。
例：源码 src/06/6-3/myevent

```CPP
   QCursor cursor;                 // 创建光标对象
   cursor.setShape(Qt::OpenHandCursor); // 设置光标形状
   setCursor(cursor);               // 使用光标
```

鼠标指针进入窗口后改为小手形状;

#### 鼠标按压事件

```CPP
void Widget::mousePressEvent(QMouseEvent *event) // 鼠标按下事件
{
   if(event->button() == Qt::LeftButton){      // 如果是鼠标左键按下
      QCursor cursor;
      cursor.setShape(Qt::PointingHandCursor);
      QApplication::setOverrideCursor(cursor); // 使鼠标指针暂时改变形状
      offset = event->globalPos() - pos();   //获取指针位置(x1,y1)和窗口位置(a1,b1)的差值
      //offset = event->pos();
   }
   else if(event->button() == Qt::RightButton){ // 如果是鼠标右键按下
      QCursor cursor(QPixmap("../mymouseevent/logo.png"));
      QApplication::setOverrideCursor(cursor);// 使用自定义的图片作为鼠标指针
   }
}
```

这里使用globalPos()函数获取鼠标指针位置(在桌面上的位置)，还可以使用QMouseEvent类的pos()函数获取鼠标指针在窗口中的位置;
("offset = event->pos();")

#### 鼠标释放事件

```CPP
void Widget::mouseReleaseEvent(QMouseEvent *event) // 鼠标释放事件
{
   Q_UNUSED(event);
   QApplication::restoreOverrideCursor();       // 恢复鼠标指针形状
}
```

这里使用了restoreOverrideCursor()函数恢复鼠标形状，restoreOverrideCursor()函数要和setOverrideCursor()函数配合使用，不然event的参数没有使用到，编译时会出现警告。
使用`Q_UNUSED(event);`语句可以防止警告。

#### 鼠标移动事件

```CPP
void Widget::mouseMoveEvent(QMouseEvent *event) // 鼠标移动事件
{
   if(event->buttons() & Qt::LeftButton){     // 这里必须使用buttons()
      QPoint temp;
      temp = event->globalPos() - offset;
      move(temp);// 使用鼠标指针当前的位置(x2,y2)减去差值，就得到了窗口应该移动的位置(x2-x1+a1,y2-y1+b1)
   }
}
```

鼠标移动时会检测所有按下的键，此时QMouseEvent的button()函数无法获取被按下的按键；
所以使用buttons()函数获取所有按下的键，并与 Qt::LeftButton进行按位与的方法，判断目前鼠标的联合状态中是否包含了鼠标左键。

如果想不按鼠标按键，也可以获取鼠标移动事件，可以添加代码`setMouseTracking(true);`
需要注意：
单独一个widgt如果mouseMove不执行需要设置setMouseTracking(true);
如果有子窗口，需要子窗口也设置setMouseTracking(true),否则子窗口区域捕获不到鼠标移动;
子窗口重写了mouseMoveEvent，需要在函数结尾调用父类的mosueMoveEvent，不然会在子窗口被截获;
对于一些特殊的窗口本身就带好几层窗口，需要把每一层都设置setMouseTracking(true);

#### 鼠标双击事件

```CPP
void Widget::mouseDoubleClickEvent(QMouseEvent *event) // 鼠标双击事件
{
   if(event->button() == Qt::LeftButton){          // 如果是鼠标左键按下
      if(windowState() != Qt::WindowFullScreen)     // 如果现在不是全屏
         setWindowState(Qt::WindowFullScreen);     // 将窗口设置为全屏
      else setWindowState(Qt::WindowNoState);      // 否则恢复以前的大小
   }
}
```

#### 鼠标滚轮事件

```CPP
void Widget::wheelEvent(QWheelEvent *event)   // 滚轮事件
{
   if(event->delta() > 0){               // 当滚轮远离使用者时
      ui->textEdit->zoomIn();            // 进行放大
   }else{                            // 当滚轮向使用者方向旋转时
      ui->textEdit->zoomOut();            // 进行缩小
   }
}
```

使用QWheelEvent类delta()函数获取滚轮的距离，每当滚轮旋转一下，默认是15°。当滚轮向使用者方向旋转时，返回正值；当滚轮远离使用者时，返回负值。

## 进程的运行

### 进程的运行过程

1)使用start()函数启动一个进程，参数是程序名称和使用的命令行参数;
2)执行完start()函数后，OProcess进入Starting状态;程序已经运行后，OProcess进入Running状态并发射started()信号；
3)进程退出后，QProcess重新进入NoTRunning状态(初始状态)并发射finished信号。发射的finished信号提供了程序的推出代码和退出状态，使用exitCode()和exitStatus()获取。
4)任何时间发生了错误，QProcess都会发射error()信号，调用errot()查看错误类型和上次发生的错误,使用staus()查看当前进程的状态。

QProcess允许将一个进程视为一个顺序I/O设备，允许读写进程。调用write()写入输入，调用read()、readLine()、getChar()等读取输出。
*QProcess继承自QIODevice，可以作为QXmlReader的数据源，或者为QNetworkAccessManager产生用于上传的数据。*

### 示例

例：源码 src/19/19-1/myprocess
//启动进程
mainwindow.h中添加私有对象QProcess myprocess;
在按钮的单击信号槽调用进程启动函数;

```CPP
void MainWindow::on_pushButton_clicked()
{
    myProcess.start("netstat -ntlp");
}
```

process.start()的使用


| Tittle1                     | Tittle2 | Tittle3 |
| :-------------------------- | :-----: | ------: |
| Content                     | Content | Content |
| Content                     | Content | Content |
| //关联QProcess信号          |        |         |
| mainwindow.h添加私有槽说明; |        |         |

```CPP
    void showResult();
    void showState(QProcess::ProcessState);
    void showError();
    void showFinished(int,QProcess::ExitStatus);
```

mainwindow.cpp添加信号和槽的关联;
