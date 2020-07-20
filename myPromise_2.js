class Promise2 {
    constructor(run) {
        this.data = null;
        this.resolvedCallback = [];
        this.rejectedCallback = [];
        this.status = "pending";
        const resolve = val => {
            if (this.status === "pending") {
                console.log("resolved, ", this.status);
                this.status = "fulfilled";
                this.data = val;
                this.resolvedCallback.forEach(func => func(this.data));
            }
        }

        const reject = err => {
            if (this.status === "pending") {
                console.log("rejected, ", this.status);
                this.status = "rejected";
                this.data = err;
                this.rejectedCallback.forEach(func => func(this.data));
            }
        }

        try {
            run(resolve, reject);
        } catch (err) {
            reject(err)
        }
    }

    then(resovled, rejected) {
        resovled = typeof resovled === "function" ? resovled : val => val;
        rejected = typeof rejected === "function" ? rejected : err => { throw err };

        switch (this.status) {
            case "pending":
                return new Promise2((resolve, reject) => {
                    this.resolvedCallback.push(val => {
                        try {
                            const result = resovled(val);

                            if (result instanceof Promise2) {
                                result.then(resolve, reject);
                            } else {
                                resolve(result);
                            }
                        } catch (err) {
                            reject(err);
                        }

                    })

                    this.rejectedCallback.push(err => {
                        try {
                            const result = rejected(err);

                            if (result instanceof Promise2) {
                                result.then(resolve, reject);
                            } else {
                                reject(err);
                            }
                        } catch (err) {
                            reject(err);
                        }
                    })
                })

            case "fulfilled":
                return new Promise2((resolve, reject) => {
                    try {
                        const result = resovled(this.data);

                        if (result instanceof Promise2) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }
                    } catch (err) {
                        reject(err);
                    }

                })

            case "rejected":
                return new Promise2((resolve, reject) => {
                    try {
                        const result = rejected(this.data);

                        if (result instanceof Promise2) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }
                    } catch (err) {
                        reject(err);
                    }

                })
        }
    }
};

const p = new Promise2((resolve, reject) => {
    setTimeout(() => {
        reject(new Error("error"));
        resolve("hello world"); // 不好使了
        resolve("hello world2"); // 不好使了
    }, 1000);
});

p.then(value => value + "dpf")
    .then(console.log)
    .then(() => {}, err => console.log(err));