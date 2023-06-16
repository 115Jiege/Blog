---
categories:
- 平台-android
cover: https://cdn.pixabay.com/photo/2017/01/11/08/31/icon-1971128__340.png
date: '2023-03-30 17:15:38'
tags:
- android
- jni
title: android从0开发（二）.md
updated: Tue, 18 Apr 2023 08:36:12 GMT
---
Android开发第二弹来啦~~
在进行jni开发的时候，发现生成的Native函数声明的第一个参数影院是JNIEnv指针，第二个参数永远是jobject或者jclass;
JNIEnv是一个JNI接口指针，指向了本地方法的一个函数表，该函数表中的每一个成员指向了一个JNI函数，本地方法通过JNI函数来访问JVM中的数据结构;
jobject与jclass通常作为JNI函数的第二个参数，当所声明Native方法是静态方法时，对应参数jclass，因为静态方法不依赖对象实例，而依赖于类；
如果声明的Native方法时非静态方法时，那么对应参数是jobject。
jni中常使用数组和字符串，这里总结一下开发时用到的一些知识。

## jni数组使用

### NewArray

构造原始数组，构造失败则返回null;

```
ArrayType New<PrimitiveType>Array(JNIEnv *env, jsize length);
```

基本数组类型:
|-- jni |-- java |
| := | := |
| jbooleanArray | boolean&#91;&#93; |
| jbyteArray | byte&#91;&#93; |
| jcharArray | char&#91;&#93; |
| jshortArray | short&#91;&#93; |
| jintArray | int&#91;&#93; |
| jlongArray | long&#91;&#93; |
| jdoubleArray | double&#91;&#93; |

### GetArrayLength

返回数组长度;

```
jsize GetArrayLength(JNIEnv *env, jarray array);
```

基本数组类型
| c++ | jni | 说明 |
| := | := | := |
| uint8_t/unsigned char | jboolean | unsigned 8 bits |
| int8_t/signed char | jbyte | signed 8 bits |
| uint16_t/unsigned short | jchar | unsined 16 bits |
| int16_t/short | jshort | signed 16 bits |
| int32_t/int | jint | signed 32 bits |
| int64_t | jlong | signed 64 bits |
| float | jfloat | 32-bit IEEE 754 |
| double | jdouble | 64-bit IEEE 754 |

### GetArrayElements

返回数组指针，结果一直有效,直至调用的ReleaseArrayElements()函数;
调用失败则返回为空;
需要注意第三个参数isCopy指针，表示是否返回源数组的拷贝;
一般我们不关心是否拷贝原数组，所以设置为null;
当isCopy不为null时,如果进行了复制，则isCopy设置为JNI_TRUE; 如果没有复制，则设置为JNI_FALSE。

```
NativeType *Get<PrimitiveType>ArrayElements(JNIEnv *env, ArrayType array, jboolean *isCopy);
```

对于每次调用GetArrayElements，都需要调用ReleaseArrayElements(就像new 和 delete一样成对使用);

### ReleaseArrayElements

释放缓冲区：
参数mode为0表示复制回内容并释放缓冲区，JNI_COMMIT表示复制回内容但不释放缓冲区，JNI_ABORT表示释放缓冲区而不复制回可能的更改。

```
void Release<PrimitiveType>ArrayElements(JNIEnv *env, ArrayType array, NativeType *elems, jint mode);
```

### GetArrayRegion

将数组内容复制到缓冲区;
参数start表示数组需要复制的起始索引;
参数len表示需要复制的数组长度;
参数buf为目标缓冲区;

```
void Get<PrimitiveType>ArrayRegion(JNIEnv *env, ArrayType array, jsize start, jsize len, NativeType *buf);
```

### SetArrayRegion

从缓冲区中复制回原始数组的某个区域;
参数buf为源缓冲区;

```
void Set<PrimitiveType>ArrayRegion(JNIEnv *env, ArrayType array, jsize start, jsize len, const NativeType *buf);
```

## 字符串使用

jni通过jstring在java和c++中传递字符串;
Java默认使用Unicode编码，C/C++ 默认使用UTF编码，而JNI支持字符串在Unicode和UTF-8两种编码之间转换；
使用GetStringUTFChars 可以把一个 jstring 指针(指向JVM内部的Unicode字符序列)转换成一个UTF-8格式的C字符串。
关于GetStringUTFChars第三个参数iscopy，同上文所述，一般不关心其返回值，所以一般填null;
当iscopy不为null时：如果iscopy=JNI_TRUE则表示返回 JVM 内部源字符串的一份拷贝，并为新产生的字符串分配内存空间;
如果iscopy=JNI_FALSE则返回 JVM 内部源字符串的指针(不推荐，遵循java字符串不可修改的规定);

```
    const char* GetStringUTFChars(jstring string, jboolean* isCopy)
    { return functions->GetStringUTFChars(this, string, isCopy); }

```

与GetArrayElements相同，用完需要释放，使用ReleaseStringUTFChars释放字符串;

```
    void ReleaseStringUTFChars(jstring string, const char* utf)
    { functions->ReleaseStringUTFChars(this, string, utf); }
```

不用怕不好记，反正用了 GetXXX 就必须调用 ReleaseXXX ~~~///(^v^)\\\~~~。

## 异常抛出

程序如果在运行期间没有按正常的程序逻辑执行，出现了错误，就会导致程序崩溃。

在java中如果觉得某段逻辑可能引发异常,使用try..catch捕获异常即可;如果发生了异常，程序回直接崩溃退出，不会执行后续代码。

```
try {
        sayHello();
    } catch (Exception e) {
        e.printStackTrace();
```

jni没有try..catch...final异常处理机制，并且如果jni中发生了异常，不会立即停止执行，而是会继续执行后续代码；
所以需要将异常抛出给java:

```
const char *hello = (*env).GetStringUTFChars(hello_str, nullptr);
if (hello == null) { /* 异常检查 */
        env->ThrowNew(env->FindClass("java/lang/Exception"), "GetStringUTFChars fail.");// 发生异常后释放前面所分配的内存
        return; 
     }
```

比较常见的就是由于内存不足导致的JNI调用异常:
通常调用GetXX，NewXXX函数时回分配内存，所以调用后需要进行异常检查;
如果发生了异常，则抛出异常并释放前面分配的内存。

关于内存，除了调用JNI函数可能需要分配内存，更明显的例如：
使用new,new&#91;&#93,malloc,calloc等C语言函数分配内存，要记得使用进行初始化，防止混入脏数据，并且用完后记得使用delete,delete&#91;&#93,free进行回收。

## 日志打印

通过使用android自带的log打印输出信息到LOGCAT中，方便调试。
对于java代码的log，只需要引入log包，然后使用log.e,log.w,log.v,log.i,log.d等函数

```
import android.os.Build;

import android.util.Log

final public Boolean isEng =Build.TYPE.equals("eng");

if (isEng)

 Log.v(“LOG_TAG”,“LOG_MESSAGE”);
```

对于jni可以使用Android的日志库;

### 编辑CmakelLists.txt

```
find_library( # Sets the name of the path variable.
        log-lib

        # Specifies the name of the NDK library that
        # you want CMake to locate.
        log)

target_link_libraries( # Specifies the target library.
        xxx

        # Links the target library to the log library
        # included in the NDK.
        ${log-lib})
```

### 添加log.h

app/src/main/cpp->New c++ header;

这里主要使用了<android/log.h>中的__android_log_print函数，使用方法和printf差不多;
第一个参数时打印的级别:

```
typedef enum android_LogPriority {
  /** For internal use only.  */
  ANDROID_LOG_UNKNOWN = 0,
  /** The default priority, for internal use only.  */
  ANDROID_LOG_DEFAULT, /* only for SetMinPriority() */
  /** Verbose logging. Should typically be disabled for a release apk. */
  ANDROID_LOG_VERBOSE,
  /** Debug logging. Should typically be disabled for a release apk. */
  ANDROID_LOG_DEBUG,
  /** Informational logging. Should typically be disabled for a release apk. */
  ANDROID_LOG_INFO,
  /** Warning logging. For use with recoverable failures. */
  ANDROID_LOG_WARN,
  /** Error logging. For use with unrecoverable failures. */
  ANDROID_LOG_ERROR,
  /** Fatal logging. For use when aborting. */
  ANDROID_LOG_FATAL,
  /** For internal use only.  */
  ANDROID_LOG_SILENT, /* only for SetMinPriority(); must be last */
} android_LogPriority;
```

第二个参数是LOGTAG，可以定义宏为工程名;
最后一个参数是用__VA_ARGS__(可变参数宏):
把参数传递给宏LOGD，宏定义展开后，实际的参数就传给_android_log_print了;

如果只是想简单的打印出错信息就可以这样定义

```
#include <android/log.h>

#define LOGTAG "test"
#define LOG_ERROR(...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)
```

如果要打印详细信息，则需要添加format:

```
#define LOG_ERROR(format,...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, "function: %s, line: %d " format, __FUNCTION__,__LINE__, ##__VA_ARGS__)
```

上面就是打印了出错的函数名和行号，注意在C++中当可变参数个数为0时，需要使用##号将前面的逗号去掉，才能正确打印。

## AS项目编译

### so文件编译

差不多完成项目的开发后，就可以试着编译一下了;
通过Build->select build variants选择编译debug或release;
点击Build->make project进行编译，编译后的so文件存放在app/build/intermediates/cmake下

### so文件的使用（java层）

对于编好的so文件，如何在Android工程中使用他们呢(・∀・(・∀・(・∀・*)

1.拷贝上面编好的项目中app/build/intermediates/cmake/debug(relaese)/obj/arm64-v8a(armebi,x86,x86_64)文件夹放入新工程的app/libs下

2.修改build.gradle(:app)

```
android {
  
    defaultConfig {
    
        ndk {
            abiFilters 'arm64-v8a'
        }
     
    }
    sourceSets {
        main {
            jniLibs.srcDirs = ['libs']
        }
    }
   
}
```

3.新建java类test，确保包名(com.example.hello),函数名(sayHello)和so文件中的一致;

4.在活动中调用:

```
import com.example.hello.test
public class MainActivity extends AppCompatActivity {
protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        test jnitest = new test();  
		test.sayHello() 
		}
}

```
