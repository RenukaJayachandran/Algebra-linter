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
	performance.mark('B-start');
	fetch("http://dummy.restapiexample.com/api/v1/employee/1")
		.then((res) => 
		{
			return res.json();
		})
		.then(function (data)
		{
			//console.log(data);
			return fetch("http://dummy.restapiexample.com/api/v1/employee/2");
		})
		.then((res) =>
		{
			return res.json();
		}) 
		.then(function (data)
		{
			//console.log(data);
			return fetch("http://dummy.restapiexample.com/api/v1/employee/3");
		})
		.then((res) => 
		{
			return res.json();
		})
		.then((data) =>
		{
			//console.log(data);
		})
		.catch((err) =>
		{
			console.log(err);
		})
		.then(() =>
		{
			performance.mark('B-end');
			performance.measure('time:', 'B-start', 'B-end');
			space.push(v8.getHeapStatistics().used_heap_size);
			const time_avg = time.reduce((previous, current) => current += previous) / time.length;
			console.log('avg time: ' + time_avg.toFixed(3) + 'ms');
			
			const space_avg = space.reduce((previous, current) => current += previous) / 1024 / 1024 / space.length ;
			console.log('avg space: ' + space_avg.toFixed(3) + 'MB');			
		});
}

test();	
