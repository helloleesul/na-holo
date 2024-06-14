import {
  useNavigate,
  //  generatePath
} from 'react-router-dom';
// import axios from "axios";
import {
  // useState,
  useEffect,
} from 'react';
// import {jwtDecode} from "jwt-decode";

import { Appbar } from '@/components/Appbar';
import { Footer } from '@/components/Footer';
import { Layout } from '@/layout';

const Chattings = () => {
  const navigate = useNavigate();
  // const [member, setMember] = useState([]);
  // const [chatroomList, setChatroomList] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('accessToken') === null) {
      if (window.confirm('로그인이 필요합니다. \n로그인 하시겠습니까?')) {
        navigate('/login');
      } else {
        navigate('/');
        console.info('현재 로그인 상태');
      }
    } else {
      // const token = localStorage.getItem('accessToken');
      /*accessToken 가져와서 현재 로그인한 사용자의 memberId를 통해 서버에서 데이터 가져오기*/
    }
  });

  return (
    <>
      <Appbar />
      <Layout>
        <div>
          <div className="user_chatting_room_manage_page" style={{ width: '100%', height: '700px' }}>
            <div className="page_head" style={{ width: '100%', height: '80px' }}>
              <p style={{ color: '#424242', fontSize: '26px', fontWeight: 'bold', textAlign: 'center' }}>
                나의 채팅방 목록
              </p>
            </div>
            <div
              className="page_body"
              style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '370px' }}
            >
              <p>여기에 채팅방 리스트</p>
            </div>
          </div>
        </div>
      </Layout>
      <Footer />
    </>
  );
};

export default Chattings;
