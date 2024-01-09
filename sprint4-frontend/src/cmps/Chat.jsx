import { useState, useEffect, useRef } from 'react';

export function ChatWindow() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { user: 'TeicherGPT', text: 'Hey! How can AirBNB help you?' },
        { user: 'Noy', text: 'Im looking for apartment' },
        { user: 'Iris', text: 'Exlusive hotel?' },
        { user: 'Boris', text: "How can I host here?" },
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
            setChatHistory([...chatHistory, { user: 'You', text: message }]);
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
                            {chat.user === 'TeicherGPT' && <img src="https://ca.slack-edge.com/T05H7RU7LTF-U05UWSQH8AJ-f9c6e9003504-72" alt="TeicherGPT" className="mini-user-chat" />}
                            <span className='fs17 bold underline blacktxt'>{chat.user}</span>: <span className='fs16'>{chat.text}</span>
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