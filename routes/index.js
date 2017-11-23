const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Just a blank page')
});
router.post('/user/newuser', function(req, res, next) {
  console.log(req)
  const mysql = require('../src/mysql')
  const con = mysql()
  const date = new Date();
  console.log('wow', req.body)
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

module.exports = router;
