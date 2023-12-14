import React, { FC, useState } from "react";
import axios from "axios";
import {IoIosAdd} from "react-icons/io";
import "../global.css";
import "./style.css";


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

  export default InputItem;