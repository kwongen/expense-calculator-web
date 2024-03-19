import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import Stack from "react-bootstrap/Stack"
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useNavigate } from "react-router-dom";

import { PersonCircle } from "react-bootstrap-icons";

import CalculatorSVG from "../image/calculator-icon4.svg"
import { logoutApi } from "../api/AuthApi"

import  { useAuthContext } from "../context/AuthContext"

function SiteNavBar () {
    const {userProfile, resetAccess} = useAuthContext();
    const navigate = useNavigate();

    const handleSignOff = () => {
        logoutApi();
        resetAccess();
    }

    return (
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
            onClick={() => navigate("/main/event/list")}
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
                <div onClick={() => navigate("/main/event/list")}>
                Expense Calculator
                </div>
            </Stack>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="me-2 "/>
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">               
                <Nav.Link onClick={() => navigate("/main/friend/list")}>Friends/Family</Nav.Link>
                <Nav.Link onClick={() => navigate("/main/event/add")}>New Event</Nav.Link>
                <Nav.Link onClick={handleSignOff}>Log out</Nav.Link>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    );
}

export default SiteNavBar;
