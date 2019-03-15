var express = require('express')
var app = express()
var repo=require('./repo')
var bodyParser=require('body-parser');
var cors=require('cors');
app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/task', function (req, res)
{
    repo.findtask((err,data)=>
	{
        res.json(data);
    });
})
 
app.post('/tasks', function (req, res) 
{
    var content=req.body
    console.log(content)
	
	var par={"parenttask":content.parenttask}
	
	var statetask={
		"taskname":content.taskname,
		"parenttask":content.parenttask,
		"priority":content.priority,
		"startdate":content.startdate,
		"enddate":content.enddate,
		"state":true}
	
	repo.insertparent(par,(result)=>
	{
		console.log("Inserted the document in parent")
    })
    repo.inserttask(content,(result)=>
	{
		console.log("Inserted the document in task collection")
    })
	repo.insertstate(statetask,(result)=>
	{
		res.status(201).json({message:"Inserted the document in finally collection with state"})
    })
})

app.delete('/tasks/:taskname', function (req, res) 
{
	var taskname=req.params.taskname
	repo.deletetask(taskname,(result)=>
	{
		res.status(202).json({message:"Deleted the document",taskname:taskname})
	})
})
 

app.put('/edittasks', function (req, res) 
{
    var body=req.body;
    console.log(req.body)
    console.log(body.taskname)
    repo.updatetask(body,(result)=>
	{
		res.status(202).json({message:"updated the document",})
	})
})

app.put('/endtasks', function (req, res) 
{
    var body=req.body;
    console.log(req.body)
    console.log(body.taskname)
    repo.endtask(body,(result)=>
	{
		res.status(202).json({message:"ended the task",})
	})
})

app.listen(7001,()=>console.log("Listening to port 7001..."))//