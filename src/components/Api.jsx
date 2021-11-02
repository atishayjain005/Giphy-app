import React, { useEffect, useState } from "react";
import axios from "axios";

const Gifs = ({ search }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async (searchData, q = "") => {
      const getdata = await axios(
        `https://api.giphy.com/v1/gifs/${searchData}`,
        {
          params: {
            q: q,
            api_key: "O8MF6b7jYTn1BIc14nmuYHfLdfWosEEL",
          },
        }
      );
      return getdata;
    };
    if (search !== "") {
      fetchData(`search`, search).then((val) => {
        console.log("resp in if:", val, search);
        setData(val.data.data);
      });
    } else {
      fetchData("trending").then((val) => {
        console.log("resp in else:", val, search);
        setData(val.data.data);
      });
    }
  }, [search]);

  useEffect(() => {
    console.log("Data Set", data);
  }, [data]);
/* 
  const copyFunc = () => {
    let copy = document.getElementById("gifUrl");

    navigator.clipboard.writeText(copy.src).then(alert("copied"));
  }; */

  return data.map((e) => {
    return (
      <div key={e.id} className="gif">
        {
          <img
            src={e.images.fixed_height.url}
            alt="gifs"
            onClick={() => {
              navigator.clipboard.writeText(`${e.images.fixed_height.url}`).then(alert("Here is the Url of the Gif you've copied " +" : " + `${e.images.fixed_height.url}`));
            }}
          />
        }
      </div>
    );
  });
};

export default Gifs;
