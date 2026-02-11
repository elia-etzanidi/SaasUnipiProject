const ChatFooter = ({ text, setText, onSendMessage }) => (
    <form className="chat-input" onSubmit={onSendMessage}>
        <input 
            type="text" 
            placeholder="Type a message..." 
            value={text}
            onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Send</button>
    </form>
);

export default ChatFooter;