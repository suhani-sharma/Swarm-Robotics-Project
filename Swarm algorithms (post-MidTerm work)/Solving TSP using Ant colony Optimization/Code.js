var cities = [];
var citiesindex = [];
var totalCities = 10; //no. of cities
var path = [];
var totalPaths = 3; //no. of ants
var d = []; //will store dist between any 2 cities
var n = []; //n=1/d
var t = []; //will store pheromone level
var prod = []; //numerator of probability
var p = []; //probability
var possible = [];
var a = 1,
  b = 1,
  roh = 0.5; //constants
var iterations = 0;
var newpath = [];
var flag = 0;

function setup() {
  createCanvas(500, 500);
  for (var i = 0; i < totalCities; i++) {
    var v = createVector(random(width), random(height));
    cities[i] = v;
    citiesindex[i] = i;
  }

  //initialize d,n,t
  for (i = 0; i < totalCities; i++) {
    d[i] = [];
    n[i] = [];
    t[i] = [];
    for (var j = 0; j < totalCities; j++) {
      d[i][j] = dist(cities[i].x, cities[i].y, cities[j].x, cities[j].y);
      n[i][j] = 1 / d[i][j];
      if (i == j) t[i][j] = 0;
      else t[i][j] = 1;
    }
  }

  //choose a random starting city and random 1st path for each ant
  for (i = 0; i < totalPaths; i++) {
    path[i] = shuffle(citiesindex);
    path[i][totalCities] = path[i][0];
  }
}

function draw() {
  background(0);
  fill(0);

  //mark initial position of each ant with green circle
  fill(0, 255, 0);
  for (var m = 0; m < totalPaths; m++) {
    ellipse(cities[path[m][0]].x, cities[path[m][0]].y, 20, 20);
  }

  //mark position of each city with white circle
  fill(255);
  for (var i = 0; i < cities.length; i++) {
    ellipse(cities[i].x, cities[i].y, 8, 8);
  }

  //draw path of each ant
  for (k = 0; k < totalPaths; k++) {
    if (k == 0) stroke(255, 200, 50);
    else if (k == 1) stroke(255, 50, 100);
    else stroke(255, 0, 255);
    strokeWeight(1);
    noFill();
    beginShape();
    for (i = 0; i < cities.length; i++) {
      vertex(cities[path[k][i]].x, cities[path[k][i]].y);
    }
    endShape(CLOSE);
  }

  //evaporating some pheromone after each iteration
  for (i = 0; i < totalCities; i++) {
    for (var j = 0; j < totalCities; j++) {
      if (i == j) continue;
      else t[i][j] = (1 - roh) * t[i][j];
    }
  }

  //add more pheromone to each path depending on previous iteration of all ants
  for (i = 0; i < totalCities; i++) {
    for (m = 0; m < totalPaths; m++) {
      t[path[m][i]][path[m][i + 1]] += 1 / calcDistance(path[m], cities);
    }
  }

  //probability calculation

  for (i = 0; i < totalCities; i++) {
    prod[i] = [];
    for (j = 0; j < totalCities; j++) {
      if (i == j) {
        prod[i][j] = 0;
        continue;
      }
      prod[i][j] = pow(t[i][j], a) * pow(n[i][j], b);
    }
  }

  //calulating the new path for each ant based on probabilties

  for (m = 0; m < totalPaths; m++) {
    newpath[m] = [];
    newpath[m][0] = path[m][0];
    newpath[m][totalCities] = path[m][0];
    
    for (i = 0; i < totalCities - 1; i++) {
      p[i] = [];
      var x = random(0, 1);
      var possible = []; //cities possible to visit
      for (var sum = 0, count = 0, j = 0; j < totalCities; j++) {
        if (contains(newpath[m], j)) continue;
        sum += prod[newpath[m][i]][j];
        possible[count] = j;
        count++;
      }
      
      //calculating cumulative probability
      for (var k = 0; k < possible.length; k++) {
        if (k == 0) {
          p[i][k] = prod[newpath[m][i]][possible[k]] / sum;
          continue;
        }
        p[i][k] = p[i][k - 1] + prod[newpath[m][i]][possible[k]] / sum;
      }

      //finding the next city of a ant
      for (k = 0; k < possible.length; k++) {
        if (k == 0) {
          if (x >= 0 && x < p[i][0]) newpath[m][i + 1] = possible[0];
          continue;
        }
        if (x >= p[i][k - 1] && x < p[i][k]) newpath[m][i + 1] = possible[k];
      }
    }
  }

  for (m = 0; m < totalPaths; m++) {
    path[m] = newpath[m].slice();
  }

  iterations++;
  console.log(iterations);
  frameRate(10);
}

function calcDistance(points, cities) {
  var sum = 0;
  for (var i = 0; i < points.length - 1; i++) {
    var d = dist(
      cities[points[i]].x,
      cities[points[i]].y,
      cities[points[i + 1]].x,
      cities[points[i + 1]].y
    );
    sum += d;
  }
  return sum;
}

function contains(a, obj) {
  for (var i = 0; i < a.length; i++) {
    if (a[i] === obj) {
      return true;
    }
  }
  return false;
}
