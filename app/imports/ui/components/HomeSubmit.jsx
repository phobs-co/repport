import React from 'react';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HomeSubmit = () => {
  const navigate = useNavigate();
  const ReportDebrisButton = () => {
    navigate('/report');
  };
  return (
    <Container id="homeSubmit" className="d-grid pt-5" lg={5}>
      <Row xs={1} sm={1} md={2}>
        <Col className="pb-5 text-end">
          <Image fluid src="images/AdobeStock_625815628_Preview.png" alt="AdobeStock_625815628_Preview.jpeg" width={500} />
        </Col>
        <Col className="pb-5 text-start">
          <h3>Report Debris, Support Hawai&apos;i</h3>
          <h5>Help Us Keep Our Oceans and Beaches Clean</h5>
          <p>
            Report trash and debris that you find by land or sea!
            Someone will come to pick it up for free! Every pound of trash thrown away is a ocean life is saved for another day. And remember don&apos;t touch the turtles!
          </p>
          <div className="d-grid gap-2">
            <Button id="report-debris-button" onClick={ReportDebrisButton} variant="danger">
              Report Debris
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeSubmit;
