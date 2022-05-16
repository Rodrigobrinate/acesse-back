const express = require('express');
const app = express();
const bodyParser= require('body-parser')
var cors = require('cors')


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
        console.log( await db.collection('coffee').find().toArray())
        if ( db.collection('coffee').find().toArray.length < 3){

       
        const quotesCollection = await db.collection('coffee') 
        quotesCollection.insertOne({colaborador: req.body.colaborador})
        res.json({st: 1, msg: "colaborador em horário de café"})
        }else{
             res.json({st: 0, msg: "espere um colaborador voltar :)"})
         }
      }) 
      app.post('/remove',  async function  (req, res) {
        const db = client.db('acesse')
        const quotesCollection = await db.collection('coffee').deleteOne({colaborador: req.body.colaborador})
        res.json({msg: "sucesso"})
      })
  })




app.listen(80, function() {
    console.log('listening on 3000')
  })