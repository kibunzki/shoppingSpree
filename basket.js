class Basket {
    constructor(sprite, x, y, width, level_cap) {
        this.items = [];
        this.sprite = sprite;
        this.level_cap = level_cap;
        this.x = x;
        this.y = y;
        this.z = 0;

        this.w = width;
        this.h = this.sprite.height / this.sprite.width * width
        //start off with 9 positions
        this.pos_matrix = [];

        let xgap = 20;
        let ygap = 60;
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
        for (let i = 0; i < this.items.length; i++) {
            let x = this.pos_matrix[i][0]
            let y = this.pos_matrix[i][1]
            if (mouseX > x && mouseX < x + foodImgSize && mouseY > y && mouseY < y + foodImgSize) {
                return i
            }
        }
        return null
    }

    addItem(ID) {
        let before_push_len = this.items.length
        this.items.push(ID);
        if (before_push_len % this.level_cap > 0 && this.items.length == 0) {
            this.z++;
        }
    }


    removeItem(ID) {
        let pos = this.items.findIndex((serial) => serial == ID);
        this.items.splice(pos, 1);
    }

    getItems() {
        return this.items;
    }

    isInside(x, y) {
        return x < this.x + this.w && x > this.x && y < this.y + this.h && y > this.y
    }

    mouseDown(mouseX, mouseY) {
        let basketItem = this.items[this.posToIndex(mouseX, mouseY)]
        if (this.isInside(mouseX, mouseY) && basketItem != null) {
            currentItem = basketItem
            // console.log("basket ci: ", currentItem)
            this.removeItem(currentItem)
        }
    }

    render() {
        image(this.sprite, this.x, this.y, this.w, this.h);
        for (let i = 0; i < this.items.length; i++) {
            loadSprite(this.items[i], this.indexToXPos(i), this.indexToYPos(i));
        }
    }
}