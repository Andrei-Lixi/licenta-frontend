import React, { useState, useEffect, useRef } from 'react'; 
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Sidebar } from 'primereact/sidebar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import BaraMeniu from "../components/BaraMeniu";



function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [newReceiver, setNewReceiver] = useState(''); // pentru chat nou
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { fetchMessages(); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, selectedReceiver]);

  async function fetchMessages() {
    setLoading(true);
    try {
      const res = await fetch('/messages');
      if (!res.ok) throw new Error('Nu am putut prelua mesajele');
      setMessages(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(e) {
    e.preventDefault();

    // Alegem receptorul din selectedReceiver sau newReceiver
    const receiver = selectedReceiver === 'NEW_CHAT' ? newReceiver.trim() : selectedReceiver;

    if (!receiver) return setError('Completează numele destinatarului');
    if (!content) return setError('Completează mesajul');

    setSending(true);
    try {
      const res = await fetch('/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: receiver, content })
      });
      if (!res.ok) throw new Error('Eroare trimitere');
      const json = await res.json();
      setMessages(prev => [...prev, json.message]);
      setContent('');
      setError(null);
      if(selectedReceiver === 'NEW_CHAT') {
        setSelectedReceiver(receiver); // setăm receptorul nou ca selectat
        setNewReceiver('');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  const currentUserName = messages[0]?.sender.name;
  const chats = [...new Set(messages.map(m => 
    m.sender.name === currentUserName ? m.receiver.name : m.sender.name
  ))];

  // Dacă e chat nou, nu filtrăm după nimic
  const filtered = selectedReceiver && selectedReceiver !== 'NEW_CHAT' 
    ? messages.filter(m => {
      const other = m.sender.name === currentUserName ? m.receiver.name : m.sender.name;
      return other === selectedReceiver;
    })
    : [];

  return (
    <div className="h-screen flex justify-content-center align-items-center" style={{
          backgroundImage: 'url(/images/chat.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          width: '100%',
        }}>
<BaraMeniu />
      <Splitter layout="horizontal" style={{ height: '80vh', width: '90vw', maxWidth: '1000px' }}>

        <SplitterPanel size={25} minSize={20} className="p-p-0">
          <Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)}>
  <h3>Conversații</h3>
  {chats.map(name => (
    <div key={name}
         className={`p-py-2 p-px-3 p-mb-2 cursor-pointer ${selectedReceiver === name ? 'p-bg-primary p-text-white' : 'p-bg-white'}`}
         onClick={() => setSelectedReceiver(name)}>
      {name}
    </div>
  ))}


  <div className="p-mt-3 p-text-center">
    <Button 
      icon="pi pi-plus" 
      className="p-button-rounded p-button-sm" 
      aria-label="Începe o conversație nouă"
      onClick={() => { 
        setSelectedReceiver('NEW_CHAT'); 
        setContent(''); 
        setNewReceiver(''); 
        setError(null); 
      }} 
      tooltip="Începe o nouă conversație"
      tooltipOptions={{ position: 'top' }}
    />
  </div>
</Sidebar>

        </SplitterPanel>
        <SplitterPanel className="flex flex-column">
          <div className="p-d-flex p-jc-between p-ai-center p-p-2 p-shadow-1 border-bottom">
            <Button icon="pi pi-bars" onClick={() => setSidebarVisible(true)} aria-label="Meniu convo"/>
            <h2>{selectedReceiver === 'NEW_CHAT' ? 'Nouă conversație' : (selectedReceiver || 'Alege o conversație')}</h2>
          </div>
          <div className="p-flex-1 p-p-3 overflow-auto">
            {loading && <p>Se încarcă...</p>}
            {!selectedReceiver && !loading && <p>Alege o conversație din meniul lateral.</p>}
            {selectedReceiver && selectedReceiver !== 'NEW_CHAT' && filtered.map(msg => {
              const sent = msg.sender.name === currentUserName;
              return (
                <div 
                key={msg.id} className={`p-my-2 flex ${sent ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`p-p-2 p-shadow-1 surface-card ${sent ? 'bg-green-100' : 'bg-white'}`}>
                    <div className="p-text-bold">{sent ? 'Tu' : msg.sender.name}</div>
                    <div>{msg.content}</div>
                    <small className="p-text-secondary">{msg.createdAt}</small>
                  </div>
                </div>
              );
            })}
            <div ref={endRef}></div>
          </div>
          {selectedReceiver && (
            <form onSubmit={handleSend} className="p-p-2 border-top flex flex-column">
              {/* Dacă e chat nou, afișăm input să alegi numele receptorului */}
              {selectedReceiver === 'NEW_CHAT' && (
                <input 
                  type="text"
                  value={newReceiver}
                  onChange={e => setNewReceiver(e.target.value)}
                  placeholder="Numele destinatarului"
                  className="p-inputtext p-component p-mb-2"
                  disabled={sending}
                  required
                />
              )}
              <InputTextarea
                value={content}
                rows={1}
                autoResize
                onChange={e => setContent(e.target.value)}
                className="flex-1 p-mr-2"
                placeholder="Scrie mesajul..."
                disabled={sending}
              />
              <Button label={sending ? 'Se trimite...' : 'Trimite'} icon="pi pi-send" type="submit" disabled={sending} />
            </form>
          )}
          {error && <div className="p-text-danger p-p-2">{error}</div>}
        </SplitterPanel>
      </Splitter>
    </div>
  );
}

export default ChatPage;
