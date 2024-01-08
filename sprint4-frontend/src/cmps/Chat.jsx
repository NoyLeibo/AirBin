import { useState, useEffect, useRef } from 'react';

export function ChatWindow() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { user: 'TeicherGPT', text: 'Hey! How can I help you?' },
        { user: 'Noy', text: 'hey' },
        { user: 'Iris', text: 'get ready to sprint 4' },
        { user: 'Boris', text: "we're gonna kill this sprint" },
    ]);


    const chatBodyRef = useRef(null);

    useEffect(() => {
        const chatBody = chatBodyRef.current;
        if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }, [chatHistory]);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const closeChat = () => {
        setIsChatOpen(false);
    };

    const sendMessage = () => {
        if (message.trim()) {
            setChatHistory([...chatHistory, { sender: 'You', text: message }]);
            setMessage('');
        }
    };
    return (
        <div>
            <div className={`${isChatOpen ? '' : 'hidden'} chat-window`}>
                <div className="chat-header">
                    TeicherGPT
                    <button className="chat-close" onClick={closeChat}>X</button>
                </div>
                <div className="chat-body" ref={chatBodyRef}>
                    {chatHistory.map((chat, index) => (
                        <div key={index}>
                            {chat.user === 'TeicherGPT' && <img src="https://a0.muscache.com/im/pictures/user/2be9ef7f-ef52-493c-a04d-650a7e16300c.jpg?im_w=240" alt="TeicherGPT" className="mini-user-chat" />}
                            <span className='bold underline'>{chat.user}</span>: {chat.text}
                        </div>
                    ))}
                </div>
                <div className="chat-footer">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className="send-button" onClick={sendMessage}>
                        Send
                    </button>
                </div>
            </div>
            <button className="chat-toggle" onClick={toggleChat}>
                {isChatOpen ? '' : '✏️Chat'}
            </button>
        </div>
    );
}