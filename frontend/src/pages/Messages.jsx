import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import Topbar from '../components/Topbar';
import Loader from '../components/Loader';
import { io } from 'socket.io-client';

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : 'U';
const getAvatarClass = (name) => {
  const classes = ['avatar-grad-1','avatar-grad-2','avatar-grad-3','avatar-grad-4','avatar-grad-5'];
  return classes[(name || 'U').charCodeAt(0) % classes.length];
};

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    if (user) {
      axiosInstance.get('/messages/conversations')
        .then(res => setConversations(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
    return () => socketRef.current.disconnect();
  }, [user]);

  useEffect(() => {
    if (activeConv) {
      axiosInstance.get(`/messages/${activeConv._id}`)
        .then(res => setMessages(res.data))
        .catch(console.error);
    }
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;
    
    const receiver = activeConv.participants.find(p => p._id !== user._id);
    
    try {
      const res = await axiosInstance.post('/messages', {
        receiverId: receiver._id,
        text: newMessage
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
      
      // Update conv list
      setConversations(prev => prev.map(c => 
        c._id === activeConv._id 
          ? { ...c, lastMessage: { text: res.data.text, senderId: user._id, timestamp: res.data.createdAt } }
          : c
      ));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-fade" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Topbar title="Messages" />
      <div className="chat-layout">
        
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input type="text" className="input" placeholder="Search conversations..." style={{ borderRadius: 20 }} />
            </div>
          </div>
          <div className="chat-list">
            {loading ? <Loader /> : conversations.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No conversations yet.</div>
            ) : (
              conversations.map(conv => {
                const otherUser = conv.participants.find(p => p._id !== user._id);
                if (!otherUser) return null;
                return (
                  <div 
                    key={conv._id} 
                    className={`chat-item ${activeConv?._id === conv._id ? 'active' : ''}`}
                    onClick={() => setActiveConv(conv)}
                  >
                    <div className={`avatar-md ${getAvatarClass(otherUser.name)}`} style={{ color: 'white' }}>
                      {otherUser.photo ? <img src={otherUser.photo} style={{width:'100%',borderRadius:'50%'}}/> : getInitials(otherUser.name)}
                    </div>
                    <div className="chat-info">
                      <div className="chat-name">{otherUser.name}</div>
                      <div className="chat-last">{conv.lastMessage?.text || 'No messages yet'}</div>
                    </div>
                    <div className="chat-meta">
                      {conv.lastMessage && (
                        <div className="chat-time">
                          {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Chat */}
        <div className="chat-main">
          {activeConv ? (
            <>
              <div className="chat-topbar">
                <div className="flex items-center gap-12">
                  <div className={`avatar-md ${getAvatarClass(activeConv.participants.find(p => p._id !== user._id)?.name)}`} style={{ color: 'white' }}>
                    {getInitials(activeConv.participants.find(p => p._id !== user._id)?.name)}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 15 }}>
                      {activeConv.participants.find(p => p._id !== user._id)?.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--success)' }}>Online</div>
                  </div>
                </div>
              </div>
              
              <div className="messages-area">
                {messages.map((msg, i) => {
                  const isSent = msg.senderId === user._id;
                  return (
                    <div key={i} className={`message ${isSent ? 'sent' : 'received'}`}>
                      {!isSent && (
                        <div className={`avatar-sm ${getAvatarClass('U')}`} style={{ color: 'white', marginTop: 'auto' }}>
                          {getInitials(activeConv.participants.find(p => p._id !== user._id)?.name)}
                        </div>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isSent ? 'flex-end' : 'flex-start' }}>
                        <div className="msg-bubble">{msg.text}</div>
                        <div className="msg-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-input-bar" onSubmit={handleSend}>
                <input 
                  type="text" 
                  className="chat-input" 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-btn">➤</button>
              </form>
            </>
          ) : (
            <div className="chat-empty">
              <div className="chat-empty-icon">💬</div>
              <div style={{ fontSize: 18, fontFamily: 'var(--font-head)', fontWeight: 600 }}>Your Messages</div>
              <div>Select a conversation to start chatting</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
