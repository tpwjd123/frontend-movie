import { useState } from 'react';
import { chatApi } from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: '안녕하세요! GOFLIX입니다. 무엇을 도와드릴까요?', sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { id: Date.now(), text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatApi.post('/chat', { message: inputMessage });
      const botMessage = { id: Date.now() + 1, text: response.data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { id: Date.now() + 1, text: '오류가 발생했습니다.', sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-yellow-500 text-black rounded-full shadow-lg z-50 flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faHeadset} />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl z-50 flex flex-col">
          <div className="bg-yellow-500 text-black p-4 rounded-t-lg">
            <h3 className="font-bold">GOFLIX 챗봇</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-3 py-2 rounded-lg ${message.sender === 'user' ? 'bg-yellow-500 text-black' : 'bg-gray-100'}`}>
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-center">로딩중...</div>}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                onClick={sendMessage}
                className="bg-yellow-500 text-black px-4 py-2 rounded"
              >
                전송
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}