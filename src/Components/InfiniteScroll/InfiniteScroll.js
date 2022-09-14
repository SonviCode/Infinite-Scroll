import React, { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./InfiniteScroll.css";

const InfiniteScroll = () => {

  const [dataImg, setDataImg] = useState([[], [], []]);
  const [pageIndex, setpageIndex] = useState(1);
  const [searchData, setSearchData] = useState("random");
  const [firstCall, setFisrtCall] = useState(true);

  // ------INITIAL CALL API----
  const infiniteFetchData = () => {
    fetch(
      `https://api.unsplash.com/search/photos?page=${pageIndex}&per_page=30&query=${searchData}&client_id=nwms8qGsTjL7WlguH6AK7_YfVebmB8-W9-d4uFfPQpk`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const imgReceived = [];

        data.results.forEach((img) => {
          imgReceived.push(img.urls.regular);
        });

        const newFreshState = [
          [...dataImg[0]],
          [...dataImg[1]],
          [...dataImg[2]],
        ];

        let index = 0;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 10; j++) {
            newFreshState[i].push(imgReceived[index]);
            index++;
          }
        }

        setDataImg(newFreshState);
        setFisrtCall(false)
      });
  };

  useEffect(() => {
    infiniteFetchData();
  }, [pageIndex]);

  // ---------RECHERCHE DYNAMIQUE---
  const searchFetchData = () => {
    fetch(
      `https://api.unsplash.com/search/photos?page=${pageIndex}&per_page=30&query=${searchData}&client_id=nwms8qGsTjL7WlguH6AK7_YfVebmB8-W9-d4uFfPQpk`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const imgReceived = [];

        data.results.forEach((img) => {
          imgReceived.push(img.urls.regular);
        });

        const newFreshState = [
          [],
          [],
          [],
        ];

        let index = 0;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 10; j++) {
            newFreshState[i].push(imgReceived[index]);
            index++;
          }
        }

        setDataImg(newFreshState);
      });
  };

  useEffect(()=> {
    if(firstCall) return;
    searchFetchData();
  }, [searchData])

  const handleSearch = (e) => {
    e.preventDefault();

    setSearchData(inpRef.current.value);
    setpageIndex(1);
  };

  const inpRef = useRef();

  // ----------SCROLL INFINI-----------
  useEffect(() => {
    window.addEventListener('scroll', infiniteCheck);

    return () => {
      window.removeEventListener('scroll', infiniteCheck)
    }
  }, [])

  const infiniteCheck = () => {

    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

    if(scrollHeight - scrollTop === clientHeight){
      setpageIndex(pageIndex => pageIndex + 1);
    }
  }

  //------------DOM----------
  return (
    <div className="container">
      <form onSubmit={handleSearch}>
        <label htmlFor="search">Votre recherche</label>
        <input type="text" id="search" ref={inpRef} />
      </form>
      <div className="card-list">
        <div>
          {dataImg[0].map((img) => {
            return <img key={uuidv4()} src={img} alt='image unsplash' />
          })}
        </div>
        <div>
          {dataImg[1].map((img) => {
            return <img key={uuidv4()} src={img} alt="image unsplash" />
          })}
        </div>
        <div>
          {dataImg[2].map((img) => {
            return <img key={uuidv4()} src={img} alt="image unsplash" />
          })}
        </div>
      </div>
    </div>
  );
};

export default InfiniteScroll;
