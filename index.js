const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
const connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'mosa',
  database : 'instagram'
});


// connection.query('select * from user', (err,result) =>{
//   if(err){
//     console.log(err);
//   }else{
//     console.log(result[0].username);
//     connection.close();
//   }
// })

// using placeholder
// let q = 'select * from user where username = ?';
// connection.query(q,['konda'], (err,result) =>{
//   if(err){
//     console.log(err);
//   }else{
//     console.log(result[0].username);
//     connection.close();
//   }
// })


// Inserting multiple values using placeholders
// let q = "INSERT INTO user(username, age, id, gmail, followers, country) VALUES ?";

// let users = [
//   ["chari", "23", "4", "chari@gmail.com", "200", "22"],
//   ["adil", "25", "5", "adil@gmail.com", "250", "24"]
// ];

// connection.query(q, [users], (err, result) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(result);
//     connection.end(); // use 'end()' instead of 'close()'
//   }
// });


// // Inserting bulk of data using faker
// let id = 6;
// let  getRandomUser = () => {
//   return [
//       faker.internet.username(),
//       Math.floor(Math.random()*30 + 20),
//       id++, 
//       faker.internet.email(),
//       Math.floor(Math.random()*200 + 0),
//       Math.floor(Math.random()*200 + 0)
//   ];
// }
// let q = "INSERT INTO user(username, age, id, gmail, followers, country) VALUES ?";
// let data = [];
// for(let i=1; i<=100; i++){
//   data.push(getRandomUser());
// }

// connection.query(q, [data],(err,result)=>{
//   try{
//     if(err) throw err;
//     else{
//       console.log(result);
//       connection.end();
//     }
//   }catch(err){
//     console.log(err);
//     connection.end();
//   }
// })



// home router
app.get('/', (req, res)=>{
  let q = `select count(*) from user`;
  try{
    connection.query(q,(err, result)=>{
      if(err) throw err;
      else{
        let count = result[0]['count(*)'];
        res.render('home.ejs', { count });
      }
    })
  }catch(err){
    console.log(err);
  }
})

app.get('/users', (req,res)=>{
  try{
    connection.query('select * from user', (err, users)=>{
      res.render('showusers.ejs',{users});
    })
  }catch(err){
    res.send(err);
  }
});

app.get('/users/:id/edit', (req,res)=>{
  let { id } = req.params;
  let q = `select * from user where id = ${id}`;
  try{
    connection.query(q, (err,result)=>{
      if(err) throw err;
      else{
        let user = result[0];
        res.render('edit.ejs', {user});
      }
    })
  }catch(err){
    res.send(err);
  }
});
app.patch('/users/:id', (req,res)=>{
  let { id } = req.params;
  let newUsername = req.body.username;
  let q = `update user set username='${newUsername}' where id =${id}`;
  try{
    connection.query(q, (err,result)=>{
      if(err) throw err;
      else{
        res.redirect('/users');
      }
    })
  }catch(err){
    res.send(err);
  }
})

app.listen(3000, ()=>{
  console.log('app running successfully on 3000');
})