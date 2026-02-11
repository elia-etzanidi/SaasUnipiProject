import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatWindow.css';

const ChatWindow = ({ receiver, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const messagesEndRef = React.useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!receiver?._id) return;

            try {
                const res = await axios.get(`http://localhost:5000/api/messages/${receiver._id}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setMessages(res.data);
            } catch (err) { console.error(err); }
        };
        fetchMessages();
    }, [receiver?._id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!receiver) return null;

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            const res = await axios.post('http://localhost:5000/api/messages', 
                { receiver: receiver._id, text },
                { headers: { 'x-auth-token': localStorage.getItem('token') }}
            );
            setMessages([...messages, res.data]);
            setText('');
        } catch (err) { console.error(err); }
    };

    return (
        <div className="chat-popup">
            <div className="chat-header">
                <span>💬 {receiver.fullName}</span>
                <button onClick={onClose} className="close-chat">×</button>
            </div>
            <div className="chat-messages">
                {messages.map(m => (
                    <div key={m._id} className={m.sender === receiver._id ? 'msg-received' : 'msg-sent'}>
                        {m.text}
                    </div>
                ))}
            </div>
            <form className="chat-input" onSubmit={sendMessage}>
                <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatWindow;