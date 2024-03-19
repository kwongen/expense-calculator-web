import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import SiteNavBar from "./SiteNavBar"

function SiteLayout ({children}) {
    return (
        <div className='bg-secondary position-relative'>
            <SiteNavBar />

            <div className="bg-light container-fluid min-vh-100" 
                style={{paddingTop: "80px", maxWidth:"1440px"}}>
                <Container style={{maxWidth:"1440px"}} >
                    <Row>
                        <Col className="border border-light">                           
                            {children}                        
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}

export default SiteLayout;
