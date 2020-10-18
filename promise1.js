// class MyPromise {
//     constructor(run) {
//         this.status = "pending";
//         this.resolveList = [];
//         this.value = null;

//         const resolve = value => {
//             if (this.status === "pending") {
//                 this.status = "fulfilled";
//                 this.value = value;
//                 this.resolveList.forEach(fun => fun(value));
//             }
//         };
//         run(resolve);
//     }

//     then(notify) {
//         notify = typeof notify === "function" ? notify : value => value;
//         switch (this.status) {
//             case "pending":
//                 return new MyPromise(resolve => {
//                     this.resolveList.push(
//                         val => {
//                             const result = notify(val);
//                             if (result instanceof MyPromise) {
//                                 result.then(resolve);
//                             } else {
//                                 resolve(val);
//                             }
//                         }
//                     )
//                 })

//             case "fulfilled":
//                 return new MyPromise(resolve => {
//                     const result = notify(this.value);
//                     if (result instanceof MyPromise) {
//                         result.then(resolve);
//                     } else {
//                         resolve(this.value);
//                     }
//                 })
//         }
//     }
// }

// const myPro = new MyPromise((resolve, reject) => {
//     setTimeout(() => resolve(1), 1000);
// });

// myPro.then((value) => console.log(value));

// const p = new MyPromise((resolve) => {
//     resolve("sss");
// });
// p.then(v => v).then(v => new MyPromise(resolve => setTimeout(() => resolve(v + "dpf")), 1000)).then(v => console.log(v));

// class Observer {
//     constructor() {
//         this.list = [];
//     }

//     subscribe(fun) {
//         this.list.push(fun);
//     }

//     notifyAll(val) {
//         this.list.forEach(func => func(val));
//     }
// }

// const a = new Observer();
// a.subscribe(val => { console.log(val) });
// a.notifyAll("aaaa");

// class EventEmitter {
//     constructor() {
//         this.eventChannel = {};
//     }

//     on(event, callback) {
//         this.eventChannel[event] ? this.eventChannel[event].push(callback) : this.eventChannel[event] = [callback];
//     }

//     remove(event) {
//         if (this.eventChannel[event])
//             delete this.eventChannel[event];
//     }

//     emit(event, ...args) {
//         this.eventChannel[event] && this.eventChannel[event].forEach(func => func(args));
//     }

//     once(event, callback) {
//         this.on(event, args => {
//             callback(args);
//             this.remove(event);
//         })
//     }

// }

// const pro1 = new Promise((resolve, reject) => {
//     setTimeout(() => resolve("3"), 1000);
// });
// pro1.then((res) => {
//     console.log(res);
// })
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class Pro {
    constructor(notify) {
        this.status = PENDING;
        this.data = null;
        this.resolve = val => {
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.data = val;
                this.resolvedList.forEach(func => func(val));

            }
        };
        this.reject = val => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.data = val;
                this.rejectedList.forEach(func => func(val));
            }
        };
        this.resolvedList = [];
        this.rejectedList = [];
        notify(this.resolve, this.reject);
    }

    then(resolved, rejected) {
        resolved = typeof resolved === "function" ? resolved : val => val;
        rejected = typeof rejected === "function" ? rejected : err => { throw (err) };

        switch (this.status) {
            case PENDING:
                return new Pro((resolve, reject) => {
                    this.resolvedList.push(val => {
                        try {
                            console.log(resolved.toString(), val);
                            const result = resolved(val);
                            console.log(result, resolved, val);
                            if (result instanceof Pro) {
                                result.then(resolve, reject);
                            } else {
                                resolve(result);
                            }
                        } catch (err) {
                            reject(err);
                        }

                    })
                    this.rejectedList.push(err => {
                        try {
                            const result = reject(err);

                            if (result instanceof Pro) {
                                result.then(resolve, reject);
                            } else {
                                reject(err);
                            }
                        } catch (err) {
                            reject(err);
                        }
                    })
                })
            case FULFILLED:
                return new Pro((resolve, reject) => {
                    try {
                        const result = resolved(this.data);

                        if (result instanceof Pro) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }
                    } catch (err) {
                        reject(err);
                    }
                });

            case REJECTED:
                return new Pro((resolve, reject) => {
                    try {
                        const result = rejected(this.data);

                        if (result instanceof Pro) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }
                    } catch (err) {
                        reject(err);
                    }
                });
        }
    }
};

const p1 = new Pro((resolve, reject) => {
    setTimeout(() => resolve(666), 3000);
})
p1.then(val => { console.log("aaaa"); }, null);