import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import { Gear } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

function EventCard ({ eventData, onDelete }) {
    const navigate = useNavigate();

    const getEventDuration = (eventData) => {
        let eventDuration ="";
        if(eventData.eventStartDate && eventData.eventEndDate) {
            eventDuration = `( ${eventData.eventStartDate.slice(0,10)} to ${eventData.eventEndDate.slice(0,10)} )`
        } else if(eventData.eventStartDate) {
            eventDuration = `( starting at ${eventData.eventStartDate.slice(0,10)} )`
        } else if(eventData.eventEndDate) {
            eventDuration = `( ended at ${eventData.eventEndDate.slice(0,10)} )`
        }
        return eventDuration;
    }

    const eventDurationStr = getEventDuration(eventData)

    const openEditEventPage = () => {
        navigate('/main/event/edit', {state: eventData});
    }

    const openAddExpensePage = () => {
        navigate('/main/expense/add', {state: {eventData: eventData}});
    }

    const openExpenseHistoryPage = () => {
        navigate('/main/expense/history', {state: {eventData: eventData}});
    }

    const openNewCalculationPage = () => {
        navigate('/main/calculation/add', {state: {eventData: eventData}});
    }

    return (
        <Card style={{ width: '440px', margin:"10px" }}>
            <Card.Header as="h5" className="bg-secondary">
                <Stack direction="horizontal" gap={2}>
                    <div className="p-1 text-warning">{eventData.eventName} </div>
                    <div className="p-1 text-light ms-auto">
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                <Gear size="20" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => openEditEventPage()}>Edit Event</Dropdown.Item>
                                <Dropdown.Item onClick={() => onDelete(eventData)}>Delete Event</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>  
                    </div>
                </Stack>
            </Card.Header>
            <Card.Body>
                <Card.Text className="small text-secondary"><i>{`${eventData.eventDesc} ${eventDurationStr}` }</i></Card.Text>
                <Container className="border rounded p-2">
                    <Row className="my-1">
                        <Col xs={12} sm={6} className="mb-1">
                            <Stack direction="horizontal" gap={3}>
                                <div className="fs-6">Nature:</div>
                                <div className="fs-6 ms-auto">{eventData?.eventNature?.value}</div>
                            </Stack>
                        </Col>
                        <Col  xs={12} sm={6} className="mb-0">
                            <Stack direction="horizontal" gap={3}>
                                <div className="fs-6">Frequency:</div>
                                <div className="fs-6 ms-auto">{eventData?.eventFrequency?.value}</div>
                            </Stack>                        
                        </Col>
                    </Row>                    
                    <Row className="my-1">
                        <Col xs={12} sm={6} className="mb-1">
                            <Stack direction="horizontal" gap={3}>
                                <div className="fs-6">Currency:</div>
                                <div className="fs-6 ms-auto">{eventData.expenseDefaultCCY.value}</div>
                            </Stack>
                        </Col>
                        <Col xs={12} sm={6} className="mb-0">
                            <Stack direction="horizontal" gap={3}>
                                <div className="fs-6">Friends:</div>
                                <div className="fs-6 ms-auto">{eventData.friendsInvolved.length}</div>
                            </Stack>                        
                        </Col>
                    </Row>
                    <Row className="my-1">
                        <Col xs={12} sm={6} className="mb-1">
                            <Stack direction="horizontal" gap={3}>
                                <div className="fs-6">Activity:</div>
                                <div className="fs-6 ms-auto">{eventData.lastActivityAt && eventData.lastActivityAt.slice(0,10)}</div>
                            </Stack>
                        </Col>
                        <Col xs={12} sm={6} className="mb-0">
                            <Stack direction="horizontal" gap={3}>
                                <div className="fs-6">Updated:</div>
                                <div className="fs-6 ms-auto">{eventData.lastUpdatedAt.slice(0,10)}</div>
                            </Stack>                        
                        </Col>
                    </Row>
                </Container>
                <br/>
            </Card.Body>
            <Card.Footer className="text-muted border-top-0">
                <Container>
                    <Row>
                        <Col xs={12} md={4} className="mb-2">
                            <Button variant="success" 
                                    className="w-100 fs-6"
                                    onClick={openAddExpensePage}>New Expense</Button>
                        </Col>
                        <Col xs={12} md={4} className="mb-2">
                            <Button variant="success" 
                                    className="w-100 fs-6"
                                    onClick={openNewCalculationPage}>New Calculation</Button>
                        </Col>                        
                        <Col xs={12} md={4} className="mb-2">
                            <Button variant="success"
                                    className="w-100 fs-6"
                                    onClick={openExpenseHistoryPage}>Expense Records</Button>
                        </Col>
                    </Row>
                </Container>            
            </Card.Footer>
        </Card>
    );
}

export default EventCard;