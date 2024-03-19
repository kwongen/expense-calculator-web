import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";

const CalculationStep1 = ({formData, setFormData, prev, next}) => {
    return (
        <Card style={{ width: '100%' }}>
        <Card.Body>
            <Card.Title><div className="h4"><b>Step 1 - Select expense item(s) for calculation</b></div></Card.Title>
            <Card.Body className="my-2">
                <ListGroup>
                    <ListGroup.Item onClick={() => setFormData({...formData, expenseItemOption:0})}>
                        <Form.Check type="radio" 
                                name="expenseItemOption" 
                                label="Calculate last expense item ONLY (default)" 
                                className="h4"
                                onChange={() => setFormData({...formData, expenseItemOption:0})}
                                onClick={() => setFormData({...formData, expenseItemOption:0})}
                                checked={formData.expenseItemOption===0} />
                    </ListGroup.Item>
                    <ListGroup.Item onClick={() => setFormData({...formData, expenseItemOption:1})}>
                        <Form.Check type="radio" 
                                name="expenseItemOption" 
                                label="Calculate ALL expense items" 
                                className="h4"
                                onChange={() => setFormData({...formData, expenseItemOption:1})}
                                onClick={() => setFormData({...formData, expenseItemOption:1})}
                                checked={formData.expenseItemOption===1}/>
                    </ListGroup.Item>
                    <ListGroup.Item onClick={() => setFormData({...formData, expenseItemOption:2})}>
                        <Form.Check type="radio" 
                                name="expenseItemOption" 
                                label="Manually select expense item(s) to calculate" 
                                className="h4"
                                onChange={() => setFormData({...formData, expenseItemOption:2})}
                                onClick={() => setFormData({...formData, expenseItemOption:2})}
                                checked={formData.expenseItemOption===2}/>
                    </ListGroup.Item>                                
                </ListGroup>
            </Card.Body>
            <Row>
                <Col><Button variant="outline-secondary" className="w-100" 
                        onClick={() => prev()} disabled>&lt; Previous</Button></Col>
                <Col><Button variant="outline-success" className="w-100" 
                        onClick={() => next()}>Next &gt;</Button></Col>
            </Row>                        
        </Card.Body>
        </Card>
    )
}

export default CalculationStep1;