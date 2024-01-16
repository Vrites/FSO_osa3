import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './Notification'
import './index.css'

const Persons = ({persons, deleteHandler}) => {
	
	return(
		<div>
			{persons.map((person, i) => 
				<h4 key={i} >
					{person.name} {person.number} <button onClick={() => deleteHandler(person.id, person.name)}>Delete</button>
				</h4>
			)}
		</div>
	)
}

const Filter = ({handler}) => {
	return(
		<div>
			Filter: <input onChange={handler} />
		</div>
	)
}

const PersonForm = ({submitHandler, nameHandler, numberHandler}) => {
	return(
		<form onSubmit={submitHandler}>
      <div>
        Name: <input onChange={nameHandler} />
			</div>
			<div>
				Number: <input onChange={numberHandler}/>
			</div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
	)
}

const App = () => {
  const [persons, setPersons] = useState([]) 
	const [filteredPersons, setFilteredPersons] = useState([])
  const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [notifMsg, setNotifMsg] = useState('')

	useEffect(() => {
		personService
		.getAll()
		.then(response => {
			setPersons(response.data)
			setFilteredPersons(response.data)
		})
	}, [])

	const addName = (event) => {
		event.preventDefault()
		const personObject = {
			name: newName,
			number: newNumber,
		}
		if(persons.some(person => person.name == newName)) {
			setNotifMsg(
				`error: ${newName} already exists`
			)
			setTimeout(() => {
				setNotifMsg(null)
			}, 5000)
		}
		else{
			personService
				.create(personObject)
				.then(response => {
					setPersons(persons.concat(response.data))
					setFilteredPersons(filteredPersons.concat(response.data))
					setNotifMsg(
						`success: ${newName} added`
					)
					setTimeout(() => {
						setNotifMsg(null)
					}, 5000)
				})
			
		}
		
	}

	const handleNameChange = (event) => {
		setNewName(event.target.value)
	}

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value)
	}

	const handleSearchChange = (event) => {
		const searchValue = event.target.value
		let updatedList = [...persons]
		updatedList = updatedList.filter((item) => {
			return item.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
		})
		setFilteredPersons(updatedList)
	}

	//id=id JSON tiedostossa ja
	//i=indexi poistokyselyyn sekä näkyvän listan päivittämiseen
	const deleteHandler = (id, name) => {
		if(window.confirm(`Delete ${name}?`)){
			personService.deleteEntry(id)

			//Haluan että toiminnallisuus säilyy, mutta en halua refaktoroida alusta
			//tämä spagetti siis lopputuloksena
			//eli vaikka haku olisi päällä niin molemmat listat päivittyvät
			//part1
			let updatedPersonList = [...persons]
			const deletePersonIndex = updatedPersonList.map((e) => {return e.name}).indexOf(name)
			updatedPersonList.splice(deletePersonIndex, 1)
			setPersons(updatedPersonList)

			//part2
			//useEffectillä tämä korjattaisiin, mutta tajusin vasta osan lopussa
			let updatedFilterList = [...filteredPersons]
			const deleteFilterIndex = updatedFilterList.map((e) => {return e.name}).indexOf(name)
			updatedFilterList.splice(deleteFilterIndex, 1)
			setFilteredPersons(updatedFilterList)

			setNotifMsg(
				`success: ${name} removed`
			)
			setTimeout(() => {
				setNotifMsg(null)
			}, 5000)
		}

	}


  return (
    <div>
			<Notification message={notifMsg} />
      <h2>Phonebook</h2>
			<Filter handler={handleSearchChange} />
			<h2>Add</h2>
			<PersonForm 
				submitHandler={addName} 
				nameHandler={handleNameChange} 
				numberHandler={handleNumberChange} 
			/>
      
      <h2>Numbers</h2>
			<Persons persons={filteredPersons} deleteHandler={deleteHandler}/>
    </div>
  )

}

export default App