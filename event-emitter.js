class EventEmitter {
    constructor() {
        this.channel = {};
    }

    on(name, func) {
        this.channel[name] ? this.channel[name].push(func) : this.channel[name] = [func];
    }

    emit(name, ...args) {
        this.channel[name] && this.channel[name].forEach(func => func(...args));
    }

    remove(event) {
        if (this.channel[event]) {
            delete this.channel[event];
        } else {
            console.log("this event does not exist");
        }
    }

    once(name, func) {
        this.on(name, (...args) => {
            func(...args);
            this.remove(event);
        })
    }
}

const eventEmitter = new EventEmitter();
eventEmitter.on("error", () => console.log("error 1 2020/7/19"));
eventEmitter.on("error", () => console.log("error 2 2020/7/19"));

eventEmitter.emit("error");