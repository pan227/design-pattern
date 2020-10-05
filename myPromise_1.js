// https://javascript.info/promise-chaining
// 感觉fulfill没有用上
// 如果有5个then, 第一个即时执行，直接跳到fulfilled 状态
// 如果第二个是async, 就会进入pending 状态，把后面的都装进去observerList, 等到第一个resolved了，就开始执行array里面的内容
// 如果有不连在一起的then 5 个， 这一层observerList 会有 5 个function
class MyPromise1 {
    constructor(run) {
        this.status = "pending";
        this.observerList = [];
        this.data = null;
        const resolve = val => {
            if (this.status === "pending") {
                this.data = val;
                this.status = "fulfilled";
                this.observerList.forEach(fun => fun(val));
            }
        }
        run(resolve);
    }

    then(callback) {
        callback = typeof callback === "function" ? callback : val => val;
        switch (this.status) {
            case "pending":
                return new MyPromise1(resolve => {
                    this.observerList.push(val => {
                        const result = callback(val);
                        if (result instanceof MyPromise1) {
                            result.then(resolve); // 相当于 Promise.then(val => resolve(val))
                            // then 的返回是Promise类型，但then 里面回调函数的返回类型不一定是Promise
                        } else {
                            resolve(result);
                        }
                    })
                })
            case "fulfilled":
                return new MyPromise1(resolve => {
                    const result = callback(this.data);
                    if (result instanceof MyPromise1) {
                        result.then(resolve);
                    } else {
                        resolve(this.data);
                    }
                })
        }
    }
}

const p = new MyPromise1((resolve, reject) => {
    resolve("sss");
});
p.then(v => v).then(v => new MyPromise1(resolve => setTimeout(() => resolve(v + "dpf")), 1000)).then(v => console.log(v));
//v => (console.log('xxx'), v)