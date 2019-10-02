const { performance, PerformanceObserver } = require('perf_hooks')

const obs = new PerformanceObserver((items) => {
    console.log(items.getEntries()[0].name, items.getEntries()[0].duration);
    performance.clearMarks();
  });
  obs.observe({ entryTypes: ['measure'] });

const len = 1000;

const rand = true;

const x = new Array(len)
x.fill(rand ? Math.random() : 144, 0, len - 1)

const y = new Array(len)
y.fill(rand ? Math.random() : 144, 0, len - 1)

function test () {
    performance.mark('A-start');
    const res1 = y.map(x => (Math.sqrt(x + 1) + '').length).filter(x => x > 4)
    performance.mark('A-end');
    performance.measure('res1:', 'A-start', 'A-end')
}

function test1 () {
    performance.mark('B-start');
    const res = x.map(x => x + 1).map(x => Math.sqrt(x)).map(x => x + '').map(x => x.length).filter(x => x > 4)
    performance.mark('B-end');
    performance.measure('res2:', 'B-start', 'B-end')
}

for (var i = 0; i<4; i++) {
    test()
    test1()
}