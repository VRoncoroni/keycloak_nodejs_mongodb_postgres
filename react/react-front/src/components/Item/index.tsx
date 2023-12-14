import React, { FC } from 'react';
import axios from 'axios';
import { IoIosClose } from "react-icons/io";
import "../global.css";
import "./style.css";

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

export default Item;