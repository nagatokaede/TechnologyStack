css
===========================

## 目录
* [清除浮动](#清除浮动)
* [滚动条样式](#滚动条样式)


清除浮动
-----------
Bootstrap 中使用的浮动清除方法  
通过为父元素添加 .clearfix 类可以很容易地清除浮动（float）。这里所使用的是 Nicolas Gallagher 创造的 micro clearfix 方式。  

less  
```less
// Mixin itself
.clearfix() {
    &:before,
    &:after {
        content: " ";
        display: table;
    }
    &:after {
        clear: both;
    }
}

// Usage as a mixin
.element {
    .clearfix();
}
```
css
```css
.clearfix::before, .clearfix::after {
    content: " ";
    display: table;
}

.clearfix::after {
    clear: both;
}
```

滚动条样式
-------------------
#### 修改滚动条样式
```css
div::-webkit-scrollbar{
  width:10px;
  height:10px;
}
div::-webkit-scrollbar-track{
  background: rgb(239, 239, 239);
  border-radius:2px;
}
div::-webkit-scrollbar-thumb{
  background: #bfbfbf;
  border-radius:10px;
}
div::-webkit-scrollbar-thumb:hover{
  background: #333;
}
div::-webkit-scrollbar-corner{
  background: #179a16;
}
```
#### 参数说明
* ::-webkit-scrollbar 滚动条整体部分
* ::-webkit-scrollbar-thumb  滚动条里面的小方块，能向上向下移动（或往左往右移动，取决于是垂直滚动条还是水平滚动条）
* ::-webkit-scrollbar-track  滚动条的轨道（里面装有Thumb）
* ::-webkit-scrollbar-button 滚动条的轨道的两端按钮，允许通过点击微调小方块的位置。
* ::-webkit-scrollbar-track-piece 内层轨道，滚动条中间部分（除去）
* ::-webkit-scrollbar-corner 边角，即两个滚动条的交汇处
* ::-webkit-resizer 两个滚动条的交汇处上用于通过拖动调整元素大小的小控件
