import './App.css';
import ml5 from "ml5";
import React, { useEffect, useRef, useState } from 'react';
import Loader from 'react-loader-spinner';
import Hero from './Hero';
import Chart from './chart';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import useInterval from '@use-it/interval';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

let classifier;

function App() {
  const videoRef = useRef();
  const [result, setResult] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [start, setStart] = useState(false);

  useEffect(() => {
    classifier = ml5.imageClassifier("./model/model.json", () => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setLoaded(true);
        });
    });
  }, []);

  useInterval(() => {
    classifier.classify(videoRef.current, (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      setResult(results);
    })
  }, 1000);

  const toggle = () => {
    setStart(!start);
    setResult([]);
  }

  return (
    <Container fluid>
      <Loader
        type="Watch"
        color="#00BFFF"
        height={200}
        width={200}
        visible={!loaded}
        style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}
      />
      <Row>
        <Navbar className="justify-content-md-center">
          <Row>
            <Col xs lg="2"></Col>
            <Col md="auto"><br></br><h1>What superhero are you?</h1></Col>
            <Col xs lg="2">
            </Col>
          </Row>
        </Navbar>
        <Container fluid>
          <Row className="capture">
            <video
              ref={videoRef}
              style={{ transform: "scale(-1, 1)" }}
              width="300"
              height="200" />
            {loaded && (
              <button onClick={() => toggle()}>
                {start ? "Stop" : "Start"}
              </button>
            )}
          </Row>
          {result.length > 0 && (
            <Row className="bgCol">
              <Col xs={1}></Col>
              <Col md="auto">
                <br></br>
                <Chart data={result[0]} />
              </Col>
              <Col>
                {result.length > 0 && (
                  <div className="results">
                    <Hero data={result} />
                  </div>
                )}
              </Col>
              <Col xs={1}></Col>
            </Row>
          )}
        </Container>
      </Row >
    </Container >
  );
}

export default App;