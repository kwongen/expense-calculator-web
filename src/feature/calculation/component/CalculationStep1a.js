import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Form from 'react-bootstrap/Form';

const CalculationStep1a = ({formData, setFormData, prev, next, expenseData}) => {
    const changeFormData = () => {  
        const elem = document.getElementsByName("expenseItemSelection")

        let selectedExpenses = []
        elem.forEach((item) => {
            if(item.checked)
                selectedExpenses.push(item.value);
        });
    
        setFormData({...formData, selectedExpenses:selectedExpenses});
    }

    const onClick = (index) => {
        const elem = document.getElementsByName("expenseItemSelection")
    
        elem[index].checked = !elem[index].checked
        changeFormData();
    }
    
    const selectOrClearAll = (e) => {
        let check = true;
        if(e.target.innerText === "Select All") {
            check = true;
            e.target.innerText = "Clear All";
        }
        else if(e.target.innerText === "Clear All") {
            check = false;
            e.target.innerText = "Select All";
        }
    
        document.getElementsByName("expenseItemSelection").forEach((item) => item.checked=check);

        changeFormData();
    }

    return (
        <Card style={{ width: '100%' }}>
        <Card.Body>
            <Card.Title><div className="h4"><b>Step 1a - Manually select expense item(s) for calculation</b></div></Card.Title>
            <Card.Body as="div" className="mt-4">
                <Button variant="outline-dark" className="mb-2" onClick={selectOrClearAll}>{formData.selectedExpenses.length===0?"Select All":"Clear All"}</Button>
                <ListGroup>
                    {expenseData && expenseData.map((exp, index) => {
                        return (
                            <ListGroup.Item key={`exp_${index}`} onClick={() =>  onClick(index)}>
                                <Form.Check type="checkbox" 
                                        name="expenseItemSelection"
                                        value={exp._id}
                                        label={`${exp.expenseDate.slice(0,10)} / ${exp.expenseType.value} / ${exp.expenseCCY.symbol}${exp.expenseAmt.$numberDecimal} /  paid by ${exp.paidBy.friendName} / ${exp.whoInvolved.length} people involved / ${exp.isCalculated?"Calculated":"Not yet calculate"}` } 
                                        className="h4"
                                        onChange={() => onClick(index)} 
                                        checked={formData.selectedExpenses.indexOf(exp._id) >= 0 }/>
                            </ListGroup.Item>    
                        ) 
                    })}                        
                </ListGroup>
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

export default CalculationStep1a;