function reduc_law (x:any[], myVar:number)
{
	x.map(x => x + 1).map(x => Math.sqrt(x)).map(x => x + '').map(x => x.length);
	if(myVar === 1)
	{
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
		});
	}	
}

