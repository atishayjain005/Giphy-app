import React, { useState } from "react";
import "./body.scss";
export default function Body({ search, setSearch }) {
  const [localText, setlocalText] = useState("");
  const updateLocal = (event) => {
    setlocalText(event.target.value);
  };
  const handleSubmit = () => {
    setSearch(localText);
  };
  return (
    <div id="containerB">
      <div id="wrapperB">
          <input
            value={localText}
            onChange={updateLocal}
            id="search"
            type="search"
            placeholder="Type here"
          ></input>
          <button onClick={handleSubmit}>Go</button>
      </div>
    </div>
  );
}
