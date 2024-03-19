import { Nav, Navbar, NavDropdown, Container, Col, Row, Stack } from "react-bootstrap";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Routes, Route } from 'react-router-dom';

import { PersonCircle } from "react-bootstrap-icons";
//import Cookies from 'js-cookie';

import CalculatorSVG from "../image/calculator-icon4.svg"
import EventList from "../feature/EventList"
import {logoutApi} from "../api/AuthApi"

import  { useAuthContext } from "../context/AuthContext"

function Main () {
    const {userProfile, resetAccess} = useAuthContext();

    const handleNewEvent = () => {
        console.log("New Event")
    }

    const handleSignOff = () => {
        logoutApi();
        resetAccess();
    }

    return (
        <div className='bg-secondary position-relative'>
            <Navbar fixed="top" collapseOnSelect expand="sm" bg="dark" variant="dark"
                className="container-fluid"
                style={{maxWidth:"1440px"}}>
            <Navbar.Brand href="#home" className="ps-1">
                <img
                src={CalculatorSVG}
                width="50"
                height="40"
                className="d-inline-block align-top"
                alt="Expense Calculator icon"
                />
            </Navbar.Brand>
            <Navbar.Brand className="ms-0" href="#home">
                <Stack direction="horizontal" gap={3}>
                    <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip id="button-tooltip-2">Hello {`${userProfile.name}`}</Tooltip>}
                    >
                        <PersonCircle size={32}/>
                    </OverlayTrigger>
                    <div>
                    Expense Calculator
                    </div>
                </Stack>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" className="me-2 "/>
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ms-auto">               
                    <Nav.Link href="">Friends/Family</Nav.Link>
                    <Nav.Link href="" onClick={handleNewEvent}>New Event</Nav.Link>
                    <Nav.Link href="" onClick={handleSignOff}>Log out</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Navbar>
            <div className="bg-light container-fluid" 
                style={{paddingTop: "80px", maxWidth:"1440px"}}>
                <Container style={{maxWidth:"1440px"}}>
                    <Row>
                        <Col className="border border-light">                           
                            <Routes>
                                <Route path="/main/event/list" element={<EventList />} />                            
                            </Routes>                            
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}

export default Main;
