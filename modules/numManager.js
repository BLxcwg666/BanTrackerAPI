class numManager {
    constructor(removeTime = 30) {
        this.numbers = [];
        this.removeTime = removeTime;
    }

    add(number) {
        const now = Date.now();
        this.numbers.push({ number, ctime: now });
    }

    remove() {
        const now = Date.now();
        const threshold = now - this.removeTime * 60 * 1000;
        this.numbers = this.numbers.filter(item => item.ctime >= threshold);
    }

    getCount() {
        return this.numbers.reduce((sum, item) => sum + item.number, 0);
    }
}

module.exports = numManager;