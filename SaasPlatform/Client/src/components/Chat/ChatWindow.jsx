import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatWindow.css';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatFooter from './ChatFooter';

const ChatWindow = ({ receiver, onClose, currentUserId, socket }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const messagesEndRef = useRef(null);
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

    useEffect(() => {
        if (socket) {
            socket.on("getMessage", (newMessage) => {
                // If the incoming message belongs to the currently open chat
                if (newMessage.sender._id === receiver?._id || newMessage.receiverGroup === receiver?._id) {
                    setMessages(prev => [...prev, newMessage]);
                }
            });
        }
        return () => socket?.off("getMessage");
    }, [socket, receiver]);

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

    if (!receiver) return null;

    return (
        <div className="chat-popup">
            <ChatHeader 
                title={isGroup ? receiver.name : receiver.fullName} 
                onClose={onClose} 
            />
            
            <div className="chat-messages">
                {messages.map(m => {
                    const senderId = m.sender._id ? m.sender._id : m.sender;
                    const isMine = String(senderId) === String(currentUserId);
                    
                    return (
                        <ChatMessage 
                            key={m._id} 
                            message={m} 
                            isMine={isMine} 
                            isGroup={isGroup} 
                        />
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <ChatFooter 
                text={text} 
                setText={setText} 
                onSendMessage={sendMessage} 
            />
        </div>
    );
};

export default ChatWindow;