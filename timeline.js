class TimelineSlider {
  constructor(x, y, w, minYear, maxYear) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.minYear = minYear;
    this.maxYear = maxYear;
    this.selectedYear = minYear;
    this.dragging = false;

    // Handle dimensions
    this.handleR = 12;
    this.trackH = 6;

    console.log(this.x + this.w)
  }

  // Convert year to x position
  yearToX(year) {
    let t = (year - this.minYear) / (this.maxYear - this.minYear);
    return this.x + t * this.w;
  }

  xToYear(px) {
    let t = constrain((px - this.x) / this.w, 0, 1);
    return Math.round(this.minYear + t * (this.maxYear - this.minYear));
  }

  handleX() {
    return this.yearToX(this.selectedYear);
  }

  isOverHandle(mx, my) {
    return dist(mx, my, this.handleX(), this.y) < this.handleR + 4;
  }

  getYear() {
    return this.selectedYear;
  }

  mouseDown(mx, my) {
    if (this.isOverHandle(mx, my)) {
      this.dragging = true;
    } else if (mx >= this.x && mx <= this.x + this.w &&
      abs(my - this.y) < 20) {
        // clicking anywhere on track jumps to that year
        this.selectedYear = this.xToYear(mx);
    }

    selectedYear = this.selectedYear
  }

  mouseDrag(mx) {
    if (this.dragging) {
      this.selectedYear = this.xToYear(mx);
    }
    // console.log(this.selectedYear)
    selectedYear = this.selectedYear
  }

  mouseRelease() {
    this.dragging = false;
  }

  render() {
    // Track background
    stroke(180);
    strokeWeight(this.trackH);
    strokeCap(ROUND);
    line(this.x, this.y, this.x + this.w, this.y);

    // Filled portion
    stroke(100, 150, 255);
    line(this.x, this.y, this.handleX(), this.y);

    // Tick marks + year labels
    let yearRange = this.maxYear - this.minYear;
    let step = yearRange <= 20 ? 1 : yearRange <= 50 ? 5 : 10;

    for (let yr = this.minYear; yr <= this.maxYear; yr += step) {
      let tx = this.yearToX(yr);
      stroke(130);
      strokeWeight(1);
      line(tx, this.y - 10, tx, this.y + 10);

      noStroke();
      fill(30);
      textAlign(CENTER);
      textSize(11);
      text(yr, tx, this.y + 25);
    }

    // Handle
    noStroke();
    if (this.dragging) {
        fill(60, 100, 220);
    }
    else {
        fill(100, 150, 255);
    }
    circle(this.handleX(), this.y, this.handleR * 2);

    // Selected year label above handle
    fill(30);
    noStroke();
    textAlign(CENTER);
    textSize(16);
    textStyle(BOLD);
    text(this.selectedYear, this.handleX(), this.y - 25);
    textStyle(NORMAL);
  }
}