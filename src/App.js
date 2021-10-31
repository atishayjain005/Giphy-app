import React, { useState } from "react";
import "./App.css";
import Heading from "./components/heading/Heading";
import Body from "./components/body/Body";
import GifContainer from "./components/gifContainer/GifContainer";

function App() {

  const [search, setSearch] = useState("");

  return (
    <div id="myApp" className="App">
      <div id="mainWrapper">
        <Heading />
        <Body search={search} setSearch={setSearch} />
      </div>
      <GifContainer search={search} />
    </div>
  );
}

export default App;
