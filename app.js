const ps2ws         = require('./ps2ws.js');

const express     = require('express'),
    path          = require('path'),
    cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
    http          = require('http'),
    socket_io     = require('socket.io'),
    engines = require('consolidate');

const app = express();
const io  = socket_io();

app.io    = io;
let sock = require('./socket.js');
sock.init(io);

function send(name, obj) {
    sock.sendData(name, obj, io);
}

localPath = "./"

app.use(express.static(localPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/public/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.get('/admin', function(req, res){
  var filePath = localPath+"admin.html"
  var resolvedPath = path.resolve(filePath);
  return res.sendFile(resolvedPath);
});


app.get('/', function(req, res){
  var filePath = localPath+"overlay.html"
  var resolvedPath = path.resolve(filePath);
  return res.sendFile(resolvedPath);
});

app.get('/recap', function(req, res){
  var filePath = localPath+"recap.html"
  var resolvedPath = path.resolve(filePath);
  return res.sendFile(resolvedPath);
});

app.get('/stats', function(req, res){
  var filePath = localPath+"statsRecap.html"
  var resolvedPath = path.resolve(filePath);
  return res.sendFile(resolvedPath);
});

app.get('/graphs', function(req, res){
  var filePath = localPath+"graph.html"
  var resolvedPath = path.resolve(filePath);
  return res.sendFile(resolvedPath);
});

module.exports = app;
exports.send   = send;
