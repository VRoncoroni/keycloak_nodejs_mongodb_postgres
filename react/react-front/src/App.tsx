import {useEffect, useRef, useState } from 'react'
import './App.css'
import useAuth from './hooks/useAuth';
import axios from 'axios';
import { InfinitySpin } from  'react-loader-spinner';
import { Item, InputItem } from './components';

const App = () => {
  const {isLogin, token, logout, name} = useAuth();
  const isRun = useRef(false);
  const [list, setList] = useState<string[] | null>(null);


  const updateList = async () => {
    const config = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const result = await axios.get("http://localhost:3000/get-items", config);
    if(result.status == 200){
      setList(result.data.itemList);
    }
  }

  useEffect(() => {
    if (isRun.current) return;
    if (!token) return;
    
    isRun.current = true;
    updateList();
  }, [token]);

  const newUser = async () => {
    const config = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    await axios.post("http://localhost:3000/newUser", {}, config);
    await updateList();
  }

  return isLogin ? (
    <>
      <h1>React List App</h1>
      <h3>{name ?? ""}</h3>
      <div className="list">
        {list === null ?
        <button onClick={() => newUser()} >New User : Create List</button>
          :
        list.map((item, index) => (
          <Item
            key={index}
            index={index}
            name={item}
            setList={setList}
            token={token}
            list={list}
          />
        ))}
      </div>
      <InputItem token={token} setList={setList} />
      <button onClick={() => logout()}>Logout</button>
    </>
  ) : (
    <InfinitySpin 
      width='200'
      color="#4fa94d"
    />
  )
}

export default App
