class Button {
  constructor(x, y, w, h, label, onClick, fontSize=16, color=[100, 100, 230]) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
    this.onClick = onClick;
    [this.r, this.g, this.b] = color;
    this.fontSize = fontSize;
    this.hovered = false;
    this.pressed = false;
  }

  isInside(mx, my) {
    return mx > this.x && mx < this.x + this.w &&
           my > this.y && my < this.y + this.h;
  }

  update() {
    this.hovered = this.isInside(mouseX, mouseY);
  }


  mouseDown(mx, my) {
    if (this.isInside(mx, my)) {
      this.pressed = true;
      // console.log("button pressed")
      this.onClick();
    }
  }

  release() {
    // console.log("release called for ", this.label)
    this.pressed = false;
  }

  checkPressed() {
    console.log("pressed: " + this.pressed)
  }

  setActive(state) {
    if (state) {
        [this.r, this.g, this.b] = [80, 80, 200]
    }
    else {
        [this.r, this.g, this.b] = [100, 100, 230]
    }
  }

  draw() {
    this.update();

    fill(this.r, this.g, this.b);

    noStroke();
    rect(this.x, this.y, this.w, this.h);

    // Label
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(this.fontSize);
    textFont(pix32)
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
  }
}