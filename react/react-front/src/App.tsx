import {FC, useEffect, useRef, useState } from 'react'
import './App.css'
import useAuth from './hooks/useAuth';
import axios from 'axios';
import { IoIosAdd, IoIosClose} from "react-icons/io";
import { InfinitySpin } from  'react-loader-spinner'

interface InputItemProps {
  token: string | null;
  setList: React.Dispatch<React.SetStateAction<string[]|null>>;
}


const InputItem:FC<InputItemProps> = (props) => {

  const [itemName, setItemName] = useState("");

  const addItem = async () => {
    const config = {
      headers: {
        authorization: `Bearer ${props.token}`,
      },
    };
    const result = await axios.post(
      "http://localhost:3000/add-item",
      {newitem: itemName},
      config
    );
    if (result.status === 200) {
      props.setList((prev) => [...prev!, itemName]);
    }
    setItemName("");
  }
  return (
    <div className="additem">
      <input
        type="text"
        placeholder="New item"
        onChange={(e) => setItemName(e.target.value)}
        className="input"
        value={itemName}
      />
      <IoIosAdd
        size="2em"
        onClick={() => addItem()}
        className="item-btn"
      />
    </div>
  )
}

interface ItemProps {
  index: number;
  token: string | null;
  setList: React.Dispatch<React.SetStateAction<string[]|null>>;
  list: string[];
  name: string;
}

const Item:FC<ItemProps> = (props) => {

  const removeItem = async () => {
    const result = await axios.delete(`http://localhost:3000/remove-item/${props.index}`, {
      headers: {
        authorization: `Bearer ${props.token}`,
      }
    });
    if (result.status === 200){
      props.setList((prev) => {
        const newList = [...prev!];
        newList.splice(props.index, 1);
        return newList;
      });
    }
  }

  return (
    <div className="item">
      <div className="item-name">
        <p>{props.name}</p>
      </div>
      <IoIosClose
        size="2em"
        onClick={() => removeItem()}
        className="item-btn"
      />
    </div>
  )
}

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
