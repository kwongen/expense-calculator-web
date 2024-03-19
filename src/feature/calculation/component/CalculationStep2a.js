import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const CalculationStep2a = ({formData, setFormData, prev, next, expenseData, splitCostLogic}) => {
    const onChange = (event, expenseId, friendId) => {
        const _formData = {...formData};
        _formData.splitCostData[expenseId][friendId] = (isNaN(Number(event.target.value)) || event.target.value.trim()==="")  ? event.target.value : Math.round(Number(event.target.value)*100) / 100;

        setFormData(_formData);
        if((isNaN(Number(event.target.value)) || event.target.value.trim()==="")) {
            event.target.classList.add("is-invalid");
            document.getElementById("splitSymbol_"+expenseId+"_"+friendId)?.classList?.remove("bg-success");
            document.getElementById("splitSymbol_"+expenseId+"_"+friendId)?.classList?.add("bg-danger");
        } else {
            event.target.classList.remove("is-invalid");
            document.getElementById("splitSymbol_"+expenseId+"_"+friendId)?.classList?.remove("bg-danger");
            document.getElementById("splitSymbol_"+expenseId+"_"+friendId)?.classList?.add("bg-success");
        }
    }

    const getTotal = (expenseId) => {
        let totalAmt = 0.0;

        totalAmt = Object.values(formData.splitCostData[expenseId]).reduce((acc, val) => acc + val, 0);
        totalAmt = Math.round(totalAmt * 100)/100;

        const expense = expenseData.find((exp) => exp._id === expenseId)
    
        if(expense) {       
            if(totalAmt !== Number(expense.expenseAmt.$numberDecimal)) {
                document.getElementById("totalText_"+expenseId)?.classList?.remove("text-success");
                document.getElementById("totalText_"+expenseId)?.classList?.add("text-danger");
                document.getElementById("totalSymbol_"+expenseId)?.classList?.remove("bg-success");
                document.getElementById("totalSymbol_"+expenseId)?.classList?.add("bg-danger");
                document.getElementById("totalAmt_"+expenseId)?.classList?.add("is-invalid");
            } else {
                document.getElementById("totalText_"+expenseId)?.classList?.remove("text-danger");
                document.getElementById("totalText_"+expenseId)?.classList?.add("text-success");
                document.getElementById("totalSymbol_"+expenseId)?.classList?.remove("bg-danger");
                document.getElementById("totalSymbol_"+expenseId)?.classList?.add("bg-success");
                document.getElementById("totalAmt_"+expenseId)?.classList?.remove("is-invalid");
            }
        }

        return totalAmt;
    }

    const splitCost = (expense) => {
        const _formData = {...formData};
        _formData.splitCostData[expense._id] = splitCostLogic(expense);

        setFormData(_formData);

        // reset element style
        expense.whoInvolved.forEach((f) => {
            document.getElementById("splitAmt_" + expense._id + "_" + f.friendId)?.classList?.remove("is-invalid");
            document.getElementById("splitSymbol_"+expense._id+"_"+f.friendId)?.classList?.remove("bg-danger");
            document.getElementById("splitSymbol_"+expense._id+"_"+f.friendId)?.classList?.add("bg-success");
        })
    }

    return (
        <Card style={{ width: '100%' }}>
        <Card.Body>
            <Card.Title><div className="h4"><b>Step 2a - Manually input cost split of each expense</b></div></Card.Title>
            <Card.Body className="mt-4">
                <Accordion alwaysOpen>
                    {expenseData && expenseData.map((exp, index) => {
                        if(formData.selectedExpenses.indexOf(exp._id) >= 0) {
                            return (
                                <Accordion.Item key={`exp_${index}`} eventKey={index}>
                                    <Accordion.Header key={`exp_header_${index}`}>{`${exp.expenseDate.slice(0,10)} / ${exp.expenseType.value} / ${exp.expenseCCY.symbol}${exp.expenseAmt.$numberDecimal} /  paid by ${exp.paidBy.friendName} / ${exp.whoInvolved.length} people involved`}</Accordion.Header>
                                    <Accordion.Body  key={`exp_body_${index}`}>
                                        {exp.whoInvolved && exp.whoInvolved.map( (f) => {
                                            return (
                                                <Row key={`row_${exp._id}_${f.friendId}`} className="mb-1" >
                                                    <Col key={`col_1_${exp._id}_${f.friendId}`} xs={12} lg={1} 
                                                            className="align-self-center">{f.friendName}</Col>
                                                    <Col key={`col_2_${exp._id}_${f.friendId}`} xs={12} lg={5}>
                                                        <InputGroup key={`inputgroup_${exp._id}_${f.friendId}`}>
                                                            <InputGroup.Text 
                                                                key={`splitSymbol_${exp._id}_${f.friendId}`}
                                                                id={`splitSymbol_${exp._id}_${f.friendId}`}
                                                                className="justify-content-end bg-secondary text-light"
                                                                style={{ width: "4rem"}}>
                                                                {exp.expenseCCY.symbol}
                                                            </InputGroup.Text>
                                                            <Form.Control
                                                                type="number"
                                                                placeholder="Split amount..."
                                                                key={`splitAmt_${exp._id}_${f.friendId}`}
                                                                id={`splitAmt_${exp._id}_${f.friendId}`}
                                                                name={`splitAmt_${exp._id}_${f.friendId}`}
                                                                value={formData.splitCostData[exp._id][f.friendId]}
                                                                onChange={(e) => onChange(e, exp._id, f.friendId)}
                                                                className="is-valid"
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                </Row>
                                            ) 
                                        })}
                                        <Row className="mb-1" >
                                            <Col xs={12} lg={1} 
                                                id={`totalText_${exp._id}`}
                                                className="align-self-center justify-content-end text-success"><b>TOTAL:</b></Col>
                                            <Col xs={12} lg={5}>
                                                <InputGroup>
                                                    <InputGroup.Text
                                                        key={`totalSymbol_${exp._id}`}
                                                        id={`totalSymbol_${exp._id}`}
                                                        className="justify-content-end bg-success text-light"
                                                        style={{ width: "4rem" }}>
                                                        {exp.expenseCCY.symbol}
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        className="text-success is-valid"
                                                        placeholder="Total amount..."
                                                        key={`totalAmt_${exp._id}`}
                                                        id={`totalAmt_${exp._id}`}
                                                        name={`totalAmt_${exp._id}`}
                                                        value={getTotal(exp._id)}
                                                        isValid={true}
                                                        disabled
                                                    />
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} lg={1}>{" "}</Col>
                                            <Col xs={12} lg={5}>
                                                <Button variant="warning" className="w-100" onClick={() => splitCost(exp)}>Split Cost Evenly</Button>
                                            </Col>
                                        </Row>                       
                                    </Accordion.Body>
                                </Accordion.Item>
                            )
                        } else {
                            return (<></>)
                        }
                    })}
                </Accordion>
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

export default CalculationStep2a;