import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Form from 'react-bootstrap/Form';

const CalculationStep3 = ({formData, setFormData, prev, next, currency}) => {
    return (        
        <Card style={{ width: '100%' }}>
        <Card.Body>
            <Card.Title><div className="h4"><b>Step 3 - Select base currency for calculation</b></div></Card.Title>
            <Card.Body className="mt-4">
                <ListGroup>
                    {currency && currency.map((cur) => {
                        return (
                            <ListGroup.Item key={`item_${cur._id}`} onClick={() => setFormData({...formData, selectedCCY:cur._id})}>
                                <Form.Check type="radio" 
                                        key={`radio_${cur._id}`}
                                        name="currencyOption" 
                                        label={cur.value.concat((cur._id===formData.defaultCCY)?" (default event currency)":"")}
                                        className="h4"
                                        onChange={() => setFormData({...formData, selectedCCY:cur._id})}
                                        onClick={() => setFormData({...formData, selectedCCY:cur._id})}
                                        checked={formData.selectedCCY===cur._id} />
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

export default CalculationStep3;