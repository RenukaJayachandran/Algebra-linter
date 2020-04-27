const { performance, PerformanceObserver } = require('perf_hooks')
const v8 = require('v8'); 
var space = new Array(5), time = new Array(5);
const fetch = require("node-fetch");

const obs = new PerformanceObserver((items) => {
    time.push(items.getEntries()[0].duration);
    performance.clearMarks();
  });
  obs.observe({ entryTypes: ['measure'] });

function test () {
	performance.mark('A-start');
    Promise.all([
		fetch("http://dummy.restapiexample.com/api/v1/employee/1"),fetch("http://dummy.restapiexample.com/api/v1/employee/2"),fetch("http://dummy.restapiexample.com/api/v1/employee/3")
		])
		.then(function (responses) {
			return responses.map(function (response) {
				return response.json();
			});
		}).then(function (data) {
			//console.log(data);
		}).catch(function (error) {
			console.log(error);
	})
	.then(() =>
	{
		performance.mark('A-end');
		performance.measure('time:', 'A-start', 'A-end');
		space.push(v8.getHeapStatistics().used_heap_size );
		const time_avg = time.reduce((previous, current) => current += previous) / time.length;
		console.log('avg time: ' + time_avg.toFixed(3) + 'ms');

		const space_avg = space.reduce((previous, current) => current += previous) / 1024 / 1024 / space.length ;
		console.log('avg space: ' + space_avg.toFixed(3) + 'MB');
	});
}

test();