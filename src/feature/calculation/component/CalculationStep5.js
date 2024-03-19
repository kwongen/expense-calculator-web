import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";

const CalculationStep5 = ({formData, prev, submitForm, expenseData}) => {
    console.log(formData)
    const expenseItemOptionDesc = ["Last expense item ONLY","ALL expense items","Manually select expense items"];
    const splitOptionDesc = ["Split the cost evenly", "Manually input split cost"];
    const exRateOptionDesc = ["Use system exchange rate","Manually input exchange rate"];

    return (
        <Card className="w-100">
            <Card.Body>
                <Card.Title><div className="h4"><b>Step 5 - Confirmation</b></div></Card.Title>
                <Card.Body className="mt-2">
                    <Container className="border rounded h5">
                        <Row className="my-2 border-bottom">
                            <Col xs={12} lg={3} className="mb-1">Expense Item Option:</Col>
                            <Col xs={12} lg={9} className="text-success">{expenseItemOptionDesc[formData.expenseItemOption]}</Col>
                        </Row>
                        <Row className="my-2 border-bottom">
                            <Col xs={12} lg={3} className="mb-1">Split Cost Option:</Col>
                            <Col xs={12} lg={9} className="text-success">{splitOptionDesc[formData.splitOption]} </Col>
                        </Row>
                        <Row className="my-2 border-bottom">
                            <Col xs={12} lg={3} className="mb-1">Exchange Rate Option: </Col>
                            <Col xs={12} lg={9} className="text-success">{exRateOptionDesc[formData.exRateOption]} </Col>
                        </Row>
                        <Row className="my-2 border-bottom">
                            <Col xs={12} lg={3} className="mb-1">Base Currency:</Col>
                            <Col xs={12} lg={9} className="text-success">{formData.selectedCCY}  </Col>
                        </Row>
                        <Row className="my-2 border-bottom">
                            <Col xs={12} lg={3} className="mb-1">Calculation Exchange Rate :</Col>
                            <Col xs={12} lg={9} className="text-success">
                                {Object.entries(formData.finalExRate)
                                    .map((item) => <div dangerouslySetInnerHTML={{ __html: item[0] + " : " + item[1] + "</br>" }} />)}
                            </Col>
                        </Row>
                        <Row className="my-2">
                            <Col xs={12} lg={3} className="mb-1">Selected Expense Items & Cost Split:</Col>
                            <Col xs={12} lg={9} className="text-success">
                                <Accordion defaultActiveKey={[0, 1, 2]} alwaysOpen className="show">
                                    {expenseData && expenseData.map((exp, index) => {
                                        if (formData.selectedExpenses.indexOf(exp._id) >= 0) {
                                            return (
                                                <Accordion.Item key={`exp_${index}`} eventKey={index}>
                                                    <Accordion.Header key={`exp_header_${index}`}>{`${exp.expenseDate.slice(0, 10)} / ${exp.expenseType.value} / ${exp.expenseCCY.symbol}${exp.expenseAmt.$numberDecimal} /  paid by ${exp.paidBy.friendName} / ${exp.whoInvolved.length} people involved`}</Accordion.Header>
                                                    <Accordion.Body key={`exp_body_${index}`} className="fs-6">
                                                        <div className="flex-container card-deck">
                                                            {exp.whoInvolved && exp.whoInvolved.map((f) => {
                                                                return (
                                                                    <Card className="m-1">
                                                                        <Card.Body className="m-1 p-2" style={{ width: "12rem" }}>
                                                                            <Card.Text>{f.friendName} : {exp.expenseCCY.symbol}{formData.splitCostData[exp._id][f.friendId]}</Card.Text>
                                                                        </Card.Body>
                                                                    </Card>
                                                                )
                                                            })}
                                                        </div>
                                                        {/* <div dangerouslySetInnerHTML={{__html: showCostSplit(exp)}} /> */}
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            )
                                        } else {
                                            return (<></>)
                                        }
                                    })}
                                </Accordion>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
                <Row>
                    <Col xs={12} lg={6} className="mb-2"><Button variant="outline-secondary" className="w-100"
                        onClick={() => prev()}>&lt; Previous</Button></Col>
                    <Col xs={12} lg={6}><Button variant="success" className="w-100"
                        onClick={() => submitForm()}>Save & Calculate</Button></Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default CalculationStep5;