class Wallet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    render() {
        textFont(pix32)
        textAlign(screenLeft, CENTER)
        text(wage_byState[selectedState][selectedYear].toFixed(2).toString() + " per hour", this.x, this.y)
    }
}