# 文章目录生成器
给 github、mdn、微信文章、知乎、infoQ等内容型网页生成目录。现在支持 chrome 插件和组件模式，chrome 插件方便使用，组件模式方便开发人员给自己的网页加目录功能，比如自己的博客加上目录等。虽然世面上有类似的，但是用下来发现交互不喜欢，可能国内外的区别，有些工具没有适配一些常用网站，还会出现加载时间不对的问题，这些再 chrome 插件中都做了修复

看网页文章时要对文章内容有个整体认识，或者很长的技术文档只想看某个章节，就需要有文章目录并且点击某个目录能跳到对应地方。但是网页上的文章有的没有目录功能（如微信公众号、知乎）、有的目录不全，只有一二级目录（如 mdn）、有的目录需要登录后查看（如 infoQ）、还有的网页空间小要优先展示广告（ 掘金）等等。这时候就该我等出手了。

## 知乎
知乎文章没有目录功能
https://zhuanlan.zhihu.com/p/69150406 
工具效果展示：

![image](https://user-images.githubusercontent.com/8209488/217699720-9daf1124-eea6-4085-a0f0-8adaccdc4078.png)

## mdn
mdn 只显示一级，声明目录下的子目录不会显示
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules  
对比，左边是 mdn 生成的，右边是 Outlint 工具生成的

![image](https://user-images.githubusercontent.com/8209488/217699799-006b3652-5b54-4a7f-9a93-eaaad940518d.png)

## github 
效果如下，左上角是 github 的自带目录，可以看到是覆盖再内容上的，右边是工具生成的目录。

![image](https://user-images.githubusercontent.com/8209488/217701666-e564dddc-af09-40eb-bd0c-f9a04bbed315.png)
