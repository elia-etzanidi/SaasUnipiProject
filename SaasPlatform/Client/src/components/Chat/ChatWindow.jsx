import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatWindow.css';

const ChatWindow = ({ receiver, onClose, currentUserId }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const messagesEndRef = React.useRef(null);
    const isGroup = receiver && !receiver.fullName;

    useEffect(() => {
        const fetchMessages = async () => {
            if (!receiver?._id) return;

            const url = isGroup 
                ? `http://localhost:5000/api/messages/group/${receiver._id}`
                : `http://localhost:5000/api/messages/${receiver._id}`;

            try {
                const res = await axios.get(url, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setMessages(res.data);
            } catch (err) { console.error(err); }
        };
        fetchMessages();
    }, [receiver?._id, isGroup]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!receiver) return null;

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        const payload = isGroup 
            ? { groupId: receiver._id, text } 
            : { receiver: receiver._id, text };

        try {
            const res = await axios.post('http://localhost:5000/api/messages', payload, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setMessages([...messages, res.data]);
            setText('');
        } catch (err) { console.error(err); }
    };

    return (
        <div className="chat-popup">
            <div className="chat-header">
                <span>💬 {isGroup ? receiver.name : receiver.fullName}</span>
                <button onClick={onClose} className="close-chat">×</button>
            </div>
            
            <div className="chat-messages">
                {messages.map(m => {
                    // Check if the sender is the current user
                    // Check if sender is an object (for group messages) or just an ID (for direct messages)
                    const senderId = m.sender._id ? m.sender._id : m.sender;
                    const isMine = String(senderId) === String(currentUserId);

                    return (
                        <div key={m._id} className={isMine ? 'msg-sent' : 'msg-received'}>
                            {isGroup && !isMine && (
                                <span className="sender-name-label">{m.sender.fullName}</span>
                            )}
                            <div className="bubble">{m.text}</div>
                        </div>
                    );
                })}
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