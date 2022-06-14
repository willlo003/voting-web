import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { Row, Col, Card, Button, Modal, Form, Input, Select } from "antd";
import "antd/dist/antd.min.css";
import * as hkid from "hkid";

const Campaign = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [result, setResult] = useState({});
  const [winner, setWinner] = useState();

  const [form] = Form.useForm();
  const { Option } = Select;

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

  const vote = () => {
    form
      .validateFields()
      .then((values) => {
        if (hkid.validate(values.hkid)) {
          fetchData(`${process.env.REACT_APP_API_END_POINT}/vote`, "post", {
            campaign_id: props.id,
            hkid: values.hkid,
            voted_candidate_id: values.candidate,
          })
            .then((data) => {
              alert("Voted Successfully");
              setModalVisible(false);
            })
            .catch((err) => {
              alert(
                `${err.response.data.message.tc}\n${err.response.data.message.en}`
              );
            });
        } else {
          alert("invalid hkid");
        }
      })
      .catch(() => {
        console.log("Voting failed");
      });
  };

  const getResult = () => {
    fetchData(
      `${process.env.REACT_APP_API_END_POINT}/get-result/${props.id}`,
      "get"
    ).then((data) => {
      let tempResult = {};
      data.result.map((o) => (tempResult[o.id] = o.count));
      setResult(tempResult);
      setWinner(data.result[0].id);
    });
  };

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

  const onCandidateChange = (value) => {
    form.setFieldsValue({ candidate: value });
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
        <div className="campaign-popup">
          <Row className="campaign-details">
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 24 }}
              lg={{ span: 12 }}
              className="details"
            >
              <h2>{props.name}</h2>
              <p>
                Start Date:
                {moment(props.startDate).format("YYYY-MM-DD-HH:mm:ss")}
              </p>
              <p>
                End Date: {moment(props.endDate).format("YYYY-MM-DD-HH:mm:ss")}
              </p>
              {isActive ? (
                <Button ghost onClick={() => setModalVisible(true)}>
                  I wanna vote!
                </Button>
              ) : (
                <Button ghost onClick={getResult}>
                  get the result
                </Button>
              )}
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 24 }}
              lg={{ span: 12 }}
              className="candidates"
            >
              <h2>Candidates</h2>
              <Row gutter={[20, 20]}>
                {candidates.map((o, idx) => (
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 12 }}
                    md={{ span: 8 }}
                    lg={{ span: 8 }}
                  >
                    <Card
                      className={
                        o.id === winner ? "candidate-winner" : "candidate"
                      }
                      cover={<img alt="candidate" src={o.img_url} />}
                    >
                      <p>{o.name}</p>
                      <p>{result[o.id]}</p>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>

          <Modal
            title={props.name}
            style={{
              top: 20,
            }}
            okText="Vote"
            visible={modalVisible}
            onOk={vote}
            onCancel={() => setModalVisible(false)}
          >
            <Form form={form} layout="vertical" name="form_in_modal">
              <Form.Item
                name="hkid"
                label="HKID"
                help={"A123456(7) => a1234567"}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="candidate"
                label="Candidate"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select a candidate"
                  onChange={onCandidateChange}
                  allowClear
                >
                  {candidates.map((o) => {
                    console.log(o);
                    return <Option value={o.id}>{o.name}</Option>;
                  })}
                </Select>
              </Form.Item>
            </Form>
          </Modal>
          <div className="close">
            <img
              src={require("./assets/close.png")}
              alt="close"
              width="25"
              height="25"
              onClick={() => {
                setShowDetails(!showDetails);
              }}
            />
          </div>
        </div>
      )}
    </Col>
  );
};

export default Campaign;
