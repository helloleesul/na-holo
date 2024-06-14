import { useState, useEffect, useRef, FormEvent } from 'react';
import axios from 'axios';
import {
  useParams,
  useNavigate,
  // generatePath
} from 'react-router-dom';
// import SockJS from 'sockjs-client';
import {
  Client,
  //  IMessage
} from '@stomp/stompjs';
import { Appbar } from '@/components/Appbar';
import { Footer } from '@/components/Footer';
import { Layout } from '@/layout';

interface Message {
  id: number;
  content: string;
  sendDate: string;
  sendTime: string;
  memberId: number;
  chatRoomId: string;
  sender: string | null;
  chatting: string | null;
}

const Chatting = () => {
  const { id } = useParams<{ id: string }>();
  const chatroomId = parseInt(id as string, 10);
  const navigate = useNavigate();

  const [chatroomName, setChatroomName] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [receiverName, setReceiverName] = useState<string>('');
  const [memberMessages, setMemberMessages] = useState<Message[]>([]);
  const [senderId, setSenderId] = useState<string>('');
  const [receiverId, setReceiverId] = useState<string>('');
  const [currentMemberId, setCurrentMemberId] = useState<string>('');

  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');

  const [rightUser, setRightUser] = useState<string>('');
  const [leftUser, setLeftUser] = useState<string>('');

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadChatHistory = async () => {
      axios
        .get(`http://34.22.76.244/api/chatting/${chatroomId}`)
        .then((response) => {
          setChatroomName(response.data.chatroomName);
          setSenderName(response.data.senderName);
          setReceiverName(response.data.receiverName);
          setMemberMessages(response.data.messages || []);
          setSenderId(response.data.senderId || '');
          setReceiverId(response.data.receiverId || '');
          setCurrentMemberId(response.data.currentId || '');

          console.info('현재 회원의 memberId : ' + response.data.currentId);
        })
        .catch((error) => console.info('채팅방 정보 가져오기 실패! : ' + error));
    };

    loadChatHistory();

    const client = new Client({
      brokerURL: 'ws://34.22.76.244/ws/websocket',
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/public/${chatroomId}`, (message) => {
          const sendMessage = JSON.parse(message.body);
          console.info('보낸 메시지 : ' + sendMessage.content);
        });
      },
    });
    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [chatroomId]);

  useEffect(() => {
    if (currentMemberId !== '') {
      if (currentMemberId === senderId) {
        setRightUser(senderName);
        setLeftUser(receiverName);
      } else if (currentMemberId === receiverId) {
        setRightUser(receiverName);
        setLeftUser(senderName);
      }
    }
  }, [currentMemberId, senderId, receiverId, senderName, receiverName]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [memberMessages]);

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (stompClient && newMessage) {
      const chatMessage = {
        memberId: currentMemberId,
        content: newMessage,
        chatroomId: chatroomId,
        type: 'CHAT',
      };
      console.info('메시지 보낼때 memberId : ' + currentMemberId);
      stompClient.publish({
        destination: `/app/chat-sendMessage/${chatroomId}`,
        body: JSON.stringify(chatMessage),
      });

      const messageToAdd: Message = {
        id: Date.now(), // or some unique ID
        content: newMessage,
        sendDate: new Date().toISOString().split('T')[0], // example date formatting
        sendTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        memberId: parseInt(currentMemberId, 10),
        chatRoomId: chatroomId.toString(),
        sender: senderName, // or whatever information you want to include
        chatting: null,
      };

      console.info('메시지 시간 및 날짜 : ' + messageToAdd.sendDate);
      setMemberMessages((prevMessages) => [...prevMessages, messageToAdd]);
      setNewMessage('');
    }
  };

  const exitChatroom = () => {
    if (window.confirm('정말로 채팅방을 나가시겠습니까?')) {
      axios
        .delete(`http://34.22.76.244/api/chatting/${chatroomId}`)
        .then((response) => {
          console.info(response.data.message);
          navigate('/');
        })
        .catch((error) => console.info('채팅방 나가기 실패! : ' + error));
    }
  };

  return (
    <>
      <Appbar />
      <Layout>
        <div>
          <div
            className="chatPage"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '750px',
            }}
          >
            <div
              className="chatContainer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '50%',
                height: '630px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0.1, 0, 0.3, 0.5)',
                backgroundColor: '#F4FFFF',
              }}
            >
              <div className="chat-title-area">
                <div
                  style={{
                    color: '#424242',
                    fontSize: '22px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    width: '100%',
                    height: '50px',
                    padding: '5px',
                    borderRadius: '10px',
                    backgroundColor: '#F4FFFF',
                  }}
                >
                  {chatroomName}
                </div>
                <div
                  className="name-area"
                  style={{
                    display: 'flex',
                    width: '100%',
                    height: '30px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#988DB3',
                  }}
                >
                  <div style={{ flex: '2' }}>{leftUser}</div>
                  <div style={{ flex: '6' }}></div>
                  <div style={{ flex: '2' }}>{rightUser}</div>
                </div>
              </div>

              <div className="chat-message-page" style={{ width: '100%', height: '500px', backgroundColor: '#E0EBFF' }}>
                <div className="message-area" style={{ height: '500px', overflowY: 'auto' }}>
                  {(memberMessages || []).map((message) => (
                    <div key={message.id} style={{ display: 'flex', padding: '5px' }}>
                      <div
                        style={{
                          marginLeft: message.memberId.toString() === currentMemberId ? 'auto' : '0',
                          marginRight: message.memberId.toString() === currentMemberId ? '0' : 'auto',
                        }}
                      >
                        <div
                          style={{
                            padding: '10px',
                            fontSize: '14px',
                            color: '#000000',
                            backgroundColor: '#FFFFFF',
                            border: '2px solid #dcdcdc',
                            borderRadius: '10px',
                          }}
                        >
                          {message.content}
                        </div>
                        <div style={{ fontSize: '10px' }}>{message.sendTime}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </div>
              </div>

              <form
                className="message-form"
                style={{
                  borderTop: '1px solid #c0c0c0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '50px',
                }}
                onSubmit={sendMessage}
              >
                <div className="form-group" style={{ width: '100%' }}>
                  <div className="input-group" style={{ display: 'flex', width: '100%' }}>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      autoComplete="off"
                      className="form-control"
                      style={{ flex: '8', marginLeft: '10px' }}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="sendBtn"
                      style={{
                        margin: '10px',
                        flex: '2',
                        border: '1px solid #c0c0c0',
                        borderRadius: '10px',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="chatroom-exit-area" style={{ marginTop: '20px', display: 'flex' }}>
              <button
                type="button"
                style={{
                  cursor: 'pointer',
                  height: '30px',
                  width: '150px',
                  border: '1px solid #c0c0c0',
                  borderRadius: '10px',
                  textAlign: 'center',
                  alignItems: 'center',
                  backgroundColor: '#708090',
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                }}
                onClick={exitChatroom}
              >
                대화 종료
              </button>
            </div>
          </div>
        </div>
      </Layout>
      <Footer />
    </>
  );
};

export default Chatting;
