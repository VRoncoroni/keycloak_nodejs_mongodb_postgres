import React, { FC } from 'react';
import axios from 'axios';
import { IoIosClose } from "react-icons/io";
import "../global.css";
import "./style.css";
import { notify } from '../../utils';

interface ItemProps {
    index: number;
    token: string | null;
    setList: React.Dispatch<React.SetStateAction<string[]|null>>;
    list: string[];
    name: string;
  }
  
  const Item:FC<ItemProps> = (props) => {
  
    const removeItem = async () => {

      try {
        const result = await axios.delete(`http://localhost:3000/remove-item/${props.index}`, {
          headers: {
            authorization: `Bearer ${props.token}`,
          }
        });
        notify(result.status, result.data.message);
        props.setList((prev) => {
          const newList = [...prev!];
          newList.splice(props.index, 1);
          return newList;
        });
      } catch (error: unknown) {
        if(axios.isAxiosError(error) && error.response){
          notify(error.response.status, error.response.data.message);
        } else notify(500, "Internal Server Error");
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