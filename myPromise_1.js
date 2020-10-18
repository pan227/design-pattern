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
                console.log(this.observerList);
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
                        console.log("aaaa");
                        if (result instanceof MyPromise1) {
                            result.then(resolve);
                            // 相当于 Promise.then(val => resolve(val))
                            // 通篇 只有一个resolve, 一直传下去，resolve执行的时候，执行当前的 callbackList
                            // 在这里，child promise resolve 之后，将会trigger 去执行当前 的 callbackList
                            // then 里面的 callback 会主动执行 like in pending
                        } else {
                            resolve(result);
                        }
                    })
                })
            // for non-promise, it does not use observerList 
            case "fulfilled":
                return new MyPromise1(resolve => {
                    const result = callback(this.data);
                    console.log("bbb");
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

p.then(v => console.log(v));
p.then(v => console.log(v+"fff"));

//Promise.resolve() // returns a Promise

// p.then(v => new MyPromise1(resolve => setTimeout(() => resolve(v + "dpf"), 1000)))
//  .then(v => console.log(v))
 //.then(v1 => new MyPromise1(resolve => setTimeout(() => console.log(v1), 1000)))
//v => (console.log('xxx'), v)