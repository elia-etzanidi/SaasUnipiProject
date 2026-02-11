const ChatMessage = ({ message, isMine, isGroup }) => {
    return (
        <div className={isMine ? 'msg-sent' : 'msg-received'}>
            {isGroup && !isMine && (
                <span className="sender-name-label">{message.sender?.fullName}</span>
            )}
            <div className="bubble">{message.text}</div>
        </div>
    );
};

export default ChatMessage;