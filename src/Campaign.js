import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { Row, Col } from "antd";
import "antd/dist/antd.min.css";

const Campaign = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    if (moment().isBetween(props.startDate, props.endDate)) {
      setIsActive(true);
      fetchData(
        `${process.env.REACT_APP_API_END_POINT}/get-candidates/${props.id}`
      ).then((data) => {
        setCandidates(data.candidates);
      });
    }
  }, []);

  const campaignDetails = () => {
    setShowDetails(!showDetails);
  };

  const vote = () => {};

  const getResult = () => {
    fetchData(
      `${process.env.REACT_APP_API_END_POINT}/get-result/${props.id}`
    ).then((data) => console.log(data));
  };

  const fetchData = async (url) => {
    let res = await axios({
      method: "get",
      url: url,
    });
    if (res.status === 200) {
      return res.data.data;
    } else {
      alert("No Result");
    }
  };

  return (
    <div>
      <div
        className="campaign-container"
        style={{
          backgroundColor: isActive ? "white" : "gray",
        }}
        onClick={() => campaignDetails()}
      >
        <h2>{props.name}</h2>
        <h3>Total Voted: {props.votedQty}</h3>
        <h4>
          Start Date: {moment(props.startDate).format("YYYY-MM-DD-HH:mm:ss")}
        </h4>
        <h4>End Date: {moment(props.endDate).format("YYYY-MM-DD-HH:mm:ss")}</h4>
        <h4>{isActive ? "Vote" : "Result"}</h4>
      </div>
      {showDetails && (
        <div className="campaign-popup">
          <Row wrap={false} className="campaign-details">
            <Col flex="12" className="details">
              <h2>{props.name}</h2>
              <h4>
                Start Date:
                {moment(props.startDate).format("YYYY-MM-DD-HH:mm:ss")}
              </h4>
              <h4>
                End Date: {moment(props.endDate).format("YYYY-MM-DD-HH:mm:ss")}
              </h4>
              <h3>Candidates</h3>
              {candidates.map((o, idx) => (
                <h5 key={`candidate-${idx}`}>{o.name}</h5>
              ))}
            </Col>
            <Col flex="12" className="action">
              {isActive ? (
                <button onClick={vote}> I wanna vote!</button>
              ) : (
                <div>
                  <button onClick={getResult}> get the result</button>
                </div>
              )}
            </Col>
          </Row>
          <div className="close">
            <img
              src={require("./assets/close.png")}
              alt="close"
              width="25"
              height="25"
              onClick={() => campaignDetails()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaign;
