import { useEffect, useState, useRef } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState(["heyy", "hello"]);
  const wsRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    wsRef.current = ws;
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      ws.send(JSON.stringify({
        "type": "join",
        "payload": {
          "roomId": "red"
        }
      }))
    }

    ws.onmessage = (event) => {
      setMessages(prevMessages => [...prevMessages, event.data]);

    }

    return () => {
      ws.close();
    }
  }, [])

  return (
    <div className="flex flex-col h-screen center-items">
    <div className='h-screen bg-gray-100'>
      <br /><br /><br />
      <div className="h-5/6 overflow-y-scroll border border-gray-300 bg-gray-200">
        {messages.map(message => <div className='m-8'>
        <span className="bg-white text-black rounded p-4">
          {message}
        </span>
        </div>)}
      </div>
      <div className='w-full bg-white flex'>
        <input ref={inputRef} id="message" className='flex-1 p-4 text-black'></input>
        <button onClick={() => {
          const message = inputRef.current?.value;
          wsRef.current?.send(JSON.stringify({
            "type": "chat",
            "payload": {
              "message": message
            }
          }))
          inputRef.current.value = '';
        }
        } className='bg-blue-500 text-white p-4'>Send</button>
      </div>
      
    </div>
    </div>
  )
}

export default App
