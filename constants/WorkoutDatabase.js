var firebase = require('../firebase');
var database = firebase.database();

for (var i = 0; i < 5; i++) {
  database.ref('workouts/' + i).set({
    day: i,
    swim: [a, b, c],
    bike: [d, e, f],
    run: [g, h, i],
  })
}
