import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NoMatches from "../../../components/Dashboard/NoMatches/NoMatches";
import PageTitle from "../../../components/Dashboard/PageTitle/PageTitle";
import QACard from "../../../components/Dashboard/QACard/QACard";
import Loader from "../../../hoc/Loader/Loader";
import classes from "./FAQpage.module.css";

const FAQpage = (props) => {
  const [data, setData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [noData, setNoData] = useState(false);
  const { loggedin } = useSelector((state) => state);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: loggedin.token,
      },
    };

    axios
      .get("/dashboard/faq", config)
      .then((res) => {
        if (res.data.success) {
          setDataFetched(true);
          if (res.data.data.length === 0) {
            setNoData(true);
          } else {
            setData(res.data.data);
          }
        } else {
          console.log(res.data.msg);
          setTimeout(() => {
            setNoData(true);
          }, 3000);
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.FAQpage}>
      <PageTitle>Questions and Answers</PageTitle>
      {noData ? (
        <NoMatches>It seems there are no question in FAQ section right now.</NoMatches>
      ) : dataFetched ? (
        data.map((item, index) => (
          <QACard key={index} id={item.qid} question={item.question}>
            {item.answer}
          </QACard>
        ))
      ) : (
        <Loader transparent />
      )}
    </div>
  );
};

export default FAQpage;
