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
server.get('/product/productcat', function(req, res, next) {
  const mysql = require('./src/mysql')
  const con = mysql()
  const category=[];
  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });
  con.query('select * from Product_Category',function(error,results){
    for(i=0;i<results.length;i++){
      category.push(`${results[i].CategoryName}`)
    }
    res.send(category)
  })
})

server.post('/user/newuser', function(req, res) {
  const mysql = require('./src/mysql')
  const con = mysql()
  const date = new Date();
  // console.log('wow', req.body)
  // const userData = {
  //   "Username":req.body.username,
  //   "Password":password(req.body.password),
  //   "Email":req.body.email,
  //   "Firstname":req.body.firstname,
  //   "Lastname":req.body.lastname,
  //   "RegisDate":date,
  //   "RoleID":0
  // }
  let username = req.body.username
  let password = req.body.password
  let email = req.body.email
  let firstname = req.body.firstname
  let lastname = req.body.lastname
  let roleID = 0
  console.log(date)
  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });
  con.query(`INSERT INTO User (UserName,Password,Firstname,Lastname,Email,RegisDate,RoleID) VALUES ('${username}',password('${password}'),'${email}','${firstname}','${lastname}',CURRENT_TIMESTAMP(),${roleID})`,function (error, results, fields) {
    if(error){
      res.send(error.code)
    }
    else{
      res.send('success')
    }
  })
  con.end()
});



server.post('/admin/product/add',function(req,res){
  const mysql = require('./src/mysql')
  const con = mysql()
  const date = new Date();
  console.log(req.body)
  // const product = {
  //   "ProductName":req.body.productname,
  //   "ProductDesc":req.body.productdesc,
  //   "Quantity":req.body.quantity,
  //   "ProductPrice":req.body.productprice,
  //   "ProductImage":req.body.productimg,
  //   "Create_at":date,
  //   "Update_at":date,
  //   "Status":1,
  //   "CategoryID":1
  // }
  
  // con.connect(function(err) {
  //   if(err) throw err
  //   console.log("Connected!");
  // });
  // con.query('INSERT INTO Product SET ?',product,function (error, results, fields) {
  //   if(error){
  //     res.send(error.code)
  //   }
  //   else{
  //     res.send('success')
  //   }
  // })
})

// LISTEN PORT 3001
var app = server.listen(3001, (err) => {
  if (err) throw err
  console.log('> Ready on http://localhost:3001')
})

module.exports = server