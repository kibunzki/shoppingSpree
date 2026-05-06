function loadSprite(serial, xPos, yPos) {
  let index = serialOrder[serial]
  image(spriteSheet, xPos, yPos, foodImgSize, foodImgSize, (index % sheetRowSize) * spriteSize, (Math.floor(index / sheetRowSize)) * spriteSize, spriteSize, spriteSize)
}

function serialToLabel(serial) {
  let unparsed = serialLookup[serial]
  let slice_pos = unparsed.indexOf(' per ')
  return unparsed.slice(0, slice_pos)
}

function scrollBar(x, y, scrollDelta, scrollBarHeight, low) {
    stroke(50)
    strokeWeight(4)
    fill(50)
    rect(x, y, 10, scrollBarHeight)
    noStroke()
    fill(100)
    rect(x, map(scrollDelta, 0, low, y, scrollBarHeight + y - scrollBarHeight / 4), 10, scrollBarHeight / 4)
}


class Stock {
  constructor(items, width, height, row_size, col_size) {
    this.items = []; // position: food ID
    this.width = width;
    this.height = height;
    this.visibility = [];
    this.pos_matrix = [];
    this.row_size = row_size;
    this.col_size = col_size;
    for (let i = 0; i < items.length; i++) {
      this.items.push(items[i])
      this.visibility.push(true)
      this.pos_matrix.push([(this.width / this.row_size) * (i % this.row_size) + (cX - this.width) / 2, (this.height / this.col_size) * Math.floor(i / this.row_size) + (cY - this.height) / 2])
    }
    
    this.scrollBarHeight = cY - 20
    this.scrollDelta = 0;
  }

  
  serialToIndex(serial) {
    return this.items.findIndex((element) => element == serial)
  }

  indexToSerial(i) {
    return this.items[i]
  }
  
  toggleVisible(i, state) {
    this.visibility[i] = state;
  }

  checkVisible(i) {
    return this.visibility[i]
  }

  mouseToIndex(mouseX, mouseY) {
    // return Math.floor(mouseX / (cX / this.row_size)) + Math.floor(mouseY / (cY / this.col_size)) * this.row_size
    for (let i = 0; i < this.pos_matrix.length; i++) {
      let x = this.pos_matrix[i][0]
      let y = this.pos_matrix[i][1]
      if (mouseX > x && mouseX < x + foodImgSize && mouseY > y + this.scrollDelta && mouseY < y + foodImgSize + this.scrollDelta) {
        return i
      }
    }
    return null
  }

  getIDFromPos(pos) {
    return this.items[pos]
  }

  reset() {
    for (let i = 0; i < this.items.length; i++) {
      this.toggleVisible(i, true)
    }
  }

  scroll(event) {
    this.scrollDelta += event.delta * (-1/2);
    this.scrollDelta = max(min(0, this.scrollDelta), - this.height / 3)

    console.log(this.scrollDelta)
  }


  render() {
    fill(0)

    textAlign(CENTER, TOP)
    for (let i = 0; i < this.visibility.length; i++) {
      // let coords = this.loadSprite(this.items[i])
      if (this.visibility[i]) {
        // image(spriteSheet, this.pos_matrix[i][0], this.pos_matrix[i][1], foodImgSize, foodImgSize, coords["x"], coords["y"], spriteSize, spriteSize)
        loadSprite(this.items[i], this.pos_matrix[i][0], this.pos_matrix[i][1] + this.scrollDelta)
      }
      text(serialToLabel(this.items[i]), this.pos_matrix[i][0], this.pos_matrix[i][1] + foodImgSize + this.scrollDelta, foodImgSize)
    }
    scrollBar(cX - 20, (cY - this.scrollBarHeight) / 2, this.scrollDelta, this.scrollBarHeight, - this.height / 3)
  }
}
