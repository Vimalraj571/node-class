// const express = require('express')
import express from 'express';
import bodyParser from 'body-parser';
const app = express()
const port = 3000

let students = [
  {
    id: 1,
    name: 'test1'
  },
  {
    id: 2,
    name: 'test2'
  },
]

// Sample Middleware
app.use((req, res, next) => {
  console.log(new Date());
  next()
})

// How to use Middleware
app.use(bodyParser.json())

// Sample REST API
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/student/:id', (req, res) => {
  // console.log(req.params, 'req.params');
  const result = students.find(s => s.id === parseInt(req.params.id))
  console.log(result);
  if (result) {
    return res.json(result);
  }
  return res.json({ error: 'Not Found' })
})

app.get('/student/', (req, res) => {
  return res.json(students)
})

app.post('/student', (req, res) => {
  const student = req.body;
  console.log(req.body)
  const isPresentAlready = students.some(s => s.name === student.name)
  if (isPresentAlready) {
    return res.json({ error: "User Already Found" })
  }
  students = [...students, student]
  return res.json({ message: "User Added Successfully" })
})

app.delete('/student/:id', (req, res) => {
  const id = Number(req.params.id)
  students = students.filter(student => student.id !== id)
  res.status(204).end()
})

app.put('/student/:id', (req, res) => {
  const id = Number(req.params.id)
  const isPresentAlready = students.some(s => s.id === id)
  if (!isPresentAlready) {
    return res.json({ error: "User Not Found" })
  }
  let student = students.find(s => s.id === id);
  let tempStu = { ...student, name: req.body.name }
  let temp = students.filter(s => s.id !== id)
  students = [...temp, tempStu]
  console.log(students)
  return res.json({ message: "User Edited Successfully" })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})