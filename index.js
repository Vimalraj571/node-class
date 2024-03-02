
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import mysql from 'mysql2/promise';

dotenv.config()

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

const connection = await mysql.createPool({
  host: 'sql6.freemysqlhosting.net',
  user: 'sql6687938',
  password: 'gkkigEXGwS',
  database: 'sql6687938',
});

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

app.get('/student/', async (req, res) => {
  // return res.json(students)
  try {
    const [results, fields] = await connection.query(
      'SELECT * FROM `students`'
    );
    return res.send(results)
  } catch (err) {
    console.log(err);
  }
})

app.get('/student/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const [results] = await connection.query(
      'SELECT * FROM `students` WHERE `id` = ?',
      [id]
    );
    return res.json(results[0])
  } catch (err) {
    console.log(err);
  }
})

app.post('/student', async (req, res) => {
  const student = req.body;
  // Here
  try {
    const [results] = await connection.query(
      'SELECT * FROM `students` WHERE `name` = ?',
      [student.name]
    );
    isPresentAlready = results.listen !== 0;
    if (isPresentAlready) {
      return res.json({ error: "User Already Found" })
    }
    const [results2] = await connection.query(
      'INSERT INTO plans (`id`, `name`) VALUES (?,?,?)',
      [results.length + 1, student.name]
    );

    return res.json({ message: "User Added Successfully" })
  } catch (err) {
    console.log(err);
  }
})

app.delete('/student/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const [results] = await connection.query(
      'DELETE FROM `students` WHERE `id` = ?',
      [id]
    );
    res.status(204).end()
  } catch (err) {
    console.log(err);
  }
})

app.put('/student/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const [results] = await connection.query(
      'UPDATE `students` SET name = ? WHERE `id` = ?',
      [req.body.name, id]
    );
    return res.json({ message: "User Edited Successfully" })
  } catch (err) {
    console.log(err);
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
