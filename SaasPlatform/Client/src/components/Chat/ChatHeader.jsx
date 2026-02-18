const ChatHeader = ({ title, onClose }) => (
    <div className="chat-header">
        <span>💬 {title}</span>
        <button onClick={onClose} className="close-chat">×</button>
    </div>
);

export default ChatHeader;