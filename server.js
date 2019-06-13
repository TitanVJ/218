
var express = require('express');
var app = express();
var serverIndex = require('serve-index');
var http = require('http');
var mongoClient = require('mongodb').MongoClient;

var url = 'mongodb://vbakhshi:Q5Did4sX@127.0.0.1:10436/cmpt218_vbakhshi?authSource=admin';

function addToDatabase(){
  mongoClient.connect(url, function(err, client){
    if (err) throw err;
    var database = client.db('cmpt218_vbakhsi'); // use
    console.log('Connected to database');
    //do the adding to the server here
    var name = checkIn.checkInKey;
    database.createCollection(name);
    var collection = database.collection(name);
    users.forEach(user => {
      collection.insertOne(user);
    });
    console.log('all users added to document');
    // var collection = database.collection('documents'); // db.documents
  });
  checkIn.checkInKey = '';
  checkIn.date = '';
  
}

var port = 10436;
var users = [];//Array of json objects to rep users once they've check in

var checkIn = {
  "active":false,
  "date":'', 
  "checkInKey":''
};


var adminOnline = false;
var date = new Date();console.log(date);
var adminDashboard = `<div id="wrapper">
<form method="POST" action="/start">
    <label>Check-In ID:</label><br>
    <input type="text" name="key" placeholder="cmpt420-Kappa" id="key" required><br>

    <button type="button" onclick="startCheckin()">Start Check-In</button><br>
    <button type="button" onclick="viewHistory()">View History</button>
</form>
</div>`;

function activeCPage(){ 
  return `<div id="wrapper">
<form>
    <label>Check in ACTIVE. Please check in now!</label><br>
    <label>Check-In ID:</label><br>
    <label id="idContainer" value="` + checkIn.checkInKey +`"><b>`
    + checkIn.checkInKey+`</b></label><br>
    
    <button type="button" onclick="yamete()" id="stBtn">Stop<br>"` + checkIn.checkInKey +`"<br>Check-In</button>
</form>
</div>`;
}

var table = `<div id="wrapper">
<table>
    <tr>
        <th>Name</th>
        <th>User ID</th> 
        <th>Date and Time of Check In</th>
    </tr>
</table>
</div>`;

// parsing body
app.use(express.json());
app.use(express.urlencoded( { extended:false} ));

var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm','html'],
  index: "login.html"
};

app.use('/', function(req,res,next){
  console.log(req.method, 'request:', req.url, JSON.stringify(req.body));
  next();
});

app.use('/', express.static('./', options));

app.post('/', function(req,res,next){
  if(req.body.username === 'admin' && req.body.password === '1234'){
    console.log('Admin confirmed\nAccess Granted...');
    if(!checkIn.active){
      res.send([true, adminDashboard]);
    }
    else{
      var t = activeCPage();
      res.send([true, t]);
    }
  }
  else{
    console.log('wrong perms');
    res.send([false]);
  }
});

app.post('/start', function(req, res, next){
  checkIn.active = true;
  checkIn.date = date;
  checkIn.checkInKey = req.body.key;
  var t = activeCPage();
  res.send(activeCPage());
});

app.post('/yameteKudastop', function(req, res, next){
  //call function to make collection and insert documents into it
  //in that function we call empty out the check obj and users array
  //here we only need to set active to false
  checkIn.active = false;
  addToDatabase();
  res.send(users);
});

app.post('/viewHistory', function(req, res, next){
//check if the collection exists. if it does send back array of data
mongoClient.connect(url, function(err, client){
  if (err){
    throw err;
  }
  var database = client.db('cmpt218_vbakhshi'); // use
  //                          ^cmpt218_vbakhshi(i think, double check later)

  console.log('Connected to database');
  //check if collection exists
  database.listCollections({name: req.body.key}).next(function(err, collinfo) {
    if (collinfo) {
        // The collection exists
        console.log('collecntion is real');
        console.log(collinfo);
        //get all the documents and send them to client
      var collection = database.collection(req.body.key);

      var array;
      collection.find({}).toArray(function(err, docs){
        //array = docs;//.forEach(elm =>{console.log(elm.name)});
        res.send([true, docs]);
      });
     
    }
    else{
      console.log('fuck this shit im out');
      res.send([false]); 
    }
});
});
});

app.post('/checkIn', function(req, res, next){
  if(checkIn.active && checkIn.checkInKey === req.body.key){
    if(exists(req.body.userID)){
      var temp;
      name = req.body.name;
      id = req.body.userID;
      date = date;
      temp = {"name":name,"id":id,"date":date};
      users.push(temp);
      console.log(temp);
      res.send([true]);
    }
    else
      res.send([false, 2]);
  }
  else
    res.send([false, 1]);
});

app.all('*', function(req, res){
  res.status(404);
  res.sendFile(__dirname + '/error.html');
});

function exists(id){
  var temp = users.find(byId, [id]);
  if(temp != ''){
    return true;
  }
  else
    return false;
}

function byId(id){
  return id.id === this[0];
}

http.createServer(app).listen(port);
console.log('running on port',port);
