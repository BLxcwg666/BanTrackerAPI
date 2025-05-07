class numManager {
    constructor() {
        this.numbers = [];
    }

    add(number) {
        const now = Date.now();
        this.numbers.push({ number, ctime: now });
    }

    remove() {
        const now = Date.now();
        this.numbers = this.numbers.filter(item => item.ctime >= now - 30 * 60 * 1000);
    }

    getCount() {
        return this.numbers.reduce((sum, item) => sum + item.number, 0);
    }
}

module.exports = numManager;