const express = require('express') 
const morgan = require('morgan') 

const app = express() 
app.use(express.json())

// To use tiny configuration: app.use(morgan('tiny'))

// To use custom configuration, first create token, then specify format
morgan.token('body', function (req, res) {
    // console.log(req.body)
    body = JSON.stringify(req.body)
    return body
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method) 
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('----')
    next() // yields control over to the next middleware
}

// app.use(requestLogger)

let persons = [
    {
      "name": "Arto Hellas",
      "number": "234-9088",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "202-3244",
      "id": 2
    },
    {
      "id": 3,
      "name": "Fish Monger",
      "number": "223-3829"
    },
    {
      "id": 4,
      "name": "Jack Hammer",
      "number": "222-3838"
    },
    {
      "id": 5,
      "name": "Mafeng Pam",
      "number": "234-8124"
    },
    {
      "id": 6,
      "name": "Michael Angelo",
      "number": "023-3828"
    }
  ]

app.get('/', (request, response) => {
    response.send("<h1>Hello world</h1>")
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id )
    // console.log(id)
    const person = persons.find(person => person.id === id) 
    // console.log(person)
    response.json(person)
})

app.get('/info', (request, response) => {
    const numOfPersons = persons.length 
    const date = new Date()
    response.send(
        `<p>Phonebook has info for ${numOfPersons} people</p><p>${date}</p>`
        )
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId = () => {
    return Math.ceil(Math.random() * 1000)
}

// Adding a new person 
app.post('/api/persons', (request, response) => {
    // console.log("Request:", request)
    const body = request.body 
    // console.log("Body:", body)
    const name = body.name || false 
    const number = body.number || false 
    let foundPerson
    if (name) {
        foundPerson = persons.find(person => 
            person.name.toLowerCase() === name.toLowerCase()
        ) 
    } else {
        foundPerson = false
    }
    // console.log("Found person:", foundPerson)
    const duplicateFound = Boolean(foundPerson) || false

    if (duplicateFound || !name || !number) {
        console.log("duplicate found, or error detected")
        return response.status(400).json({
            error: "Name must be unique"
        })
    }
    
    const person = {
        name: name, number: number, id: generateId()
    }
    persons.concat(person)
    console.log("No error detected, passing person out")
    response.json(person) 
})

const unkwownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    })
}

app.use(unkwownEndpoint)

const PORT = 3001
app.listen(PORT)
console.log(`Server is listening on port ${PORT}`)