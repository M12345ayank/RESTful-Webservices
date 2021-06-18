const { response } = require('express');
const bodyParser=require('body-parser');
const express = require('express');
const mysql=require('mysql');
const app=express();   
const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'testapi'
});
app.listen('4000',()=>{
    console.log("App started at port 4000");
});
app.use(function (req, res,next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
    });

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())
db.connect((err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log("Db connected succesfully");
    
});
app.get('/user',(req,res)=>{
        let query="SELECT * from usertable";
        res.set('Content-Type','application/json');
        db.query(query,(err,result)=>{
            if(err){
                res.status(400).send("Bad Request");
                throw err;
            }
            res.status(200).send(result);
        })

})
app.get('/user/:id',(req,res)=>{
    let user_id=req.params.id
    let query=`SELECT * from usertable WHERE usertable.id=${user_id}`;
    res.set('Content-Type','application/json')
    db.query(query,(err,result)=>{
        if(err){
            res.status(400).send("User not found")
            throw err;
        }
        res.status(200).send(result);
    })
})
app.post('/user',(req,res)=>{
        //const body=req.body
        let name=req.body.name;
        let age=req.body.age;
        let course=req.body.course;
        let query=`INSERT INTO usertable(id,Name,Course,Age) VALUES (NULL,'${name}','${course}','${age}')`;
        db.query(query,(err,result)=>{
            if(err){
                res.status(400).send('Conflict in inserting data make sure to use X-www-form-urlencoded before sending')
                throw err;
            }
             res.set('Content-Type','application/json')
             let r={body:"Insertion succesfull"};
             r=JSON.stringify(r);
             res.status(200).send(r)
        })
        
})
app.put('/user/:id',(req,res)=>{
        let user_id=req.params.id
        let body=req.body
        let course=body.course;
        console.log(body);
        res.set('Content-Type','application/json')
        let query=`UPDATE usertable SET Course='${course}' WHERE usertable.id=${user_id}`;
        db.query(query,(err,result)=>{
            if(err){
                res.status(400).send('Conflict in updating data make sure to use X-www-form-urlencoded before sending and have a field Course in body')
                throw err;
            }
            let r={body:"Updation Succesfull"};
            r=JSON.stringify(r);
            res.status(200).send(r);
        })

});
app.delete('/user/:id',(req,res)=>{
        let user_id=req.params.id;
        res.set('Content-Type','application/json')
        let query=`DELETE from usertable WHERE usertable.id=${user_id}`;
        db.query(query,(err,result)=>{
            
            if(err){
                res.status(400).send("Conflict in deleting data make sure the id is appropriate")
                throw err;
            }
            let r={body:"User Deletion SUCCESFULL"};
            r=JSON.stringify(r);
            res.status(200).send(r);
        })
});