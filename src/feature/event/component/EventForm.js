import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import ToggleButton from "react-bootstrap/ToggleButton";

import { useAuthContext } from "../../../context/AuthContext"
import { eventSchema } from "../../../schema/ValidationSchema"
import { getFlattenedFriendsApi } from "../../../api/FriendApi"
import { getEventMasterDataApi } from "../../../api/EventApi"

import FriendAddModal from "../../friend/FriendAddModal";

function EventForm ({eventData, setEventData, setAlertConfig, saveToDB}) {
    const [masterData, setMasterData] = useState([]);
    const [friends, setFriends] = useState([]);
    const [validated, setValidated] = useState(false);
    const [addFriendModalShow, setAddFriendModalShow] = useState(false);

    const { userProfile } = useAuthContext();
    const { state } = useLocation();

    useEffect( () => {
        if(state) {
            eventData = state;
            eventData.expenseDefaultCCY = eventData?.expenseDefaultCCY?._id;
            eventData.eventFrequency = eventData?.eventFrequency?._id;
            eventData.eventNature = eventData?.eventNature?._id;
            setEventData(state);
        }
        setAlertConfig({show:false, heading:"", body:""})
        fetchData();
    }, []);
 
    const closeAddFriendModal = () => {
        setAddFriendModalShow(false);
        fetchData();
    }

    const fetchData = (async () => {   
        const data = await getEventMasterDataApi(userProfile);

        if( data.error ) {
            setAlertConfig({show:true, heading:"Failed to load event master data:", body: data.error})
        } else {
            setMasterData(data);
        }

        const result = await getFlattenedFriendsApi(userProfile);

        if( result.error ) {
            setAlertConfig({show:true, heading:"Failed to load your friends:", body: result.error})
        } else {
            for(let i=0; i<result.length; i++) {
                if(Object.keys(eventData).length > 0) {
                    const found = eventData.friendsInvolved && eventData.friendsInvolved.find((element) => element.friendId === result[i].friendId);
                    if(eventData.friendsInvolved && found)
                        result[i].checked = true;
                    else
                        result[i].checked = false;
                } else {                   
                    result[i].checked = false;
                }
            }
            setFriends(result);
        }
    });


    const resetFriendSelection = () => {
        let _friend = [];

        _friend = friends.map((f) => {
                    f.checked = false;
                    return f;
                });

        setFriends(_friend);
    }

    const selectFriend = (index) => {
        friends[index].checked=!friends[index].checked

        let _friends = [];
        // if group lead is selected, all his/her members also selected 
        if( friends[index].friendId === friends[index].parentId && friends[index].checked) {
            _friends = friends.map((friend) => {
                if(friend.parentId === friends[index].friendId) {
                    friend.checked = friends[index].checked
                    return friend;
                }
                return friend;
            })
        } else {
            _friends = [...friends]
        }

        setFriends(_friends)
    }

    const onChange = (event) => {
        eventData[event.currentTarget.name] = event.currentTarget.value;
        setEventData({...eventData})
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);

        // trim string fields
        Object.keys(eventData).map((key) => {
            if (typeof eventData[key] === 'string' || eventData[key] instanceof String)
                eventData[key] = eventData[key].trim()
        })

        // get the selected friend's Id
        const selectedFriendsId = friends.filter(friend => friend.checked).map(f => f.friendId);

        // assign to eventData
        eventData.friendsInvolved = selectedFriendsId;
        eventData.userProfile = userProfile.profileId;

        if(eventData.eventStartDate === "")
            delete eventData.eventStartDate

        if(eventData.eventEndDate === "")
            delete eventData.eventEndDate

        // remove unnecessary properties coming from edit
        delete eventData.lastestExpenses;
        delete eventData.__v
        delete eventData.lastUpdatedAt;
        delete eventData.createdAt;

        let gotError = false;
        let errorList = [];
        await eventSchema
                .validate(eventData, { abortEarly: false })
                .catch((err) => {
                    gotError = true;
                    setValidated(true);
                    if(err.name === "ValidationError") {
                        errorList = errorList.concat(err.errors);
                    } else {
                        errorList.push(err.message)
                    }
                });

        if(eventData.eventStartDate && eventData.eventEndDate) {
            const start=new Date(eventData.eventStartDate);
            const end=new Date(eventData.eventEndDate);
            if(start > end) {
                gotError = true;
                errorList.push("Event start date should not be bigger than event end date")
            }
        }
 //console.log(eventData)       
        if(gotError) {
            errorList = Array.from(new Set(errorList));
            errorList = errorList.map((item) => "<li>" + item + "</li>")
            const errorStr = "<ul>" + errorList.toString().replaceAll(",","") + "</ul>";
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setAlertConfig({show:true, heading:"Error found:", body:errorStr})
        } else {
            saveToDB(eventData);
        }
    }

    const formatDate = (date) => {
        const dateObj = new Date(date)
        if(!isNaN(dateObj)) {
            return `${dateObj.getFullYear()}-${(dateObj.getMonth()+1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`
        }  
        return ""; 
    }

    return (
        <>
            <FriendAddModal
                show={addFriendModalShow}
                onHide={closeAddFriendModal}
            />
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mt-3">
                    <Col xs={12} md={4}>
                        <InputGroup className="mb-3" hasValidation>
                            <InputGroup.Text id="event-name" className="event-form-label">Name</InputGroup.Text>
                            <Form.Control
                                name="eventName"
                                value={eventData.eventName}
                                placeholder="Event name"
                                aria-label="eventName"
                                required
                                minLength={2}
                                maxLength={50}
                                onChange={onChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col xs={12} md={4}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="start-date" className="event-form-label">Start Date</InputGroup.Text>
                            <Form.Control
                                type="date"
                                name="eventStartDate"
                                value={formatDate(eventData.eventStartDate)}
                                placeholder="Start date (optional)"
                                aria-label="eventStartDate"
                                onChange={onChange}
                            />
                        </InputGroup>
                    </Col>
                    <Col xs={12} md={4}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="end-date" className="event-form-label">End Date</InputGroup.Text>
                            <Form.Control
                                type="date"
                                name="eventEndDate"
                                value={formatDate(eventData.eventEndDate)}
                                placeholder="End date (optional)"
                                aria-label="eventEndDate"
                                onChange={onChange}
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <Row> 
                    <Col xs={12} md={4}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="event-ccy" className="event-form-label">Currency</InputGroup.Text>
                            <Form.Select aria-label="expenseDefaultCCY" 
                                name="expenseDefaultCCY" 
                                value={eventData?.expenseDefaultCCY} 
                                required
                                onChange={onChange}>
                                <option value="">Event base currency</option>
                                {masterData.currency && masterData.currency.map((item) => <option key={item._id} value={item._id}>{item.value}</option>)}
                            </Form.Select>
                        </InputGroup>   
                    </Col>        
                    <Col xs={12} md={4}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="event-nature" className="event-form-label">Nature</InputGroup.Text>
                            <Form.Select aria-label="eventNature" 
                                name="eventNature" 
                                value={eventData?.eventNature}
                                onChange={onChange}>
                                <option value="">Event nature (optional) </option>
                                {masterData.eventNature && masterData.eventNature.map(item => <option key={item._id} value={item._id}>{item.value}</option>)}
                            </Form.Select>
                        </InputGroup>   
                    </Col>      
                    <Col xs={12} md={4}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="event-frequency" className="event-form-label">Frequency</InputGroup.Text>
                            <Form.Select aria-label="eventFrequency" 
                                name="eventFrequency" 
                                value={eventData?.eventFrequency}
                                onChange={onChange}>
                                <option value="">Event frequency (optional)</option>
                                {masterData.eventFrequency && masterData.eventFrequency.map(item => <option key={item._id} value={item._id}>{item.value}</option>)}
                            </Form.Select>
                        </InputGroup>   
                    </Col>                             
                </Row>
                <Row>
                    <Col xs={12}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="event-description" className="event-form-label">Description</InputGroup.Text>
                            <Form.Control
                                as="textarea"
                                name="eventDesc"
                                placeholder="Event description (optional)"
                                aria-label="eventDesc"
                                value={eventData.eventDesc}
                                onChange={onChange}
                            />
                        </InputGroup>       
                    </Col>     
                </Row>
                <Row>
                    <Col xs={12}>
                        <Stack direction="horizontal" className="border rounded bg-secondary mb-2" gap="3">
                            <div className="p-2 text-light fs-5 font-weight-bold">Involved Friends</div>
                            <div className="p-2 ms-auto">
                                <Button variant="outline-warning" size="sm"
                                    onClick={resetFriendSelection}>Clear Selection</Button>
                            </div>
                        </Stack>
                    </Col>                       
                </Row>
                <Row>
                    <Col>
                        { friends.map( (friend, index) => {
                            if( friend.friendId === friend.parentId) {
                                return (
                                    <>
                                    {(index > 0 && friend.friendId === friend.parentId) && <br key={`br_${friend.friendId}`} />}                                    
                                    <ToggleButton key={friend.friendId}
                                        id={`toggle_${friend.friendId}`}
                                        type="checkbox" 
                                        checked={friend.checked} 
                                        variant='outline-secondary' 
                                        className="event-form-button m-1"
                                        onClick={() => selectFriend(index)}>
                                    {friend.friendName}
                                    </ToggleButton>
                                    </>
                                )
                            } else {
                                return(
                                    <ToggleButton key={`toggle_${friend.friendId}`}
                                        id={friend.friendId}
                                        type="checkbox" 
                                        checked={friend.checked} 
                                        variant='outline-success' 
                                        className="event-form-button m-1"
                                        onClick={() => selectFriend(index)}>
                                    {friend.friendName}
                                    </ToggleButton>
                                )
                            }
                        })}                                   
                    </Col>
                </Row>         
                <Row className="my-4">
                    <Col xs={12} sm={6} className="mt-2">
                        <Button variant="warning" type="button" size="lg" style={{ width: "100%" }}
                            className="ms-auto"
                            onClick={() => setAddFriendModalShow(true)}>Add more friends...</Button>
                    </Col>        
                    <Col xs={12} sm={6} className="mt-2">
                        <Button variant="success" type="submit" size="lg" style={{ width: "100%" }}
                            className="ms-auto">Save Event</Button>
                    </Col>             
                </Row>    
            </Form>
        </>
    )
}

export default EventForm;