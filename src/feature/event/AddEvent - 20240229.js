import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import ToggleButton from "react-bootstrap/ToggleButton";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../context/AuthContext"
import { eventSchema } from "../../schema/ValidationSchema"

import SiteLayout from "../../component/SiteLayout";
import MessageAlert from "../../component/MessageAlert";
import MessageModal from "../../component/MessageModal";

import { getFlattenedFriendsApi } from "../../api/FriendApi"
import { getEventMasterDataApi, addEventApi } from "../../api/EventApi"

function AddEvent () {
    const [alertConfig, setAlertConfig] = useState({show:false, heading:"", body:""});
    const [modalConfig, setModalConfig] = useState({show:false, heading:"", body:""});
    const [masterData, setMasterData] = useState([]);
    const [friends, setFriends] = useState([]);
    const [validated, setValidated] = useState(false);
    
    const { userProfile } = useAuthContext();
    const navigate = useNavigate();

    useEffect( () => {    
        setAlertConfig({show:false, heading:"", body:""})
        fetchData();
    }, []);
    
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
                result[i].checked = false;
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;

        const selectedFriendsId = friends.filter(friend => friend.checked).map(f => f.friendId);

        const formData = { 
            userProfile: userProfile.profileId,
            eventName: form.eventName.value.trim(),   
            eventDesc:  form.eventDesc.value.trim(),    
            expenseDefaultCCY: form.eventCCY.value,
            friendsInvolved: selectedFriendsId
        }

        if(form.eventNature.value.trim().length > 0)
            formData.eventNature = form.eventNature.value.trim();

        if(form.eventFrequency.value.trim().length > 0)
            formData.eventFrequency = form.eventFrequency.value.trim();

        if(form.startDate.value.trim().length > 0)
            formData.eventStartDate = form.startDate.value.trim();

        if(form.endDate.value.trim().length > 0)
            formData.eventEndDate = form.endDate.value.trim();

        let gotError = false;
        let errorList = [];
        await eventSchema
                .validate(formData, { abortEarly: false })
                .catch((err) => {
                    gotError = true;
                    setValidated(true);
                    if(err.name === "ValidationError") {
                        errorList = errorList.concat(err.errors);
                    } else {
                        errorList.push(err.message)
                    }
                });

        if(formData.eventStartDate && formData.eventEndDate) {
            const start=new Date(formData.eventStartDate);
            const end=new Date(formData.eventEndDate);
            if(start > end) {
                gotError = true;
                errorList.push("Event start date should not be bigger than event end date")
            }
        }

        if(gotError) {
            errorList = Array.from(new Set(errorList));
            errorList = errorList.map((item) => "<li>" + item + "</li>")
            const errorStr = "<ul>" + errorList.toString().replaceAll(",","") + "</ul>";
            setAlertConfig({show:true, heading:"Error found:", body:errorStr})
        } else {
            const response = await addEventApi(userProfile, formData);

            if( response.error ) {
                setAlertConfig({show:true, heading:"Error occured:", body: response.error})
            } else {
                setModalConfig({show:true, heading:"Message", body:"Successfully added the event."});
            }
        }
    }

    return (
        <SiteLayout >
            <div className="flex-container card-deck protest-riot-regular-lg">
               Create a new event
            </div>
            <MessageAlert alertConfig={alertConfig}  />
            <MessageModal modalConfig={modalConfig} 
                          handleModalClose={() => {
                            setModalConfig({show:false, heading:"", body:""});
                            navigate("/main/event/list");
                          }}  />
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mt-3">
                    <Col xs={12} md={4}>
                        <InputGroup className="mb-3" hasValidation>
                            <InputGroup.Text id="event-name" className="event-form-label">Name</InputGroup.Text>
                            <Form.Control
                                name="eventName"
                                placeholder="Event name"
                                aria-label="eventName"
                                required
                                minLength={2}
                                maxLength={50}
                            />
                        </InputGroup>
                    </Col>
                    <Col xs={12} md={4}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="start-date" className="event-form-label">Start Date</InputGroup.Text>
                            <Form.Control
                                type="date"
                                name="startDate"
                                placeholder="Start date (optional)"
                                aria-label="startDate"
                                date-format="dd-mm-yyyy"
                            />
                        </InputGroup>
                    </Col>
                    <Col xs={12} md={4}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="end-date" className="event-form-label">End Date</InputGroup.Text>
                            <Form.Control
                                type="date"
                                name="endDate"
                                placeholder="End date (optional)"
                                aria-label="endDate"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <Row> 
                    <Col xs={12} md={4}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="event-ccy" className="event-form-label">Currency</InputGroup.Text>
                            <Form.Select aria-label="eventCCY" name="eventCCY" required>
                                <option value="">Event base currency</option>
                                {masterData.currency && masterData.currency.map(item => <option key={item} value={item}>{item}</option>)}
                            </Form.Select>
                        </InputGroup>   
                    </Col>        
                    <Col xs={12} md={4}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="event-nature" className="event-form-label">Nature</InputGroup.Text>
                            <Form.Select aria-label="eventNature" name="eventNature">
                                <option value="">Event nature (option) </option>
                                {masterData.eventNature && masterData.eventNature.map(item => <option key={item} value={item}>{item}</option>)}
                            </Form.Select>
                        </InputGroup>   
                    </Col>      
                    <Col xs={12} md={4}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="event-frequency" className="event-form-label">Frequency</InputGroup.Text>
                            <Form.Select aria-label="eventFrequency" name="eventFrequency">
                                <option value="">Event frequency (option)</option>
                                {masterData.eventFrequency && masterData.eventFrequency.map(item => <option key={item} value={item}>{item}</option>)}
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
                                    {(index > 0 && friend.friendId === friend.parentId) && <br/>}                                    
                                    <ToggleButton key={friend.friendId}
                                        id={friend.friendId}
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
                                    <ToggleButton key={friend.friendId}
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
                        <Button variant="warning" type="submit" size="lg" style={{ width: "100%" }}
                            className="ms-auto">Add more friends...</Button>
                    </Col>        
                    <Col xs={12} sm={6} className="mt-2">
                        <Button variant="success" type="submit" size="lg" style={{ width: "100%" }}
                            className="ms-auto">Save Event</Button>
                    </Col>             
                </Row>    
            </Form>
        </SiteLayout>
    )
}

export default AddEvent;