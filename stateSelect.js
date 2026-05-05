class StateSelect {
    layout = [
        [ 'AK', null, null, null, null, null, null, null, null, null, null, 'ME' ],
        [ null, null, null, null, null, null, null, null, null, null, 'VT', 'NH' ],
        [ null, 'WA', 'ID', 'MT', 'ND', 'MN', 'IL', 'WI', 'MI', 'NY', 'RI', 'MA' ],
        [ null, 'OR', 'NV', 'WY', 'SD', 'IA', 'IN', 'OH', 'PA', 'NJ', 'CT', null ],
        [ null, 'CA', 'UT', 'CO', 'NE', 'MO', 'KY', 'WV', 'VA', 'MD', 'DE', null ],
        [ null, null, 'AZ', 'NM', 'KS', 'AR', 'TN', 'NC', 'SC', 'DC', null, null ],
        [ null, null, null, null, 'OK', 'LA', 'MS', 'AL', 'GA', null, null, null ],
        [ 'HI', null, null, null, 'TX', null, null, null, null, 'FL', null, null ]
    ]

    constructor(x1, y1, x2, y2, gap = 4) {
        const wide = x2 - x1;
        const high = y2 - y1;
        const rowCount = this.layout.length;
        const colCount = this.layout[0].length;
        const colCount1 = colCount - 1;
        const rowCount1 = rowCount - 1;
        const blockX = (wide - gap*colCount1) / colCount;
        const blockY = (high - gap*rowCount1) / rowCount;
        let block = min(blockX, blockY);

        let x = x1;
        let y = y1;

        this.selectedState = null;
        this.buttons = [];
        this.map = new Map();

        let mapIndex = 0;

        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                let entry = this.layout[i][j]
                if (entry != null) {
                    this.buttons.push(new Button(x, y, block, block, entry, () => {this.selectedState = entry}, 22));
                    this.map.set(entry, mapIndex)
                    mapIndex += 1;
                }
                x += block + gap;
            }
            y += block + gap;
            x = x1;
        }

        // console.log(this.map)
        // console.log(this.buttons)
    }

    getState() {
        return this.selectedState
    }

    mouseDown(mouseX, mouseY) {
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].mouseDown(mouseX, mouseY)
            this.buttons[i].setActive(false)
            // console.log(this.buttons[i].checkPressed())
        }
        this.buttons[this.map.get(this.selectedState)].setActive(true)
        // console.log(this.buttons[this.map.get(this.selectedState)])
    }

    render() {
        for (let i = 0; i < this.buttons.length; i++) {
            // if (this.selectedState) {
            //     this.buttons[this.map.get(this.selectedState)].setActive()
            // }
            this.buttons[i].draw()
        }
    }
}