import React from "react";
import "./gifContainer.scss";
import Gifs from "../Api";

export default function GifContainer({ search }) {
 
  return (
    <div className="container">
      <div className="gifHolder">
        <Gifs search={search} />
      </div>
    </div>
  );
}
