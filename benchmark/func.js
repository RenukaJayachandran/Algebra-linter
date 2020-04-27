const { performance, PerformanceObserver } = require('perf_hooks')
const v8 = require('v8'); 
var space = new Array(5), time = new Array(5);

const obs = new PerformanceObserver((items) => {
    time.push(items.getEntries()[0].duration);
    performance.clearMarks();
  });
  obs.observe({ entryTypes: ['measure'] });

const len = 100000;
const rand = true;

const x = new Array(len)
x.fill(rand ? Math.random() : 144, 0, len - 1);

function test () {
    performance.mark('A-start');
    const res =	x.map(x => x + 1).map(x => Math.sqrt(x)).map(x => x + '').map(x => x.length);
    performance.mark('A-end');
    performance.measure('time:', 'A-start', 'A-end');
    space.push(v8.getHeapStatistics().used_heap_size );
}

for (var i = 0; i < 10 ; i++) {
    test();
}

const time_avg = time.reduce((previous, current) => current += previous) / time.length;
console.log('avg time: ' + time_avg.toFixed(3) + 'ms');

const space_avg = space.reduce((previous, current) => current += previous) / 1024 / 1024 / space.length ;
console.log('avg space: ' + space_avg.toFixed(3) + 'MB');
