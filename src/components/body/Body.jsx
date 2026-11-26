import React, { useState } from "react";
import "./body.scss";
export default function Body({ setSearch }) {
  const [localText, setLocalText] = useState("");
  function submit(event) {
    event.preventDefault();
    const query = localText.trim();
    setLocalText(query);
    setSearch(query);
  }
  return (
    <div id="containerB">
      <form id="wrapperB" onSubmit={submit} role="search">
        <label htmlFor="search">Search GIFs</label>
        <input value={localText} onChange={event => setLocalText(event.target.value)}
          id="search" type="search" placeholder="Try cats or celebration" maxLength={200} />
        <button type="submit">Search</button>
        <button type="button" onClick={() => { setLocalText(""); setSearch(""); }}>Trending</button>
      </form>
    </div>
  );
}
