class Observer {
    constructor() {
        this.observerList = [];
    }

    subscribe(fun) {
        this.observerList.push(fun);
    }

    notify(val) {
        this.observerList.forEach(func => func(val));
    }
}

const observer = new Observer();
observer.subscribe((val) => console.log("observer pattern! ", val));
observer.notify("2020-7-19");