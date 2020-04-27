var x = new Array(10);
for (var index = 0; index < x.length; index++) {
    x[index] = Math.round(Math.random() * (x.length - 2)) + 1;
}
x.map(function (x) { return console.log(x); });
