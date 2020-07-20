class MyPromise {
    constructor(run) {
        this.observerList = [];
        const resolve = val => this.observerList.forEach(fun => fun(val));
        run(resolve);
    }

    then(func) {
        this.observerList.push(func);
    }
}
let a = 0;
const pro = new MyPromise(
    resolve => setInterval(() => resolve(a++), 1000)
);

pro.then(val => console.log(val));