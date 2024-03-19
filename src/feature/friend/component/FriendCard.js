import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";

import { PersonGear } from "react-bootstrap-icons";

const FriendCard = ({friend, openEditFriendModal, onDelete}) => {
    return (
        <>
        <Card key={`card_${friend._id}`} style={{ width: '440px', margin:"10px" }}>
                <Container key={`container_${friend._id}`} className="h-100">
                    <Row key={`row1_${friend._id}`} style={{ borderBottom: "1px solid #ddd"}}>
                        <Container key={`container2_${friend._id}`} className="py-2">
                            <Row key={`row2_${friend._id}`}>
                                <Col key={`row2_col1_${friend._id}`} className="fs-5">
                                    <span key={`${friend._id}_name`} className='text-danger'>{friend.isMyself && "Yourself"}</span>
                                    {!friend.isMyself && friend.name} 
                                    <span key={`${friend._id}_email`} className='text-secondary fst-italic'>{friend.email!=="" && " (" + friend.email +")"}</span>
                                </Col>
                                <Col key={`row2_col2_${friend._id}`} xs={3} sm={2} className="px-1">                           
                                    <Dropdown key={`dropdown_${friend._id}`}>           
                                        <Dropdown.Toggle key={`dropdown_toggle_${friend._id}`} variant="secondary" id="dropdown-basic">
                                            <PersonGear size="20"/>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu key={`dropdown_menu_${friend._id}`}>
                                            <Dropdown.Item key={`dropdown_item1_${friend._id}`}  onClick={() => openEditFriendModal(friend._id)}>Edit Friend</Dropdown.Item>
                                            {!friend.isMyself &&
                                            <Dropdown.Item key={`dropdown_item2_${friend._id}`}  onClick={() => onDelete(friend)}>Delete Friend</Dropdown.Item>
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>                           
                                </Col>
                            </Row>
                        </Container>
                    </Row>
                    <Row key={`row3_${friend._id}`} className="py-2">
                        <Col>
                            <div key={`${friend._id}_members`}  className="p-0">Members:</div>
                            {friend.members.length === 0 && "<no members>"}
                            {friend.members.length > 0 && friend.members.map((member, index) => 
                            <div key={`${friend._id}_member_info_${index}`} className="px-4 py-0">{member.name} {member.email!=="" && "(" + member.email +")"}</div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </Card>    
        </>    
    )
}

export default FriendCard;