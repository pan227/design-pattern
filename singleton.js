/**
 * The Singleton Pattern limits the number of instances of a particular object to just one. 
 * This single instance is called the singleton.
 * Singletons are useful in situations where system-wide actions need to be coordinated from a single central place.
 * 实例： 登录框，购物车, jQuery的$
 * 在js 中，singleTon必须用特定的函数来实现，用new的话会破解singleTon
 */

//jQuery 实现
// if (window.jQuery != null) {
//    return window.jQuery;
// } else {
//初始化
//}

var Singleton = (function() {
    var instance;

    function createInstance() {
        var object = { title: "I am object" };
        return object;
    };
    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();
var instance1 = Singleton.getInstance();
var instance2 = Singleton.getInstance();
alert("Same instance? " + (instance1 === instance2)); // True



//v2
class SingleObject {
    login() {
        console.log("login...");
    }
}

SingleObject.getInstance = (function() {
    let instance;
    return function() {
        if (!instance) {
            instance = new SingleObject();
        }
        return instance;
    }
})();

let obj1 = SingleObject.getInstance();
let obj2 = SingleObject.getInstance();

console.log(obj1 === obj2);