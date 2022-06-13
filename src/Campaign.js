import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { Row, Col, Card } from "antd";
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
    <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} >
        <Card
        className="campaign-container"
    hoverable
    style={{
      width: '100%',
      backgroundColor: isActive ? "white" : "gray",
    }}
    onClick={() => campaignDetails()}
    cover={<img alt="example" src="https://img.redbull.com/images/c_limit,w_1500,h_1000,f_auto,q_auto/redbullcom/2020/12/16/rc5vx9ggxauwuofe3y4s/fifa-21-fut-toty-header" />}
  >
    <h2>{props.name}</h2>
    <h3>Total Voted: {props.votedQty}</h3>
    <h4>
      Start Date: {moment(props.startDate).format("YYYY-MM-DD-HH:mm:ss")}
    </h4>
    <h4>End Date: {moment(props.endDate).format("YYYY-MM-DD-HH:mm:ss")}</h4>
    <h4>{isActive ? "Vote" : "Result"}</h4>
  </Card>

      {showDetails && (
        <div className="campaign-popup">
          <Row className="campaign-details">
            <Col sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} className="details">
              <h2>{props.name}</h2>
              <p>
                Start Date:
                {moment(props.startDate).format("YYYY-MM-DD-HH:mm:ss")}
              </p>
              <p>
                End Date: {moment(props.endDate).format("YYYY-MM-DD-HH:mm:ss")}
              </p>
              <h3>Candidates</h3>
              {candidates.map((o, idx) => (
                <p key={`candidate-${idx}`}>{o.name}</p>
              ))}
            </Col>
            <Col sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} className="action">
            <h2>{props.name}</h2>
              <p>
                Start Date:
                {moment(props.startDate).format("YYYY-MM-DD-HH:mm:ss")}
              </p>
              <p>
                End Date: {moment(props.endDate).format("YYYY-MM-DD-HH:mm:ss")}
              </p>
              <h3>Candidates</h3>
              {candidates.map((o, idx) => (
                <p key={`candidate-${idx}`}>{o.name}</p>
              ))}
              {/* {isActive ? (
                <button onClick={vote}> I wanna vote!</button>
              ) : (
                <div>
                  <button onClick={getResult}> get the result</button>
                </div>
              )} */}
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
    </Col>
  );
};

export default Campaign;
