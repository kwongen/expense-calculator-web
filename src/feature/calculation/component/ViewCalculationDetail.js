import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import DisplayCalulcationResult from "./DisplayCalculationResult"
import DisplayExpenseBreakdown from "./DisplayExpenseBreakdown"

const ViewCalculationDetail = ({eventData, calculationData, setCalculationData}) => {
    return (
        <Container className="border rounded h5">    
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1">Calculation Currency:</Col>
                <Col xs={12} lg={9} className="text-success fs-6">{calculationData?.calculationCCY?.value}  </Col>
            </Row>
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1">Calculation Exchange Rate :</Col>
                <Col xs={12} lg={9} className="text-success fs-6">
                    {calculationData.calculationExRate && Object.entries(calculationData.calculationExRate)
                        .map((item, index) => <div key={`exRate_${index}`} dangerouslySetInnerHTML={{ __html: item[0] + " : " + item[1] + "</br>" }} />)}
                    {(!calculationData.calculationExRate || Object.entries(calculationData.calculationExRate).length <= 0 ) ? <div>N/A</div> : ""}
                </Col>
            </Row>
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1">Total amount:</Col>
                <Col xs={12} lg={9} className="text-success fs-6">{calculationData?.calculationCCY?.symbol}{calculationData?.calculationResult?.totalAmt?.$numberDecimal}</Col>
            </Row>
            <Row className="my-2">
                <Col xs={12} lg={3} className="mb-1">Expense Involved & breakdown:</Col>
                <Col xs={12} lg={9} className="text-success fs-6">
                    {calculationData && <DisplayExpenseBreakdown calculationData={calculationData} /> }
                </Col>
            </Row>                               
            <Row className="my-2">
                <Col xs={12} lg={3} className="mb-1">Calculation Result w/o Simplify:</Col>
                <Col xs={12} lg={9} className="text-success">
                    {calculationData?.calculationResult && 
                        <DisplayCalulcationResult calculationData={calculationData} 
                                            setCalculationData={setCalculationData} 
                                            eventData={eventData}  
                                            resutlType="direct"/>}
                 </Col>
            </Row>
            <Row className="my-2">
                <Col xs={12} lg={3} className="mb-1">Simplified Calculation Result:</Col>
                <Col xs={12} lg={9} className="text-success">
                    {calculationData?.calculationResult && 
                        <DisplayCalulcationResult calculationData={calculationData} 
                                                setCalculationData={setCalculationData} 
                                                eventData={eventData} 
                                                resutlType="simplified"/>}
                </Col>
            </Row>            
        </Container>   
    )
}

export default ViewCalculationDetail;