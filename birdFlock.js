class BirdFlock {
  constructor() {
    //letting the boid start from a random positon on the screen
    this.pos = createVector(random(width), random(height));
    //setting a random velocity
    this.vel = p5.Vector.random2D();
    //setting the magnitude of velocity so each bird has a random vel
    this.vel.setMag(random(2, 4));
    this.acc = createVector();
    //maximum force that can be applied
    this.maxForce = 0.2;
    //setting the maximum speed
    this.maxSpeed = 5;
    this.r = 4;
  }

  // makes the birds return to the canvas
  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
    } else if (this.pos.x < 0) {
      this.pos.x = width;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
    } else if (this.pos.y < 0) {
      this.pos.y = height;
    }
  }

  align(birds) {
    //the size of the neighbouring radius in which the birds can see each other
    let localRadius = 55;
    // the steering is one of the basic features of Reynolds algorithm
    // it works by subtracting currect velocity from desired velocity
    let steering = createVector();
    
    let total = 0;
    for (let otherBird of birds) {
      //variable to help calculating the distance between this bird and the other bird(s)
      let distance = dist(this.pos.x, this.pos.y, otherBird.pos.x, otherBird.pos.y);
      // making distinction between this bird and the rest of the birds 
      // distance has to be within the radius
      if (otherBird != this && distance < localRadius) {
        steering.add(otherBird.vel);
        total++;
      }
    }
    if (total > 0) {
      // average it by dividing it to the total
      steering.div(total);
      // tell the boid to go with maximum speed to the destination
      steering.setMag(this.maxSpeed);
      // it works by subtracting currect vel from desired vel
      steering.sub(this.vel);
      //limits the magnitude of the maximum force
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(birds) {
    //notice that the local radius is smaller for separation to start with
    let localRadius = 55;
    let steering = createVector();
    let total = 0;
    for (let otherBird of birds) {
      let distance = dist(this.pos.x, this.pos.y, otherBird.pos.x, otherBird.pos.y);
      if (otherBird != this && distance < localRadius) {
        //creating a vector which points from the otherBird to the bird's position
        let opposite = p5.Vector.sub(this.pos, otherBird.pos);
        opposite.div(distance * distance);
        steering.add(opposite);
        total++;
      }
    }
    if (total > 0) {
      // average it by dividing it to the total
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.vel);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(birds) {
    let localRadius = 70;
    let steering = createVector();
    let total = 0;
    for (let otherBird of birds) {
      let distance = dist(this.pos.x, this.pos.y, otherBird.pos.x, otherBird.pos.y);
      if (otherBird != this && distance < localRadius) {
        steering.add(otherBird.pos); 
        total++;
      }
    }
    if (total > 0) {
      // average it by dividing it to the total
      steering.div(total);
      //subtracting current position from desired position
      steering.sub(this.pos);
      //setting the speed magnitude
      steering.setMag(this.maxSpeed);
      steering.sub(this.vel);
      //limits the magnitude of the steering vector to the value of maxForce
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(birds) {
    //creating sliders
    let alignment = this.align(birds);
    let cohesion = this.cohesion(birds);
    let separation = this.separation(birds);

    // applying the value to the slider
    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());

    //adding slider force values to acceleration
    //force accumulation
    this.acc.add(alignment);
    this.acc.add(cohesion);
    this.acc.add(separation);
  }

  update() {
    //Euler's integration in which velocity is an integral of position and acceleration of velocity
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    // limit the velocity to the predefined max speed
    this.vel.limit(this.maxSpeed);
    // and at the end of each draw, resetting acceleration to 0
    this.acc.mult(0);
  }

  // the triangle shapes 
  //which rotate in the direction of the velocity vector
  render() {
    push();
    fill('#283747');
    stroke('#154360');
    //For the rotational motion we set angle Theta
    let theta = this.vel.heading() + radians(90);
    translate(this.pos.x, this.pos.y);
    //rotate the bird
    rotate(theta);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }
  
}



