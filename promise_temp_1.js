//https://javascript.info/promise-chaining
//感觉fulfill没有用上
class MyPromise1 {
    constructor(run) {
        this.status = "pending";
        this.observerList = [];
        this.data = null;
        const resolve = val => {
            if (this.status === "pending") {
                this.data = val;
                this.status = "fulfilled";
                this.observerList.forEach(fun => {
                    fun(val);
                });
            }
        }
        run(resolve);
    }

    then(callback) {
        callback = typeof callback === "function" ? callback : val => val;
        switch (this.status) {
            case "pending":
                console.log("pending");
                return new MyPromise1(resolve => {
                    this.observerList.push(val => {
                        const result = callback('pending+' + val);
                        if (result instanceof MyPromise1) {
                            console.log("a", val);
                            result.then(resolve);
                        } else {
                            console.log("b", val);
                            resolve(result);
                        }
                    })
                })
            case "fulfilled":
                console.log("fullfilled");
                return new MyPromise1(resolve => {
                    console.log(1, this.data);
                    const result = callback('ful+' + this.data);
                    console.log(2);
                    if (result instanceof MyPromise1) {
                        console.log("c,", this.data);
                        result.then(resolve);
                    } else {
                        console.log("d,", this.data);
                        resolve(this.data);
                    }
                })
        }
    }
}

const p = new MyPromise1(resolve => {
    setTimeout(() => {
        resolve("XXX");
    }, 1000);
});

p.then(value => value)
    .then(value => new MyPromise1(resolve => setTimeout(() => resolve(value.toUpperCase()), 500)))
    .then(val => console.log(val + "end"));