## 文章目录生成器

痛点：github 或者知乎等看文章时，没有目录，没办法获取文章整体内容
解决： 自动生成目录

## 支持白名单及原因

[https://juejin.cn/post/7109729038981136391](https://juejin.cn/post/7109729038981136391)

[https://juejin.cn/post/7016593221815910408](https://juejin.cn/post/7016593221815910408) 掘金

[https://zh-hans.reactjs.org/blog/2022/03/29/react-v18.html](https://zh-hans.reactjs.org/blog/2022/03/29/react-v18.html) react 的官方文档 目录放在文章上面

[https://nodejs.org/api/cli.html#command-line-api](https://nodejs.org/api/cli.html#command-line-api) nodejs 中文文档 目录放在文章上面

[https://www.infoq.cn/article/3Ko3rS9t2O18vAoCiqD5](https://www.infoq.cn/article/3Ko3rS9t2O18vAoCiqD5) infoQ 目录需要登录查看

[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)  mdn 子目录没显示

[https://developer.mozilla.org/en-US/docs/Web/API](https://developer.mozilla.org/en-US/docs/Web/API)  这种字母的目录导航很好用

## todo

- [x]  加 chrome 插件，发布插件
- [ ]  高亮当前的目录
- [ ]  `Panel can be dragged to preferred position`
- [ ]  `Support auto load option`
- [x]  toggle, 现在是放在页面边边上，后面可以改成浏览器上点击切换，但是浏览器插件可能被隐藏起来
- [ ]  mousedown mouseup 搞搞，拖动应该也比较快实现
- [ ]  样式好看一点：所在位置目录高亮，加修饰，整体样式加个 padding， 颜色确定下
- [ ]  `Highlight current heading`
- [x]  `Click to jump to heading`
- [ ]  监听窗口变化，处理调试器出来导致定位出错，内容超出边界
- [ ]  针对各种网站优化
- [ ]  识别 strong 等生成目录
- [ ]  resizable panel
- [ ]  **Search**
- [ ]  白名单管理
- [ ]  目录树的收起和展开
- [ ]  子目录的数量
- [ ]  加载完毕后再渲染，不然会拿不到内容
