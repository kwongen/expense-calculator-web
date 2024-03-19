import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Form from 'react-bootstrap/Form';

const CalculationStep2 = ({formData, setFormData, prev, next}) => {
    return (
        <Card style={{ width: '100%' }}>
        <Card.Body>
            <Card.Title><div className="h4"><b>Step 2 - How to split the cost of expense(s)?</b></div></Card.Title>
            <Card.Body className="mt-4">
                <ListGroup>
                    <ListGroup.Item onClick={() => setFormData({...formData, splitOption:0})}>
                        <Form.Check type="radio" 
                                name="splitOption" 
                                label="Split the cost evenly for all participants (default)" 
                                className="h4"
                                onChange={() => setFormData({...formData, splitOption:0})}
                                onClick={() => setFormData({...formData, splitOption:0})}
                                checked={formData.splitOption===0} />
                    </ListGroup.Item>
                    <ListGroup.Item onClick={() => setFormData({...formData, splitOption:1})}>
                        <Form.Check type="radio" 
                                name="splitOption" 
                                label="Manually split the cost of each expense" 
                                className="h4"
                                onChange={() => setFormData({...formData, splitOption:1})}
                                onClick={() => setFormData({...formData, splitOption:1})}
                                checked={formData.splitOption===1} />
                    </ListGroup.Item>                              
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

export default CalculationStep2;