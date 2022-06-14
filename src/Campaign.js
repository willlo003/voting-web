import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { Col, Card } from "antd";
import "antd/dist/antd.min.css";
import CampaignPopup from "./Campaign-popup";

const Campaign = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    if (moment().isBetween(props.startDate, props.endDate)) {
      setIsActive(true);
    }
    fetchData(
      `${process.env.REACT_APP_API_END_POINT}/get-candidates/${props.id}`,
      "get"
    ).then((data) => {
      setCandidates(data.candidates);
    });
  }, []);

  const fetchData = async (url, method, data) => {
    let res = await axios({
      method: method,
      url: url,
      data: data,
    });
    if (res.status === 200) {
      return res.data.data;
    } else {
      alert("No Result");
    }
  };

  return (
    <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
      <Card
        className="campaign-container"
        hoverable
        style={{
          width: "100%",
          backgroundColor: isActive ? "white" : "gray",
        }}
        onClick={() => {
          setShowDetails(!showDetails);
        }}
        cover={
          <img
            alt="campaign-img"
            src="https://img.redbull.com/images/c_limit,w_1500,h_1000,f_auto,q_auto/redbullcom/2020/12/16/rc5vx9ggxauwuofe3y4s/fifa-21-fut-toty-header"
          />
        }
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
        <CampaignPopup
          details={props}
          candidates={candidates}
          setShowDetails={setShowDetails}
          isActive={isActive}
        />
      )}
    </Col>
  );
};

export default Campaign;
