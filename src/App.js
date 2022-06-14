import React, { useEffect, useState } from "react";
import axios from "axios";
import Campaign from "./Campaign";
import { Row } from "antd";

function App() {
  const [campaigns, setCampaigns] = useState([]);
  useEffect(() => {
    fetchData(
      `${process.env.REACT_APP_API_END_POINT}/get-campaigns`,
      "get"
    ).then((data) => setCampaigns(data.campaigns));
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
    <div className="App">
      <h1>Best Football Players of 2022</h1>
      <Row gutter={[40, 40]} type="flex">
        {campaigns.map((o, idx) => {
          return (
            <Campaign
              key={o.id}
              id={o.id}
              name={o.name}
              votedQty={o.voted_qty}
              startDate={o.start_date}
              endDate={o.end_date}
            />
          );
        })}
      </Row>
    </div>
  );
}

export default App;
