const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const fs = require('fs')

const app = express()

app.use(cors())
app.use(bodyParser.json())

const data_file = 'data.json'
let data = []

app.get('/', (req,res) => {
    fs.readFile(data_file,(err,content)=>{
        data = JSON.parse(content);
        res.status(200).send(data)
    })
})

app.post('/', (req,res) => {
    const todo = req.body
    fs.readFile(data_file,(err,content)=>{
        data = JSON.parse(content);
        todo.id = Math.round(Math.random()*1000)
        data.push(todo);
        fs.writeFile(data_file, JSON.stringify(data), ()=>{
            res.status(201).send({todo})
        })
    })
})

app.put('/', (req,res) => {
    const todo = req.body
    fs.readFile(data_file,(err,content)=>{
        data = JSON.parse(content);
        const copy = [...data]
        copy.forEach(d => {
            if(d.id === todo.id){
                d.title = todo.title
            }
        })
        fs.writeFile(data_file, JSON.stringify(copy), ()=>{
            res.status(201).send({todo})
        })
    })
})

app.delete('/:id', (req,res) => {
    const id = req.params.id
    console.log('ID > ',id);
    fs.readFile(data_file,(err,content)=>{
        data = JSON.parse(content);
        const filtered = data.filter(c=>c.id!== +id)
        console.log(filtered);
        fs.writeFile(data_file, JSON.stringify(filtered), ()=>{
            res.status(201).send({status:'Success'})
        })
    })
})

app.listen('5000', ()=>{
    console.log('API listening on port 5000 ...');
})