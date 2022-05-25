import { useState, useEffect, useRef } from 'react'

import Note from './components/Note'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Footer from './components/Footer'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'

import noteService from './services/notes'
import loginService from './services/login'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      setUser(user)
      noteService.setToken(user.token)
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
      })
      .catch(() => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter((n) => n.id !== id))
      })
  }

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote))
    })
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  const noteFormRef = useRef()

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {user === null ? (
        <Togglable buttonLabel="login">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      ) : (
        <div>
          <p>{user.name} logged in</p>
          <Togglable buttonLabel="new note" ref={noteFormRef}>
            <NoteForm createNote={addNote} />
          </Togglable>
        </div>
      )}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <Footer />
    </div>
  )
}

export default App

// MODULE 1

// const Display = (props) => {
//   return <div>{props.counter}</div>
// }

// const Button = (props) => {
//   return <button onClick={props.onClick}>{props.text}</button>
// }

// const App = () => {
//   const [counter, setCounter] = useState(2)

//   const increaseByOne = () => setCounter(counter + 1)
//   const decreaseByOne = () => setCounter(counter - 1)
//   const setToZero = () => setCounter(0)

//   return (
//     <div>
//       <Display counter={counter} />
//       <Button onClick={increaseByOne} text="plus" />
//       <Button onClick={setToZero} text="zero" />
//       <Button onClick={decreaseByOne} text="minus" />
//     </div>
//   )
// }

// MODULE 2

// const History = (props) => {
//   if (props.allClicks.length === 0) {
//     return <div>the app is used by pressing the buttons</div>
//   }
//   return <div>button press history: {props.allClicks.join(' ')}</div>
// }

// const Button = ({ handleClick, text }) => (
//   <button onClick={handleClick}>{text}</button>
// )

// const App = () => {
//   const [left, setLeft] = useState(0)
//   const [right, setRight] = useState(0)
//   const [allClicks, setAll] = useState([])

//   const handleLeftClick = () => {
//     setAll(allClicks.concat('L'))
//     setLeft(left + 1)
//   }

//   const handleRightClick = () => {
//     setAll(allClicks.concat('R'))
//     setRight(right + 1)
//   }

//   return (
//     <div>
//       {left}
//       <Button handleClick={handleLeftClick} text="left" />
//       <Button handleClick={handleRightClick} text="right" />
//       {right}
//       <History allClicks={allClicks} />
//     </div>
//   )
// }

// MODULE 3

// const App = () => {
//   const [value, setValue] = useState(10)

//   return (
//     <div>
//       {value}
//       <button onClick={() => setValue(0)}>button</button>
//     </div>
//   )
// }

// MODULE 3 MODIFICATION

// const App = () => {
//   const [value, setValue] = useState(10)

//   const setToValue = (newValue) => {
//     console.log('value now', newValue)
//     setValue(newValue)
//   }

//   return (
//     <div>
//       {value}
//       <button onClick={() => setToValue(1000)}>thousand</button>
//       <button onClick={() => setToValue(0)}>reset</button>
//       <button onClick={() => setToValue(value + 1)}>increment</button>
//     </div>
//   )
// }

// MODULE 4
// import Note from './components/Note'

// const App = () => {
//   const [notes, setNotes] = useState([])
//   const [newNote, setNewNote] = useState('a new note...')
//   const [showAll, setShowAll] = useState(true)

//   useEffect(() => {
//     console.log('effect')

//     const eventHandler = (response) => {
//       console.log('promise fulfilled')
//       setNotes(response.data)
//     }

//     const promise = axios.get('http://localhost:3001/notes')
//     promise.then(eventHandler)
//   }, [])

//   const addNote = (event) => {
//     event.preventDefault()
//     const noteObject = {
//       content: newNote,
//       date: new Date().toISOString(),
//       important: Math.random() < 0.5,
//       id: notes.length + 1,
//     }

//     axios.post('http://localhost:3001/notes', noteObject).then((response) => {
//       setNotes(notes.concat(response.data))
//       setNewNote('')
//       console.log(response)
//     })
//   }

//   const toggleImportanceOf = (id) => {
//     const url = `http://localhost:3001/notes/${id}`
//     const note = notes.find((n) => n.id === id)
//     const changedNote = { ...note, important: !note.important }

//     axios.put(url, changedNote).then((response) => {
//       setNotes(notes.map((note) => (note.id !== id ? note : response.data)))
//     })
//   }

//   const handleNoteChange = (event) => {
//     console.log(event.target.value)
//     setNewNote(event.target.value)
//   }

//   const notesToShow = showAll ? notes : notes.filter((note) => note.important)

//   return (
//     <div>
//       <h1>Notes</h1>
//       <div>
//         <button onClick={() => setShowAll(!showAll)}>
//           show {showAll ? 'important' : 'all'}
//         </button>
//       </div>
//       <ul>
//         {notesToShow.map((note) => (
//           <Note
//             key={note.id}
//             note={note}
//             toggleImportance={() => toggleImportanceOf(note.id)}
//           />
//         ))}
//       </ul>
//       <form onSubmit={addNote}>
//         <input value={newNote} onChange={handleNoteChange} />
//         <button type="submit">save</button>
//       </form>
//     </div>
//   )
// }

// export default App

// MODULE 4 Simplified
