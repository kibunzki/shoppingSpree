class Basket {
    constructor(sprite, x, y, width, level_cap) {
        this.items = [];
        this.sprite = sprite;
        this.level_cap = level_cap;
        this.x = x;
        this.y = y;
        this.current_z = 0;

        this.w = width;
        this.h = this.sprite.height / this.sprite.width * width
        //start off with 9 positions
        this.pos_matrix = [];

        let xgap = 30;
        let ygap = 80;
        for (let i = 0; i < this.level_cap; i++) {
            this.pos_matrix.push([this.x + xgap + (i % 3) * ((this.w - 2 * xgap)/ 3), this.y + ygap + Math.floor(i / 3) * ((this.h - 2 * ygap)/ 3)])
        }
    }

    indexToXPos(i) {
        return this.pos_matrix[i][0]
    }

    indexToYPos(i) {
        return this.pos_matrix[i][1]
    }

    posToIndex(x, y) {
        // return Math.floor(mouseX / (cX / this.row_size)) + Math.floor(mouseY / (cY / this.col_size)) * this.row_size
        for (let i = 0; i < this.level_cap; i++) {
            let x = this.pos_matrix[i][0]
            let y = this.pos_matrix[i][1]
            if (mouseX > x && mouseX < x + foodImgSize && mouseY > y && mouseY < y + foodImgSize) {
                return i
            }
        }
        return null
    }

    addItem(ID) {
        // Check if ID already exists in any row
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].includes(ID)) {
                console.log("already in list");
                return;
            }
        }

        // Try to add to an existing row that isn't full
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].length < this.level_cap) {
                this.items[i].push(ID);
                return;
            }
        }

        // No space found, or array is empty — start a new row
        this.items.push([ID]);

        console.log(this.items)
    }


    removeItem(ID) {
        // let pos = this.items.findIndex((serial) => serial == ID);
        // this.items.splice(pos, 1);
        for (let i = 0; i < this.items.length; i++) {
            console.log(i)
            console.log(this.items[i].findIndex((serial) => serial == ID))
            let pos = this.items[i].findIndex((serial) => serial == ID);
            if (pos > -1) {
                this.items[i].splice(pos, 1);
            }
        }

        if (this.items[this.items.length - 1].length == 0) {
            this.items.splice(this.items.length - 1, 1)
        }
    }

    getItems() {
        // return this.items;
        return this.items.flat(1)
    }

    isInside(x, y) {
        return x < this.x + this.w && x > this.x && y < this.y + this.h && y > this.y
    }

    mouseDown(mouseX, mouseY) {
        // let basketItem = this.items[this.posToIndex(mouseX, mouseY)]
        // if (this.isInside(mouseX, mouseY) && basketItem != null) {
        //     currentItem = basketItem
        //     // console.log("basket ci: ", currentItem)
        //     this.removeItem(currentItem)
        // }
        let pos = this.posToIndex(mouseX, mouseY)
        console.log("pos: " + pos)
        // console.log(pos)
        if (this.isInside(mouseX, mouseY) && pos != null) {
            if (this.items[this.items.length - 1].length < pos) {
                console.log("case 1")
                currentItem = this.items[this.items.length - 2][pos]
            }
            else {
                console.log("case 2")
                currentItem = this.items[this.items.length - 1][pos]
            }
            // console.log("basket ci: ", currentItem)
            this.removeItem(currentItem)
        }
        // if (this.isInside(mouseX, mouseY) && this.posToIndex(mouseX, mouseY) != null) {
        //     currentItem = this.items[this.items.length - 1][this.posToIndex(mouseX, mouseY)]
        //     // console.log("basket ci: ", currentItem)
        //     this.removeItem(currentItem)
        // }
        
    }

    release(mouseX, mouseY) {
        if (currentItem != null) {
            if (this.isInside(mouseX, mouseY)) {
                console.log("released")
                basket.addItem(currentItem)
                currentItem = null;
            }
            else {
                shelf1.toggleVisible(shelf1.serialToIndex(currentItem), true)
                currentItem = null;
            }
        }
    }

    reset() {
        this.items = []
    }

    render() {
        image(this.sprite, this.x, this.y, this.w, this.h); // basket sprite
        // for (let i = 0; i < this.items.length; i++) {
        //     loadSprite(this.items[i], this.indexToXPos(i), this.indexToYPos(i));
        // }
        for (let i = 0; i < this.items.length; i++) {
            for (let j = 0; j < this.items[i].length; j++) {
                loadSprite(this.items[i][j], this.indexToXPos(j), this.indexToYPos(j));
            }
        }
    }
}