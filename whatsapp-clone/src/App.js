import React, { useEffect, useState } from "react";
import './App.css';
import Sidebar from './Sidebar.js';
import Chat from './Chat.js';
import Pusher from "pusher-js";
import instance from "./axios";

function App() {

  const [messages, setMessages] = useState([]);

  useEffect(()=> {
    instance.get("/messages/sync").then((response) => {
      setMessages(response.data)
    });
  }, [])

  useEffect(() => {
    var pusher = new Pusher('8b6e11f63c62633cd696', {
      cluster: 'ap1'
    });

    var channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      alert(JSON.stringify(newMessage));
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  console.log(messages);
  
  return (
    <div className="app">
      <div className="app_body">
        <Sidebar />
        <Chat messages={messages} />
      </div>

    </div>
  );
}

export default App;
