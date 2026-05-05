function loadSprite(serial, xPos, yPos) {
  let index = serialOrder[serial]
  image(spriteSheet, xPos, yPos, foodImgSize, foodImgSize, (index % sheetRowSize) * spriteSize, (Math.floor(index / sheetRowSize)) * spriteSize, spriteSize, spriteSize)
}

function serialToLabel(serial) {
  let unparsed = serialLookup[serial]
  let slice_pos = unparsed.indexOf(' per ')
  return unparsed.slice(0, slice_pos)
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
      if (mouseX > x && mouseX < x + foodImgSize && mouseY > y && mouseY < y + foodImgSize) {
        return i
      }
    }
    return null
  }

//   mouseInteract(mouseX, mouseY, state) {
//     this.toggleVisible(mouseToIndex(mouseX, mouseY), state)
//     console.log(this.mouseToIndex(mouseX, mouseY))
//   }

  getIDFromPos(pos) {
    // let x = Math.floor(xPos / itemSize)
    return this.items[pos]
  }


  render() {
    fill(0)
    textAlign(CENTER, TOP)
    for (let i = 0; i < this.visibility.length; i++) {
      // let coords = this.loadSprite(this.items[i])
      if (this.visibility[i]) {
        // image(spriteSheet, this.pos_matrix[i][0], this.pos_matrix[i][1], foodImgSize, foodImgSize, coords["x"], coords["y"], spriteSize, spriteSize)
        loadSprite(this.items[i], this.pos_matrix[i][0], this.pos_matrix[i][1])
      }
      text(serialToLabel(this.items[i]), this.pos_matrix[i][0], this.pos_matrix[i][1] + foodImgSize, foodImgSize)
    }
  }
}
