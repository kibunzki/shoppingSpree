// TO DO:
// work on getting rid of items in cart when mouse starts from basket but is released outside
// work on slide (?) system for viewing of items in cart
// start implementing systek to manage diff pages + make sure Stocks are generalized in mouse events

const cX = 960;
const cY = 640;

let pix32;
let fake_receipt;

const spriteSize = 192;
const sheetRowSize = 7;
const foodImgSize = 96;
const sprites = [];

let basket;

let breadSprite;
let basketSprite;
let bw;
let bh;
let bstartingCornerX;
let bstartingCornerY;

let grid;
let selectedState;

let timeline;
let selectedYear;

let min_wage;

let receipt;
let wallet;

let shelf1;

let scaleFactor = 1;
let currentItem = null;

let startedInBasket = false;

let startBtn;

let page = 0;

// meat/poultry/seafood + eggs - 20
// bread/baked goods + grains + pantry - 10
// fruits + vegetables - 25
// beverages + snacks - 12

function preload() {
    breadSprite = loadImage('assets/bread.png');
    basketSprite = loadImage('assets/basket.png');
    spriteSheet = loadImage('assets/Sprite-large.png');
    pix32 = loadFont('assets/Pix32.ttf')
    fake_receipt = loadFont('assets/FakeReceipt.otf')
    arcadeclassic = loadFont('assets/ARCADECLASSIC.TTF')
    barcode = loadFont('assets/fre3of9x.ttf')
}

function setup() {
    createCanvas(cX, cY);
    bw = basketSprite.width / 3 * 2;
    bh = basketSprite.height / 3 * 2;

    startBtn = new Button(cX - 150, cY - 70, 100, 30, 'Let\'s Go!', () => {if(selectedState != null) {page = 1}})
    checkOutBtn = new Button(cX - 150, cY - 70, 100, 30, 'Checkout', () => {page = 2; receipt.addItems(basket.getItems())})

    basket = new Basket(basketSprite, cX / 2 - bw / 2, cY - bh + 30, bw, 9)

    grid = new StateSelect(100, 100, cX - 100, cY - 100)

    timeline = new TimelineSlider(50, 50, 860, 1980, 2025)

    receipt = new Receipt((cX - 350) / 2, 50, 350, 90)

    wallet = new Wallet(50, 50)

    shelf1 = new Stock(["702111", "702421", "704111", "704211", "708111", "713111", "718311", "701111", "706111", "710411"], cX - 50, cY - 50, 7, 4);

}

function draw() {
    background(200);
    if (page == 0) {
        homescreen();
    }
    else if (page == 1) {
        bread_and_baked();
    }
    else if (page == 2) {
        checkout()
    }
}

function homescreen() {
    page = 0;
    background(0);
    textSize(30);
    fill(255);
    if (selectedState && selectedYear) {
        title = 'shopping at ' + selectedState + ' in ' + selectedYear;
        text(title, cX / 2, cY - 70);
    }

    grid.render();
    timeline.render();
    startBtn.draw();
}


function bread_and_baked() {
    page = 1;
    shelf1.render();
    basket.render();
    checkOutBtn.draw();
    mouseDown()
}


function checkout() {
    page = 2
    fill(0)
    receipt.render()
    wallet.render()
}


function mousePressed() {
    if (page == 0) {        
        timeline.mouseDown(mouseX, mouseY);
        startBtn.mouseDown(mouseX, mouseY)
        grid.mouseDown(mouseX, mouseY);

        selectedState = grid.getState();
        selectedYear = timeline.getYear();

        min_wage = wage_byState[selectedState][selectedYear]
        console.log(min_wage)
    }
    else if (page == 1) {
        currentItem = shelf1.indexToSerial(shelf1.mouseToIndex(mouseX, mouseY))
        if (shelf1.checkVisible(shelf1.serialToIndex(currentItem))) {
            shelf1.toggleVisible(shelf1.serialToIndex(currentItem), false)
        }
        else {
            currentItem = null;
        }

        basket.mouseDown(mouseX, mouseY)
        
        checkOutBtn.mouseDown(mouseX, mouseY)
        console.log(currentItem)
    }
    // else if (page == 2) {
        
    // }
    
}

function mouseDragged() {
    if (page == 0) {
        timeline.mouseDrag(mouseX)
        selectedYear = timeline.getYear();
    }
}

function mouseReleased() {
    if (page == 0) {
        startBtn.release();
        timeline.mouseRelease();
    }
    else if (page == 1) {
        if (currentItem != null) {
            if (basket.isInside(mouseX, mouseY)) {
                console.log("released")
                basket.addItem(currentItem)
                currentItem = null;
            }
            else {
                shelf1.toggleVisible(shelf1.serialToIndex(currentItem), true)
                currentItem = null;
            }
        }
        checkOutBtn.release();
    }
    
    
}

function mouseDown() {
    if (mouseIsPressed && currentItem != null) {
        loadSprite(currentItem, (mouseX - foodImgSize / 2), (mouseY - foodImgSize / 2))
    }
}

function keyPressed() {
  if (key === 'f') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}