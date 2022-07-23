# <image src="./imgs/icons/128.png" width="96"> BOK ;)
A browser extension for collecting web links

一个简单的浏览器插件，用来收集链接  
(脱离了浏览器本身的收藏夹!)  

## 如何使用？  
在目标页面敲击三次对应的键，便会出现操作框框：  
`www` 收集当前页面链接  
<image src="./manual/screenshots/keyd_3w.png">  
`eee` 创建盒子（文件夹）  
<image src="./manual/screenshots/keyd_3e.png">  
`rrr` 列出盒子  
<image src="./manual/screenshots/keyd_3r.png">  
`ESC` 关闭弹窗（数量大于一的时候会有二次确认，敲击对应数字键关闭）  
<image src="./manual/screenshots/esc_popup.png">  
除了 `缓存区`，`回收站` 其他盒子鼠标放置会在右上角出现蓝红两个点，点击，蓝色编辑、红色删除  
<image src="./manual/screenshots/edit_box.png">  
<image src="./manual/screenshots/delete_box.png">  
<image src="./manual/screenshots/delete_box_select.png">  
点击盒子进入链接列表页，可以通过双击 `aa` 或者双击左方向键 `<-` 返回盒子列表弹窗  
盒子右边显示当前存在多少条链接  
<image src="./manual/screenshots/link_qty.png">  
鼠标放置右侧链接上会在右边出现西兰花和枫叶，分别对应编辑、删除，删除是将当前链接移入回收站；点击链接在新标签页打开   
<image src="./manual/screenshots/links.png">  
<image src="./manual/screenshots/edit_link.png">  
鼠标放置在回收站盒子上，会出现火苗 emoji 点击清空回收站  
<image src="./manual/screenshots/empty_trash.png">  
<image src="./manual/screenshots/empty_trash_select.png">  
点击回收站中链接右侧的绿叶子恢复当前链接到之前的盒子  
<image src="./manual/screenshots/recover_link.png">  
在浏览器地址输入 `bok`, 敲击 `TAB` 可以输入链接关键字进行搜索  
<image src="./manual/screenshots/omnibox_ope.png">  
点击扩展图标进入选项设置页面，可以同步当前浏览器书签到扩展、从文件导入链接、导出当前扩展数据到文件，以及清空所有数据  
<image src="./manual/screenshots/setting.png">  

计划中的功能：  
✖️ 添加 `hhh` 帮助内容 -x- 去掉这个功能  
✅ 调整储存的数据结构  
✅ 添加清空回收站的功能  
✅ 调整 html 结构、美化样式  
✅ 修改关闭弹窗操作  
✅ 添加浏览器收藏夹的导入  
✅ 添加导出功能  
✅ 调整代码中的一些文本内容  
⬜️ 安装、卸载相关的操作  
✅ 搜索栏的一些交互操作  
⬜️ 建立同步服务  
⬜️ 添加多语言支持  
✖️ 添加独立标签页面  

其他想到的后面添到这里吧！  
从想法到实现确实很难，前前后后虽然写的时间不多，但是时间跨度挺大  