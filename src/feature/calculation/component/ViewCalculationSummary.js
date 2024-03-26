import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";

import TooltipOverlay from "../../../component/TooltipOverlay";
import DisplayCalulcationResult from "./DisplayCalculationResult"

const ViewCalculationSummary = ({eventData, calculationData, setCalculationData}) => {
    const getFriendList = (expensesInvolved) => {
        let friendList = [];
        
        expensesInvolved && expensesInvolved.forEach((expense) => {
            friendList = expense.costSplit.reduce((accu, item) => accu.concat(item.friendId.friendName), friendList)
        })

        friendList = [...new Set(friendList)];
        friendList.sort();

        return friendList
    }

    return (
        <Container className="border rounded h5">
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1">Calculation Date:</Col>
                <Col xs={12} lg={9} className="text-success">{calculationData?.createdAt?.slice(0,10)} at {calculationData?.createdAt?.split("T")[1]?.split(".")[0]}</Col>
            </Row>            
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1">Expense Item Option:</Col>
                <Col xs={12} lg={9} className="text-success">{calculationData?.calculationOptions?.expenseSelectionOption}</Col>
            </Row>
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1">Split Cost Option:</Col>
                <Col xs={12} lg={9} className="text-success">{calculationData?.calculationOptions?.splitCostOption} </Col>
            </Row>
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1">Exchange Rate Option: </Col>
                <Col xs={12} lg={9} className="text-success">{calculationData?.calculationOptions?.exRateOption} </Col>
            </Row>
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1">Calculation Currency:</Col>
                <Col xs={12} lg={9} className="text-success">{calculationData?.calculationCCY?.value}  </Col>
            </Row>
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1">Calculation Exchange Rate :</Col>
                <Col xs={12} lg={9} className="text-success">
                    {calculationData.calculationExRate && Object.entries(calculationData.calculationExRate)
                        .map((item) => <div dangerouslySetInnerHTML={{ __html: item[0] + " : " + item[1] + "</br>" }} />)}
                    {(!calculationData.calculationExRate || Object.entries(calculationData.calculationExRate).length <= 0 ) ? <div>N/A</div> : ""}
                </Col>
            </Row>
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1">Total amount:</Col>
                <Col xs={12} lg={9} className="text-success">{calculationData?.calculationCCY?.symbol}{calculationData?.calculationResult?.totalAmt?.$numberDecimal}</Col>
            </Row>  
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1"># of people:</Col>
                <Col xs={12} lg={9} className="text-success">
                    <TooltipOverlay key={`tip`} id={`tip`} title={getFriendList(calculationData?.expensesInvolved).join(", ")}>
                        <Badge  key={`badge`} bg="warning" className="fs-6" pill>{calculationData?.calculationResult?.numFriendsInvolved}</Badge>
                    </TooltipOverlay> 
                </Col>
            </Row>                            
            <Row className="my-2">
                <Col xs={12} lg={3} className="mb-1">Calculation Result:</Col>
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

export default ViewCalculationSummary;