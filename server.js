// -----------------------
//   IMPORT DEPENDENCIES
// -----------------------
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

// ----------------------
//     INITIAL SERVER
// ----------------------
const server = express()
server.use(cors())
server.use(cookieParser())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())

server.get('/', function(req, res, next) {
  res.send('Just a blank page')
})

server.post('/user/newuser', function(req, res) {
  const mysql = require('./src/mysql')
  const con = mysql()
  const date = new Date();
  // console.log('wow', req.body)
  const user = {
    "UserName":req.body.username,
    "Password":req.body.password,
    "Email":req.body.email,
    "Firstname":req.body.firstname,
    "Lastname":req.body.lastname,
    "RegisDate":date,
    "RoleID":0
  }
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query('INSERT INTO User SET ?',user,function (error, results, fields) {
      if(error){
        console.log(error.code); // 'ECONNREFUSED'
        console.log(error.fatal); // true
        res.send(error.code)
      }
      else{
        res.send('success')
      }
    });

  });
});
server.post('/admin/product/add',function(req,res){
  const mysql = require('./src/mysql')
  const con = mysql()
  
})

// LISTEN PORT 3001
var app = server.listen(3001, (err) => {
  if (err) throw err
  console.log('> Ready on http://localhost:3001')
})

module.exports = server