const express = require('express');
const app = express();
const bodyParser= require('body-parser')
var cors = require('cors')

var porta = process.env.PORT || 3001;



app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())


const MongoClient = require('mongodb').MongoClient
const connectionString = "mongodb+srv://rodrigo147:147803106@cluster0.llz7v.mongodb.net/acesse?retryWrites=true&w=majority"

MongoClient.connect(connectionString,  (err, client) => {
   
    app.get('/',  async function  (req, res) {
        const db = client.db('acesse')
        const quotesCollection = await db.collection('coffee').find().toArray()
        //console.log(quotesCollection)
        res.json(quotesCollection)
      })
      app.post('/add',  async function  (req, res) {
        const db = client.db('acesse')
        var a = await (await db.collection('coffee').find().toArray())
        //console.log(a)
        var b = await (db.collection('coffee').find({ colaborador:req.body.colaborador  }).toArray())
          console.log(b.length)
        if ( b.length  >= 1){
          res.json({st: 0, msg: "o colaborador já está no café"})
          }else{
             if ( a.length >= 3){
            res.json({st: 0, msg: "espere um colaborador voltar :)"})
          }else{
              const quotesCollection = await db.collection('coffee') 
              quotesCollection.insertOne({colaborador: req.body.colaborador})
              res.json({st: 1, msg: "colaborador em horário de café"}) 
       }
         }
      }) 
      app.post('/remove',  async function  (req, res) {
        const db = client.db('acesse')
        const quotesCollection = await db.collection('coffee').deleteOne({colaborador: req.body.colaborador})
        res.json({msg: "sucesso"})
      })
  })




app.listen(porta  , function() {
    console.log('listening on 3000')
  })