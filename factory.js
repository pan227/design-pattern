// 将 new 单独封装
// 遇到 new 时，就要考虑是否该使用工厂模式

/**
 * 你去购买汉堡，直接点餐，取餐，不会自己亲手做
 * 商店要封装 做汉堡的工作，做好直接给买者
 */

// 把真正的 Product 封装起来，只用 creator 去创造它
// 场景： JQuery - $('div'), React.createElement, vue异步组件

//  var profile = React.createElement("div", null,
//  React.createElement("img", {src: "avatar.png", className: "profile"}),
//  React.createElement("h3", null, [user.firstName, user.lastName].join(" "))
//  );

// class Vnode(tag, attrs, children) {}
// React.createElement = function(tag, attrs, children) {
//    return new Vnode(tag, attrs, children)
//}

class Product {
    constructor(name) {
        this.name = name;
    }

    init() {
        alert("init");
    }

    fun1() {
        alert("fun1");
    }

    fun2() {
        alert("fun2");
    }
}

class Creator {
    create(name) {
        return new Product(name);
    }
}

//测试
let creator = new Creator();
let p = creator.create("p1");
p.init();
p.fun1();