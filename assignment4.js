const prompt = require('prompt-sync')({sigint: true});

const hat = 'H';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field = [[]]) {
    this.field = field;
    this.prevX = -1;
    this.prevY = -1;
    this.locationX = 0;
    this.locationY = 0;
    this.direction = '';
    // Set the "home" position before the game starts
    this.field[0][0] = pathCharacter;
  }

  runGame() {
    while (true) {
      this.print();
      this.askQuestion();
      if (!this.isInBounds()) {
        console.log('You Lose: Out of bounds!');
        return false;
      } else if (this.isHole()) {
        console.log('You Lose: Sorry, you fell down a hole!');
        return false;
      } else if (this.isHat()) {
        console.log('Congrats, you found your hat!');
        return true;
      }
      // update prev location
      let prevLogo = ">";
      if(this.direction == "U"){
        prevLogo = "^"
      }
      else if(this.direction == "D"){
        prevLogo = "v"
      }
      else if(this.direction == "L"){
        prevLogo = "<"
      }
      this.field[this.prevY][this.prevX] = prevLogo;

      // Update the current location on the map
      this.field[this.locationY][this.locationX] = pathCharacter;
    }

  }

  askQuestion() {
    this.prevX =  this.locationX;
    this.prevY = this.locationY;
    this.direction = prompt('Which way (U, D, L, R)? ').toUpperCase();
    switch (this.direction) {
      case 'U':
        this.locationY -= 1;
        break;
      case 'D':
        this.locationY += 1;
        break;
      case 'L':
        this.locationX -= 1;
        break;
      case 'R':
        this.locationX += 1;
        break;
      default:
        console.log('Enter U, D, L or R.');
        this.askQuestion(); // recursively function call to ask back same question if enter wrongly
        break;
    }
  }

  isInBounds() {
    return (
      this.locationY >= 0 &&
      this.locationX >= 0 &&
      this.locationY < this.field.length &&
      this.locationX < this.field[0].length
    );
  }

  isHat() {
    return this.field[this.locationY][this.locationX] === hat;
  }

  isHole() {
    return this.field[this.locationY][this.locationX] === hole;
  }

  print() {
    const height = this.field.length;
    const width = this.field[0].length;
    let displayString = "";
    for(let row = 0; row < height; ++row){
      for(let col = 0; col < width; ++col){
        displayString += `${this.field[row][col]}`
      }
      displayString += "\n"
    }
    console.log(displayString);
  }

  static generateField(height, width, percentage = 0.1) {
    //const field = new Array(height).fill(0).map(el => new Array(width));
    let field = [];
    for(let row = 0; row < height; ++row){
      let rowData = []
      for(let col = 0; col < width; ++col){
        rowData.push(0);
      }
      field.push(rowData);
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const prob = Math.random(); // random value from 0 to 0.9999999
        // setting this position [row][col] either Floor/Hole.
        field[y][x] = prob > percentage ? fieldCharacter : hole;
      }
    }

    // Set the "hat" location
    const hatLocation = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    };

    // Make sure the "hat" is not at the starting point
    while (hatLocation.x === 0 && hatLocation.y === 0) {
      hatLocation.x = Math.floor(Math.random() * width);
      hatLocation.y = Math.floor(Math.random() * height);
    }
    field[hatLocation.y][hatLocation.x] = hat;
    return field;
  }
}

// Created class Field
// 10 row x 10 col, 20% obstacles
let difficulty = 1
while(true){
  const startGameChoice = prompt(`Start game level ${difficulty} (Y/N)`).toUpperCase();
  if(startGameChoice == 'Y'){
    let obstacles = 0.1*difficulty;
    if(obstacles > 0.8){
      obstacles = 0.8;
    }
    const myfield = new Field(Field.generateField(5*difficulty, 10*difficulty, obstacles));
    const hasWin = myfield.runGame();
    if(hasWin){
      difficulty += 1;
    }
  }
  else if(startGameChoice == 'N'){
    console.log("Thank you for playing Maze!")
    break;
  }
  else{
    console.log("Unknown choice!")
  }
}


