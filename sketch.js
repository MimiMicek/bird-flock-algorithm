const flight = [];

//defining the three slides variables
let alignSlider, cohesionSlider, separationSlider;

function setup() {
  createCanvas(1040, 760); 

  //creating content of the sliders and labels
  separationSlider = createSlider(0, 2, 1, 0.1).class('slider');
  createDiv('Separation').class('sliderLabel');

  alignSlider = createSlider(0, 2, 1, 0.1).class('slider');
  createDiv('Alignment').class('sliderLabel');

  cohesionSlider = createSlider(0, 2, 1, 0.1).class('slider');
  createDiv('Cohesion').class('sliderLabel');
  
  //Creating flocks
  for (let i = 0; i < 200; i++) {
    flight.push(new BirdFlock());
  }

}

function draw() {
  background('#AED6F1');
  for (let bird of flight) {
    bird.edges();
    bird.flock(flight);
    bird.update();
    // rendering the triangle shapes
    bird.render();
  }  
}

