// Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chat = ({ currentUserName, chatPartnerName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/messages');
        const filteredMessages = response.data.filter(m => {
          const senderName = m.sender?.name || m.senderName || '';
          const receiverName = m.receiver?.name || m.receiverName || '';
          return (
            (senderName === currentUserName && receiverName === chatPartnerName) ||
            (senderName === chatPartnerName && receiverName === currentUserName)
          );
        });
        setMessages(filteredMessages);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages', error);
      }
    };

    fetchMessages();

    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [currentUserName, chatPartnerName]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await axios.post('/messages/send', {
        name: chatPartnerName,
        content: newMessage.trim(),
      });
      setNewMessage('');
      const response = await axios.get('/messages');
      const filteredMessages = response.data.filter(m => {
        const senderName = m.sender?.name || m.senderName || '';
        const receiverName = m.receiver?.name || m.receiverName || '';
        return (
          (senderName === currentUserName && receiverName === chatPartnerName) ||
          (senderName === chatPartnerName && receiverName === currentUserName)
        );
      });
      setMessages(filteredMessages);
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Chat cu {chatPartnerName}</h2>
      <div
        style={{
          border: '1px solid #ddd',
          height: '400px',
          overflowY: 'auto',
          padding: 10,
          marginBottom: 10,
          backgroundColor: '#f9f9f9',
        }}
      >
        {messages.length === 0 && <p>Nu există mesaje.</p>}
        {messages.map((msg) => {
          const isSentByCurrentUser = msg.sender?.name === currentUserName || msg.senderName === currentUserName;
          return (
            <div
              key={msg.id}
              style={{
                marginBottom: 10,
                textAlign: isSentByCurrentUser ? 'right' : 'left',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: isSentByCurrentUser ? '#daf8cb' : '#fff',
                  padding: '8px 12px',
                  borderRadius: 20,
                  maxWidth: '70%',
                  wordBreak: 'break-word',
                }}
              >
                <p style={{ margin: 0 }}>{msg.content}</p>
                <small style={{ fontSize: 10, color: '#555' }}>
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </small>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <textarea
        rows={3}
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Scrie un mesaj către ${chatPartnerName}...`}
        style={{ width: '100%', padding: 10, borderRadius: 8, borderColor: '#ccc' }}
      />
      <button
        onClick={handleSendMessage}
        style={{ marginTop: 10, padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}
      >
        Trimite
      </button>
    </div>
  );
};

export default Chat;
