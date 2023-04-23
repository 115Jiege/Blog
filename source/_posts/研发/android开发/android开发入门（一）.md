---
categories:
- 研发
cover: https://cdn.pixabay.com/photo/2019/04/04/15/17/smartphone-4103051_960_720.jpg
date: '2023-03-31 08:20:32'
tags:
- android开发
title: android开发--活动的创建与使用
updated: Sun, 23 Apr 2023 02:03:15 GMT
---
本章学习Android中的活动，活动是一种可以包含用户界面的组件，主要用于和用户交互。

## 活动的基本用法

### 创建活动

#### 新建项目

打开Android Studio新建Android项目，选择no Activity，等待gradle构建;

#### 新建活动

右击 app/src/main/java/com.example.activitytest->New->Actvity->Empty Activity，创建活动FirstActivity，注意不勾选Generate Layout和Launcher Activity;
打开创建的FirstActivity，发现Android Studio自动完成了重写Activity的onCreate()方法，即调用父类的onCreate()方法:

```JAVA
   public class FirstActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }
}
```

### 创建布局

布局用于显示页面内容，最好每个活动对应一个布局;

#### 新建布局文件

右击app/src/main/res->New->Directory，新建layout文件夹；
右击layout->NeW->Layout resource file,创建first_layout布局文件，选择根元素为LinearLayout;
布局文件创建完成后，Android Studio会显示可视化布局编辑器(右上角可切换模式);

#### 编辑布局文件

编辑布局文件，添加一个按钮：

```XML
    <Button
        android:id="@+id/button_1"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginStart="150dp"
        android:layout_marginTop="200dp"
        android:layout_marginEnd="150dp"
        android:layout_marginBottom="400dp"
        android:text="START"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />
```

这里添加了一个Button元素，并增加了几个属性。
**id**
android:id为当前元素定义一个唯一标识符：在XML中引用一个id，使用@id/id_name;在XML中定义一个id，使用@+id/id_name;
**width、height**
android:layout_width、android:layout_height定义了元素的宽高，使用wrap_content表示当前元素的高度只要刚好能包含里面的内容;
**margin**
android:layout_marginStart、android:layout_marginTop、android:layout_marginEnd、android:layout_marginBottom定义了元素的位置;

layout_marginTop 指定该属性所在控件距上部最近控件的最小值;
layout_marginBottom 指定该属性所在控件距下部最近控件的最小值;
layout_marginLeft 指定该属性所在控件距左边最近控件的最小值;
layout_marginRight 指定该属性所在控件距右边最近控件的最小值;
layout_marginStart：如果在LTR布局模式下，该属性等同于layout_marginLeft。如果在RTL布局模式下，该属性等同于layout_marginRight。
layout_marginEnd：如果在LTR布局模式下，该属性等同于layout_marginRight。如果在RTL布局模式下，该属性等同于layout_marginLeft。
**text**
android:text制定了元素显示的文字内容;
**constraint**
控件在ConstraintLayout里面要实现margin，必须先约束该控件在ConstraintLayout里的位置;
app:layout_constraintBottom_toBottomOf、app:layout_constraintEnd_toEndOf、app:layout_constraintStart_toStartOf、app:layout_constraintTop_toTopOf约束元素在parent里的位置，使得margin生效。

> 约束布局ConstraintLayout是一个ViewGroup，可以在Api9以上的Android系统使用它，它的出现主要是为了解决布局嵌套过多的问题，以灵活的方式定位和调整小部件。
> 例如：首先是一个垂直的LinearLayout，里面放两个水平的LinearLayout，然后在水平的LinearLayout里面放TextView。这样的写法就嵌套了两层LinearLayout，可能会出现布局嵌套过多的问题，嵌套得越多，设备绘制视图所需的时间和计算功耗也就越多。
> ConstraintLayout横空出世，ConstraintLayout可以按照比例约束控件位置和尺寸，能够更好地适配屏幕大小不同的机型。

使用ConstraintLayout首先需要添加依赖，在build.gradle(app)中添加
implementation 'com.android.support.constraint:constraint-layout:1.1.3'

使用ConstraintLayout可以实现控件位置的控制:

布局文件中添加:

```XML
    <TextView
        android:id="@+id/TextView1"
        android:text="TextView1" />

    <TextView
        android:id="@+id/TextView2"
        app:layout_constraintLeft_toRightOf="@+id/TextView1" />
```
可以实现元素TextView2的相对定位，使用属性app:layout_constraintLeft_toRightOf="@+id/TextView1"，把TextView2的左边约束到TextView1的右边;

相对定位的常用属性：
layout_constraintLeft_toLeftOf
layout_constraintLeft_toRightOf
layout_constraintRight_toLeftOf
layout_constraintRight_toRightOf
layout_constraintTop_toTopOf
layout_constraintTop_toBottomOf
layout_constraintBottom_toTopOf
layout_constraintBottom_toBottomOf
layout_constraintBaseline_toBaselineOf
layout_constraintStart_toEndOf
layout_constraintStart_toStartOf
layout_constraintEnd_toStartOf
layout_constraintEnd_toEndOf
```XML
    <TextView
        android:id="@+id/TextView1"
		android:text="TextView1" />

    <TextView
        android:id="@+id/TextView2"
        app:layout_constraintCircle="@+id/TextView1"
        app:layout_constraintCircleAngle="60"
        app:layout_constraintCircleRadius="100dp" />
```
可以实现TextView2的角度定位，属性app:layout_constraintCircle="@+id/TextView1"确定中心为TextView1，属性app:layout_constraintCircleAngle="160"确定在TextView1的中心的60°，属性app:layout_constraintCircleRadius="100dp确定和TextView1距离为100dp;

```XML
<TextView
        android:id="@+id/TextView1"
        app:layout_constraintHorizontal_bias="0.618"
		app:layout_constraintVertical_bias="0.618"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent" />
```
可以实现TextView1的偏移，layout_constraintHorizontal_bias 水平偏移，layout_constraintVertical_bias 垂直偏移;此外，constraint还可以实现更多更复杂的布局。

总之，这样一个简单的布局就编写完成了，接下来要在活动中加载这个布局。

#### 加载布局文件

编辑FirstActivity，onCreate()方法调用setContentView()方法加载布局:

```JAVA
public class FirstActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.first_layout);
    }
}
```
### 注册活动

所有的活动都要在AndroidManifest.xml中进行注册才能生效，打开app/src/main/AndroidMainfest.xml:

```
  <application
      ···
	  <activity android:name=".FirstActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>  
        </activity>
    </application>
```
在activity标签中使用android.name注册活动;并在其中加入<intent-filter>标签，设置FirstActivity为主活动，即当程序运行时，首先启动FirstActivity;

### Toast的使用

Toast是Android系统提供的提醒方式，在程序中可以把一些短小的消息传给用户，这些消息在一定时间后会自动消失，且不占用任何屏幕空间。

```
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.first_layout);
        Button button1 = (Button) findViewById(R.id.button_1);
        button1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(FirstActivity.this,"开始测试",
                        Toast.LENGTH_SHORT).show();
            }
                                   }
        );
    }
```
在活动中，通过findViewById()方法获取到定义在布局文件中的元素，传入R.id.button_1(first_layout中android:id规定的唯一标识符)获取按钮的实例，且findViewById()返回的是一个view对象，需要转化成Button对象;
然后调用setOnClickListener()方法为按钮注册一个监听器，点击按钮时就会执行监听器中的onClick()方法;
编写onClick()方法，通过静态方法makeText()创建出一个Toast对象，然后显示;

makeText()方法的输入参数为Context(活动要求的上下文)、Toast现实的文本内容、Toast的显示时长。
