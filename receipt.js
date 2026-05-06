let current_height;

class Receipt {
    constructor(x, y, w, angle) {
        this.items = {}
        this.total = 0;
        this.x = x;
        this.y = y;
        this.w = w;
        this.angle = angle;
        this.gap = 10;
        this.scrollDelta = 0;

        textSize(10)
        textFont(fake_receipt)
        let unit_width = textWidth("-")
        this.separator = ""
        for (let i = 0; i < Math.floor((this.w - 2 * this.gap) / unit_width); i++) {
            this.separator += "-"
        }
    }

    isInside(x, y) {
        return x > this.x && x < this.x + this.w && y > this.y && y < cY
    }

    updatePrice(year) {
        this.total = 0
        for (let serial in this.items) {
            let price = price_bySeriesYear[serial][year] * itemWeights[serial]

            this.items[serial] = [serialToLabel(serial), price]
            this.total += price
        }
        this.total = this.total.toFixed(2)
    }

    addItems(serials) {
        this.total = 0
        this.items = {}
        for (let i = 0; i < serials.length; i++) {
            let price = price_bySeriesYear[serials[i]][selectedYear] * itemWeights[serials[i]]

            this.items[serials[i]] = [serialToLabel(serials[i]), price]
            this.total += price
        }
        this.total = this.total.toFixed(2)

        console.log(this.items)
    }

    textLine(left, center, right, font_size, gap=5, isCentered=false) {
        textSize(font_size)
        // let maxAscent = 0;
        if (isCentered) {
            textAlign(CENTER)
            text(left, this.x + this.w / 2, this.y + current_height)
            // if (textAscent() > maxAscent) {maxAscent = textAscent()}
        }
        else {
            if (left != null) {
                textAlign(LEFT)
                text(left, this.x + this.gap, this.y + current_height, this.w - 150)
                // if (textAscent() > maxAscent) {maxAscent = textAscent()}
            }
            if (center != null) {
                textAlign(RIGHT)
                text(center, this.x + this.w - this.gap - 70, this.y + current_height) 
                // if (textAscent() > maxAscent) {maxAscent = textAscent()}
            }
            if (right != null) {
                textAlign(RIGHT)
                text(right, this.x + this.w - this.gap, this.y + current_height) 
                // if (textAscent() > maxAscent) {maxAscent = textAscent()}
            }
        }
        current_height += textAscent() + gap  
    }

    scroll(event, mouseX, mouseY) {
        if (this.isInside(mouseX, mouseY)) {
            this.scrollDelta += event.delta * (-1/2);
            this.scrollDelta = max(min(0, this.scrollDelta), - cY / 3)

            console.log(this.scrollDelta)
        }
    }

    print_content() {
        current_height = 20 + this.scrollDelta;

        fill(255)
        rect(this.x, this.y, this.w, cY)

        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.rect(this.x, this.y, this.w, cY);
        drawingContext.clip();

        fill(0)
        textFont(arcadeclassic)
        textAlign(CENTER, TOP)
        this.textLine("bunny mart", null, null, 44, 0, true)
        current_height += this.gap
        
        textFont(fake_receipt)
        this.textLine(selectedYear, null, null, 14, 0, true)

        this.textLine(abbrToState[selectedState], null, null, 14, 0, true)

        this.textLine(this.separator, null, null, 10, 0, true)

        this.textLine("ITEM", "PRICE", "HOURS", 14)

        this.textLine(this.separator, null, null, 10, 0, true)

        let min_wage = wage_byState[selectedState][selectedYear]
        // current_height += 20
        for (const serial in this.items) {
            this.textLine(this.items[serial][0], this.items[serial][1].toFixed(2), (this.items[serial][1] / min_wage).toFixed(1), 14, 30)
        }

        this.textLine(this.separator, null, null, 10, 0, true)

        this.textLine("TOTAL", this.total, (this.total / min_wage).toFixed(1), 14)

        current_height += 20

        textFont(barcode)
        this.textLine("*Hop Hop 4.032*", null, null, 44, 0, true)
        drawingContext.restore();
    }

    render() {
        this.print_content();
        scrollBar(this.x - 10, this.y, this.scrollDelta, cY - this.y, - cY / 3)
    }
}