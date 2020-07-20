class MyPromise1 {
    constructor(run) {
        this.status = "pending";
        this.observerList = [];
        this.date = null;
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
                            result.then(resolve);
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
                        resolve(result);
                    }
                })
        }
    }
}

const p = new MyPromise1(resolve => {
    setTimeout(() => {
        resolve("hello world");
        resolve("hello world2"); // 不好使了
    }, 1000);
});

p.then(value => value + "dpf")
    .then(value => value.toUpperCase())
    .then(console.log);