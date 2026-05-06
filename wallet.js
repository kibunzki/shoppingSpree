class Wallet {
    constructor(x, y, sprite, width) {
        this.x = x;
        this.y = y;
        this.sprite = sprite
        this.width = width;

        this.height = this.sprite.height / this.sprite.width * width
    }

    render() {
        fill(0)
        textFont(pix32)
        textAlign(CENTER, TOP)
        textSize(30)
        // let description = "In " + selectedYear + " " + abbrToState[selectedState] + ",\n" + "a minimum wage worker would make\n" + wage_byState[selectedState][selectedYear].toFixed(2).toString() + " per hour"
        let description = "In " + selectedYear + " " + abbrToState[selectedState] + ",\na minimum wage\nworker would make\n$" + wage_byState[selectedState][selectedYear].toFixed(2).toString() + " per hour"
        text(description, this.x, this.y + this.height, this.width)
        image(this.sprite, this.x, this.y, this.width, this.height)
    }
}