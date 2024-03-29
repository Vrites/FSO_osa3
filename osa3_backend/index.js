const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('person', function getPerson (req) {
	return JSON.stringify(req.body)
})

app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
app.use(express.static('dist'))
app.use(express.json())


let persons = [
	{ 
		"name": "Arto Hellas", 
		"number": "040-123456",
		"id": 1
	},
	{ 
		"name": "Ada Lovelace", 
		"number": "39-44-5323523",
		"id": 2
	},
	{ 
		"name": "Dan Abramov", 
		"number": "12-43-234345",
		"id": 3
	},
	{ 
		"name": "Mary Poppendieck", 
		"number": "39-23-6423122",
		"id": 4
	}
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
	}
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/info', (request, response) => {
	const count = persons.length
	const date = new Date()
	response.send(`Phonebook has info for ${count} people <br/><br/> ${date}`)
})

const generateId = () => {
  const randId = Math.floor(Math.random() * 1000)
  return randId
}


app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing!' 
    })
  } else if (persons.some(person => person.name == body.name)) {
		return response.status(400).json({
			error: 'name must be unique'
		})
	}

  const person = {
    name: body.name,
		number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.port || 3001
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})