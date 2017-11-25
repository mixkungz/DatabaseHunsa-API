// -----------------------
//   IMPORT DEPENDENCIES
// -----------------------
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const multer = require('multer')
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
  con.end()
})
server.get('/product/all',function(req,res){
  const mysql = require('./src/mysql')
  const con = mysql()
  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });
  con.query('select * from Product p join Product_Category pc on p.CategoryID = pc.CategoryID',function(error,results){
    res.send(results)
  })
})
server.get('/product/:productId',function(req,res){
  const mysql = require('./src/mysql')
  const con = mysql()
  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });
  con.query(`select * from Product where ProductID=${req.params.productId}`,function(error,results){
    if(error){
      console.log(error)
    }
    res.send(results)
  })
  con.end()
})


server.post('/user/newuser', function(req, res) {
  const mysql = require('./src/mysql')
  const con = mysql()
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

server.post('/admin/product/update/:productId',function(req,res){
  const mysql = require('./src/mysql')
  const con = mysql()
  console.log(req.body)
  console.log(req.params.productId)
  const ProductName = req.body.productname
  const ProductDesc = req.body.productdesc
  const Quantity = parseFloat(req.body.quantity)
  const ProductPrice = parseFloat(req.body.price)
  const ProductImage = req.body.img
  const CategoryID = req.body.category
  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });
  con.query(`UPDATE Product SET ProductName='${ProductName}',ProductDesc='${ProductDesc}',Quantity=${Quantity},ProductPrice=${ProductPrice},ProductImg='${ProductImage}',Update_at=CURRENT_TIMESTAMP(),CategoryID=${CategoryID} WHERE ProductID = ${req.params.productId}`,function(error, results, fields){
    if(error){
      console.log(error.code)
      res.json({
        status : false,
        msg:error.code
      })

    }
    else{
      res.json({
        status : true,
        msg : 'success'
      })
    }
  })
  con.end()
})
server.post('/admin/product/del/:productId',function(req,res){
  const mysql = require('./src/mysql')
  const con = mysql()
  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });
  con.query(`DELETE FROM Product WHERE ProductID=${req.params.productId}`,function(error,results){
    if(error){
      console.log(error.code)
      res.json({
        status : false,
        msg:error.code
      })

    }
    else{
      res.json({
        status : true,
        msg : 'success'
      })
    }
  })
})
server.post('/admin/product/updatestatus/:productId',function(req,res){
  const mysql = require('./src/mysql')
  const con = mysql()
  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });
  const pid = req.params.productId.substr(0,req.params.productId.length-1)
  const newstatus = req.params.productId.substr(req.params.productId.length-1)
  con.query(`UPDATE Product SET StatusID=${newstatus} WHERE ProductID=${pid}`,function(error,results){
    if(error){
      console.log(error.code)
      res.json({
        status : false,
        msg:error.code
      })

    }
    else{
      res.json({
        status : true,
        msg : 'success'
      })
    }
  })
})
server.post('/admin/product/add',function(req,res){
  const mysql = require('./src/mysql')
  const con = mysql()
  console.log(req.body)

  const ProductName = req.body.productname
  const ProductDesc = req.body.productdesc
  const Quantity = parseFloat(req.body.quantity)
  const ProductPrice = parseFloat(req.body.price)
  const ProductImage = req.body.img
  const CategoryID = req.body.category

  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });
  con.query(`INSERT INTO Product (ProductName,ProductDesc,Quantity,ProductPrice,ProductImg,Create_at,Update_at,StatusID,CategoryID) VALUES ('${ProductName}','${ProductDesc}',${Quantity},${ProductPrice},'${ProductImage}',CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP(),1,${CategoryID})`,function (error, results, fields) {
    if(error){
      console.log(error.code)
      res.json({
        status : false,
        msg:error.code
      })

    }
    else{
      res.json({
        status : true,
        msg : 'success'
      })
    }
  })
  con.end()
})
server.get('/admin/user/alluser',function(req,res){
  const mysql = require('./src/mysql')
  const con = mysql()
  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });
  con.query('SELECT UserID,Username , Firstname , Lastname , Email FROM User',function(error,results){
    if(error){
      console.log(error.code)
      res.json({
        status : false,
        msg:error.code
      })

    }
    else{
      res.send(results)
    }
  })
})
server.post('/admin/user/del/:userId',function(req,res){
  const mysql = require('./src/mysql')
  const con = mysql()
  console.log(req.params.userId)
  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });
  con.query(`DELETE FROM User WHERE UserID=${req.params.userId}`,function(error,results){
    if(error){
      console.log(error.code)
      res.json({
        status : false,
        msg:error.code
      })

    }
    else{
      res.json({
        status : true,
        msg : 'success'
      })
    }
  })
})
var app = server.listen(3001, (err) => {
  if (err) throw err
  console.log('> Ready on http://localhost:3001')
})

module.exports = server