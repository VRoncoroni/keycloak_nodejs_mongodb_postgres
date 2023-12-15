import {useEffect, useRef, useState } from 'react'
import './App.css'
import useAuth from './hooks/useAuth';
import axios from 'axios';
import { InfinitySpin } from  'react-loader-spinner';
import { Item, InputItem } from './components';
import { notify } from './utils';

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
    try {
      const result = await axios.get("http://localhost:3000/get-items", config);
      notify(result.status, result.data.message);
      setList(result.data.itemList);
    } catch (error: unknown) {
      if(axios.isAxiosError(error) && error.response){
        notify(error.response.status, error.response.data.message);
      } else notify(500, "Internal Server Error");
    }
  }

  useEffect(() => {
    if (isRun.current) return;
    if (!token) return;
    
    isRun.current = true;
    updateList();
  }, [token]);

  const initUser = async () => {
    const config = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    try{
      const result = await axios.post("http://localhost:3000/init-user", {}, config);
      notify(result.status, result.data.message);
      await updateList();
    } catch (error: unknown) {
      if(axios.isAxiosError(error) && error.response){
        notify(error.response.status, error.response.data.message);
      } else notify(500, "Internal Server Error");
    }
  }

  return isLogin ? (
    <>
      <h1>React List App</h1>
      <h3>{name ?? ""}</h3>
      <div className="list">
        {list === null ?
        <button onClick={() => initUser()} >New User : Create List</button>
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
