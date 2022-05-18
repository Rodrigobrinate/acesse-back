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
      //  console.log(quotesCollection)
        res.json(quotesCollection)
      })
      app.post('/add',  async function  (req, res) {
        const db = client.db('acesse')
        var a = await (await db.collection('coffee').find().toArray())
        //console.log(a)
        var b = await (db.collection('coffee').find({ colaborador:req.body.colaborador  }).toArray())
          //console.log(b.length)
        if ( b.length  >= 1){
          res.json({st: 0, msg: "o colaborador já está no café"})
          }else{
             if ( a.length >= 3){
            res.json({st: 0, msg: "espere um colaborador voltar :)"})
          }else{
              const quotesCollection = await db.collection('coffee') 
              quotesCollection.insertOne({colaborador: req.body.colaborador, data: new  Date()})
              res.json({st: 1, msg: "colaborador em horário de café"}) 
       }
         }
      }) 

      app.post('/add-historic',  async function  (req, res) {
        const db = client.db('acesse')
        var a = await (await db.collection('coffee-historic').findOne({colaborador:req.body.colaborador, day: new  Date().getDate(), month: new  Date().getMonth(), year: new  Date().getFullYear()}))
        if (a){
         await db.collection('coffee-historic').update({colaborador:req.body.colaborador, day: new  Date().getDate(), month: new  Date().getMonth(), year: new  Date().getFullYear()}, { $set: { minutos: a.minutos + req.body.minutos }});
        console.log(a)}else {
          console.log(a)
        await db.collection('coffee-historic').insertOne({colaborador: req.body.colaborador,minutos: req.body.minutos, day: new  Date().getDate(), month: new Date().getMonth(), year: new Date().getFullYear()})
       }
       res.json({st: 1, msg: "colaborador terminou o horário de café"})
         
      })

      app.get('/historic',  async function  (req, res) {
        const db = client.db('acesse')
        const colaborador = await db.collection('coffee-historic').find({day: new  Date().getDate(), month: new  Date().getMonth(), year: new  Date().getFullYear()}).toArray()
      //  console.log(colaborador)
        res.json(colaborador)
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