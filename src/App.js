import React, { useEffect, useState } from "react";
import axios from "axios";
import Campaign from "./Campaign";

function App() {
  const [campaigns, setCampaigns] = useState([]);
  useEffect(() => {
    fetchData(`${process.env.REACT_APP_API_END_POINT}/get-campaigns`).then(
      (data) => setCampaigns(data.campaigns)
    );
  }, []);

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
    <div className="App">
      <h1>Footballers of 2022</h1>
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
    </div>
  );
}

export default App;
