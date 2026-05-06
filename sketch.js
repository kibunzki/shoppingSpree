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

let basketSprite;
let bw;
let bh;
let bstartingCornerX;
let bstartingCornerY;

let grid;
let selectedState;

let timeline;
let selectedYear = 1980;

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
    basketSprite = loadImage('assets/basket.png');
    spriteSheet = loadImage('assets/Sprite-large.png');
    walletSprite = loadImage('assets/wallet.png')
    pix32 = loadFont('assets/Pix32.ttf')
    fake_receipt = loadFont('assets/FakeReceipt.otf')
    arcadeclassic = loadFont('assets/ARCADECLASSIC.TTF')
    barcode = loadFont('assets/fre3of9x.ttf')
}

function setup() {
    createCanvas(cX, cY);
    bw = basketSprite.width / 4 * 3;
    bh = basketSprite.height / 4 * 3;

    basket = new Basket(basketSprite, cX / 2 - bw / 2, cY - bh + 30, bw, 9)

    grid = new StateSelect(130, 100, cX - 100, cY - 100)

    timeline = new TimelineSlider(50, 40, 860, 1980, 2025)

    receipt = new Receipt(100, 100, 350, 90)

    wallet = new Wallet(cX - 400, 100, walletSprite, 288)

    shelf1 = new Stock(["702111", "702421", "704111", "704211", "708111", "713111", "718311", "701111", "706111", "710411"], cX - 100, cY - 100, 7, 3);

    startBtn = new Button(cX - 150, cY - 70, 100, 30, 'Let\'s Go!', () => {if(selectedState != null) {page = 1}})
    checkOutBtn = new Button(cX - 150, cY - 70, 100, 30, 'Checkout', () => {page = 2; receipt.addItems(basket.getItems())})
    restartBtn = new Button(cX - 150, cY - 70, 100, 30, 'Start Over', () => {page = 0; shelf1.reset(); basket.reset()})
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

    textAlign(LEFT, BOTTOM)
    textFont(pix32)
    textSize(15);
    fill(160)
    text("press f to fullscreen", 40, cY - 40)

    fill(255)
    textAlign(CENTER, BOTTOM)
    textFont(arcadeclassic)
    textSize(60)
    text("GROCERY ROAD TRIP", 0, 80, cX)

    textFont(pix32)
    textSize(25);
    fill(255);
    if (!selectedState) {
        title = "Please select a state";
    }
    else {
        title = "Shopping in: " + abbrToState[selectedState]
    }
    text(title, 0, cY - 40, cX);

    grid.render();
    // timeline.render();
    startBtn.draw();
}


function bread_and_baked() {
    page = 1;
    textAlign(LEFT, BOTTOM)
    textFont(pix32)
    textSize(15);
    fill(50)
    text("drag and drop items into your basket", 40, cY - 40, 200)

    shelf1.render();
    basket.render();
    checkOutBtn.draw();
    mouseDown();
}


function checkout() {
    page = 2
    fill(0)
    receipt.render()
    wallet.render()
    timeline.render();
    restartBtn.draw()
}


function mousePressed() {
    if (page == 0) {        
        // timeline.mouseDown(mouseX, mouseY);
        startBtn.mouseDown(mouseX, mouseY)
        grid.mouseDown(mouseX, mouseY);

        selectedState = grid.getState();
        // selectedYear = timeline.getYear();

        // min_wage = wage_byState[selectedState][selectedYear]
        // console.log(min_wage)
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
    else if (page == 2) {
        timeline.mouseDown(mouseX, mouseY);
        receipt.updatePrice(selectedYear);
        console.log(selectedYear)
        // selectedYear = timeline.getYear();

        min_wage = wage_byState[selectedState][selectedYear]
        console.log(min_wage)
        restartBtn.mouseDown(mouseX, mouseY)
    }
    
}

function mouseDragged() {
    if (page == 2) {
        timeline.mouseDrag(mouseX)
        receipt.updatePrice(selectedYear);
        // selectedYear = timeline.getYear();
    }
}

function mouseReleased() {
    if (page == 0) {
        startBtn.release();
        // timeline.mouseRelease();
    }
    else if (page == 1) {
        basket.release(mouseX, mouseY)
        checkOutBtn.release();
    }
    else if (page == 2) {
        timeline.mouseRelease();
        restartBtn.release();
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

function mouseWheel(event) {
    if (page == 1) {
        shelf1.scroll(event)
    }
    else if (page == 2) {
        receipt.scroll(event, mouseX, mouseY)
    }
}