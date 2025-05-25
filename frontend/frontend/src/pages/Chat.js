import React, { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ScrollPanel } from "primereact/scrollpanel";
import { Avatar } from "primereact/avatar";
import BaraMeniu from "../components/BaraMeniu";

const ChatPage = () => {
  const [messagesAdmin, setMessagesAdmin] = useState([
    { text: "Bună! Cum te pot ajuta astăzi?", sender: "bot" },
  ]);
  const [messagesPerson, setMessagesPerson] = useState({});
  const [inputAdmin, setInputAdmin] = useState("");
  const [inputPerson, setInputPerson] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [chatWithAdmin, setChatWithAdmin] = useState(true);
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState("");

  const handleSendMessageAdmin = () => {
    if (inputAdmin.trim()) {
      setMessagesAdmin((prev) => [
        ...prev,
        { text: inputAdmin, sender: "user" },
        { text: "Vom răspunde în cel mai scurt timp.", sender: "bot" },
      ]);
      setInputAdmin("");
    }
  };

  const handleSendMessagePerson = () => {
    if (inputPerson.trim()) {
      setMessagesPerson((prev) => ({
        ...prev,
        [selectedChat]: [
          ...(prev[selectedChat] || []),
          { text: inputPerson, sender: "user" },
          {
            text: "Persoana a fost notificată. Vom răspunde în cel mai scurt timp.",
            sender: "bot",
          },
        ],
      }));
      setInputPerson("");
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailPattern.test(val));
  };

  const openChat = () => {
    if (!chatList.includes(email)) {
      setChatList([...chatList, email]);
    }
    setSelectedChat(email);
    setChatWithAdmin(false);
  };

  const removeChat = (emailToRemove) => {
    setChatList(chatList.filter((e) => e !== emailToRemove));
    if (selectedChat === emailToRemove) {
      setChatWithAdmin(true);
    }
  };

  const renderMessages = (messages) =>
    messages.map((msg, i) => (
      <div
        key={i}
        className={`flex mb-2 ${
          msg.sender === "user" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`px-3 py-2 border-round-xl max-w-3 ${
            msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {msg.text}
        </div>
      </div>
    ));

  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(135deg, #f0f8ff, #e6f7ff)" }}>
      <BaraMeniu />

      <div className="grid mt-4">
        {/* Sidebar Chat List */}
        <div className="col-12 md:col-3">
          <Card title="Chaturi Deschise" className="h-full">
            <div className="flex flex-column gap-2">
              {chatList.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    setEmail(item);
                    setSelectedChat(item);
                    setChatWithAdmin(false);
                  }}
                  className={`relative flex justify-between align-items-center px-3 py-2 border-round-md cursor-pointer transition-all ${
                    selectedChat === item
                      ? "bg-primary text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex align-items-center gap-2 overflow-hidden">
                    <Avatar icon="pi pi-user" size="small" />
                    <span className="text-sm text-truncate" style={{ maxWidth: "180px" }}>
                      {item}
                    </span>
                  </div>

                  {/* X Button */}
                  <button
  onClick={(e) => {
    e.stopPropagation();
    removeChat(item);
  }}
  className="relative top-2 right-2 text-gray-500 hover:text-red-700 text-xl font-bold transition-all"
  style={{
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "-300px",  // Am adăugat mai mult spațiu pentru a nu se suprapune cu textul
  }}
  title="Șterge chat"
>
  ×
</button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="col-12 md:col-9">
          <Card
            title={
              chatWithAdmin
                ? "Chat cu Admin"
                : `Chat cu: ${selectedChat || email}`
            }
          >
            <ScrollPanel style={{ height: "300px" }} className="mb-3">
              {chatWithAdmin
                ? renderMessages(messagesAdmin)
                : renderMessages(messagesPerson[selectedChat] || [])}
            </ScrollPanel>

            <div className="flex gap-2">
              <InputText
                className="flex-1"
                value={chatWithAdmin ? inputAdmin : inputPerson}
                onChange={(e) =>
                  chatWithAdmin
                    ? setInputAdmin(e.target.value)
                    : setInputPerson(e.target.value)
                }
                placeholder="Scrie un mesaj..."
              />
              <Button
                icon="pi pi-send"
                onClick={
                  chatWithAdmin
                    ? handleSendMessageAdmin
                    : handleSendMessagePerson
                }
              />
            </div>
          </Card>

          {/* Chat cu persoană nouă */}
          <div className="mt-4">
            <small className="block mb-1 font-medium">Începe un chat cu o persoană</small>
            <InputText
              value={email}
              onChange={handleEmailChange}
              placeholder="Email-ul persoanei"
              className="w-full mb-2"
            />
            {!isEmailValid && email && (
              <small className="text-red-500">Email invalid!</small>
            )}
            <Button
              label="Deschide chat"
              icon="pi pi-user-plus"
              onClick={openChat}
              disabled={!isEmailValid}
              className="w-full mt-2"
            />
          </div>

          {/* Înapoi la admin */}
          {!chatWithAdmin && (
            <div className="mt-3">
              <Button
                label="Înapoi la chat cu admin"
                icon="pi pi-arrow-left"
                className="w-full p-button-secondary"
                onClick={() => setChatWithAdmin(true)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
