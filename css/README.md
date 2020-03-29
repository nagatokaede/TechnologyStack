css
===========================

## 目录
* [清除浮动](#清除浮动)


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
