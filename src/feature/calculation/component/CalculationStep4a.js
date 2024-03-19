import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import {InfoCircle} from "react-bootstrap-icons";

import TooltipOverlay from "../../../component/TooltipOverlay";

const CalculationStep4a = ({formData, setFormData, prev, next, currency}) => {
    const selectedCurrency = currency.find((c) => c._id===formData.selectedCCY);

    const onChange = (event, ccy) => {
        formData.finalExRate[ccy] = event.target.value;

        setFormData({...formData});

        if(isNaN(Number(event.target.value)) || event.target.value.trim() === "") {
            event.target.classList.add("is-invalid");
            document.getElementById("ccyText_" + ccy).classList.add("bg-danger")
            document.getElementById("ccyText_" + ccy).classList.remove("bg-secondary")
        } else {
            event.target.classList.remove("is-invalid");
            document.getElementById("ccyText_" + ccy).classList.remove("bg-danger")
            document.getElementById("ccyText_" + ccy).classList.add("bg-secondary")        }
    }

    return (
        <Card style={{ width: '100%' }}>
        <Card.Body>
            <Card.Title><div className="h4"><b>Step 4a - Manual input exchange rate for calculation</b></div></Card.Title>
            <Card.Body className="mt-4">
                <Card>
                    <Container className="p-4">
                        <Row>
                            <Col xs={12} lg={12} className="my-2 h4">
                                Exchange rate of {selectedCurrency.symbol}1 ({formData.selectedCCY}) 
                                to below related currency:
                            </Col> 
                        </Row>
                            {Object.entries(formData.finalExRate).map((exrate) => {
                                return (
                                    <Row key={`row_${exrate[0]}`}  className="mb-1" >
                                        <Col key={`col_1_${exrate[0]}`} xs={12} lg={5}>
                                            <InputGroup key={`inputgroup_${exrate[0]}`}>
                                                <InputGroup.Text
                                                    key={`ccyText_${exrate[0]}`}
                                                    id={`ccyText_${exrate[0]}`}
                                                    className="justify-content-center bg-secondary text-light"
                                                    style={{ width: "4rem" }}>
                                                    {exrate[0]}
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Exchange rate..."
                                                    key={`exRate_${exrate[0]}`}
                                                    id={`exRate_${exrate[0]}`}
                                                    name={`exRate_${exrate[0]}`}
                                                    value={exrate[1]}
                                                    onChange={(e) => onChange(e, exrate[0])}
                                                    className="is-valid"
                                                />
                                                <InputGroup.Text key={`exRateTips_text_${exrate[0]}`} 
                                                    className="bg-success text-light">
                                                    <TooltipOverlay 
                                                        key={`exRateTips_${exrate[0]}`}
                                                        id={`exRateTips_${exrate[0]}`} 
                                                        title={`System rate is ${selectedCurrency.exrate[exrate[0]]}`}>
                                                        <InfoCircle size="24" />
                                                    </TooltipOverlay>
                                                </InputGroup.Text>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                )
                            })}
                    </Container>
                </Card>
            </Card.Body>
            <Row>
                <Col><Button variant="outline-secondary" className="w-100"
                    onClick={() => prev()}>&lt; Previous</Button></Col>
                <Col><Button variant="outline-success" className="w-100"
                    onClick={() => next()}>Next &gt;</Button></Col>
            </Row>                        
        </Card.Body>
        </Card>
    )
}

export default CalculationStep4a;