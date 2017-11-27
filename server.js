// -----------------------
//   IMPORT DEPENDENCIES
// -----------------------
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const multer = require('multer')
const convert = require('convert-callback-to-promise')
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
    console.log(results)
    for(i=0;i<results.length;i++){
      if(i==0){
        category.push(`${results[1].CategoryName}`)
      }
      else if(i==1){
        category.push(`${results[0].CategoryName}`)
      }
      else{
        category.push(`${results[i].CategoryName}`)
      }
    }
    console.log(category)
    res.send(category)
  })
  con.end()
})
server.get('/province', function(req, res, next) {
  const mysql = require('./src/mysql')
  const con = mysql()
  const province=[];
  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });
  con.query('select * from Province',function(error,results){
    for(i=0;i<results.length;i++){
      province.push(`${results[i].ProvinceName}`)
    }
    res.send(province)
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
  con.end()
  
})
server.get('/admin/total',function(req,res){
  const mysql = require('./src/mysql')
  const con = mysql()
  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });
  con.query('SELECT sum(total) as total FROM Orders',function(error,results){
    console.log(results)
    res.send(results)
  })
  con.end()
  
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
server.post('/user/address/:uid',function(req,res){
  const mysql = require('./src/mysql')
  const con = mysql()
  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });
  con.query(`select * from Address where UserID=${req.params.uid}`,function(error,results){
    if(error){
      console.log(error)
    }
      console.log(results)
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
  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });
  con.query(`INSERT INTO User (UserName,Password,Firstname,Lastname,Email,RegisDate,RoleID) VALUES ('${username}',password('${password}'),'${firstname}','${lastname}','${email}',CURRENT_TIMESTAMP(),${roleID})`,function (error, results, fields) {
    if(error){
      res.send(error.code)
    }
    else{
      res.send('success')
    }
  })
  con.end()
});


server.get('/admin/allorder', function(req, res) {
  const mysql = require('./src/mysql')
  const con = mysql()
  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });
  con.query(`SELECT o.OrderID , u.Firstname , u.Lastname , p.ProductName,od.Price,od.QtyOfProduct FROM Orders o Join Order_Detail od on o.OrderID = od.OrderID Join User u on u.UserID = o.UserID Join Product p on od.ProductID = p.ProductID`,function(err,results){
    if(err) throw err
    res.send(results)
  })


});

server.post('/user/address/update/:uid',async function(req,response){
  const mysql = require('./src/mysql')
  const con = mysql()
  console.log(req.body)
  console.log(req.params.uid)
  
  const addressdetail = req.body.addressdetail
  const postcode = req.body.postcode
  const provinceid = req.body.provinceid
  console.log(addressdetail)
  console.log(postcode)
  console.log(provinceid)


  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });

  const result = await con.query(`select * from Address where UserID=${req.params.uid}`, (err, res) => {
    if(err) throw err
    console.log(res)
    console.log(res.length)
    console.log(typeof res)
    console.log(typeof res.length)

    if(res.length === 0) {
      con.query(`INSERT INTO Address (AddressDetail,Postcode,UserID,ProvinceID) VALUES ('${addressdetail}','${postcode}',${req.params.uid},${provinceid})`, (err, res) => {
        if(err){
          console.log(err.code)
          response.send('error')
        }
        else{
          console.log('insert')
          response.send('success')
        }
        
      })
    }
    else if(res.length > 0) {
      con.query(`UPDATE Address SET AddressDetail = '${addressdetail}' , Postcode = '${postcode}' , ProvinceID=${provinceid} WHERE UserID=${req.params.uid}`,function(error,results){
        if(err){
          console.log(err.code)
          response.send('error')
        }
        else{
          console.log('update')
          response.send('success')
        }
      })
    } 
  })

  // con.query(`select * from Address where UserID=${req.params.uid}`,function(error,results){
    // if(error){
    //   console.log(error)
    // }
    // if (results) {
    //   console.log(results)
    // }
      // console.log(results)
      // if(results.length == 0){
      //   console.log('no address')
      //   await con.query(`INSERT INTO Address (AddressDetail,Postcode,UserID,ProductID) VALUES ('${addressdetail}','${postcode}',${req.params.uid},${provinceid})`, function(error,results){
      //     if(error){
      //       console.log(error.code)
      //       res.json({
      //         status : false,
      //         msg:error.code
      //       })
      
      //     }
      //     else{
      //       console.log('insert')
      //       res.json({
      //         status : true,
      //         msg : 'insert'
      //       })
      //     }
      //   })
      //   console.log('555555')
      // }
      // else{
      //   console.log('have address')
      //   await con.query(`UPDATE Address SET AddressDetail = '${addressdetail}' , Postcode = '${postcode}' , ProductID=${provinceid} WHERE UserID=${req.params.uid}`,function(error,results){
          // if(error){
          //   console.log(error.code)
          //   res.json({
          //     status : false,
          //     msg:error.code
          //   })
      
          // }
          // else{
          //   console.log('update')
          //   res.json({
          //     status : true,
          //     msg : 'update'
          //   })
          // }
      //   })
      //   console.log('666666')
        
      // }
  // })
})
server.get('/product/category/:cat',function(req,res){
  const mysql = require('./src/mysql')
  const con = mysql()
  console.log(req.params.cat)
  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });
  con.query(`SELECT * FROM Product p JOIN Product_Category pc ON p.CategoryID = pc.CategoryID WHERE pc.CategoryName = '${req.params.cat}'`,function(err,results){
    if(err) throw err
    res.send(results)
  })
})
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
server.post('/user/login',function(req,res){
  const mysql = require('./src/mysql')
  const con = mysql()
  console.log(req.body)
  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });
  con.query(`SELECT * FROM User u WHERE u.Username='${req.body.username}'and u.Password=password('${req.body.password}')` , function(error,results){
    if(error){
      console.log(error.code)
      res.json({
        status : false,
        msg:err.code
      })

    }
    else{
      if(!results[0]){
        res.send(false)
      }
      else{
        res.send(results)
      }
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
  con.end()
  
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
  con.end()
  
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
  con.end()
  
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
  con.end()
  
})
server.get('/user/useramout',function(req,res){
  const mysql = require('./src/mysql')
  const con = mysql()
  con.connect(function(err) {
    if(err) throw err
    console.log("Connected!");
  });
  con.query('SELECT count(*) as useramout FROM User',function(error,results){
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
  con.end()
  
})
var app = server.listen(3001, (err) => {
  if (err) throw err
  console.log('> Ready on http://localhost:3001')
})

module.exports = server