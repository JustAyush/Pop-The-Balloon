class Balloon{
  constructor(x, y, r){
    this.x = x;
    this.y = y;
    this.r = r;
  }

  show(){
    noStroke();
    fill(255);
    ellipse(this.x, this.y, 2*this.r);
  }

  clicked(a, b){
    let d = dist(this.x, this.y, a, b);
    return (d < this.r);
  }

  son(){
    console.log("Just Checking");
  }

}
