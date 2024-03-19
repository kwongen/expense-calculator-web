import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";

import FriendEdit from "./component/FriendEdit"
import { friendSchema } from "../../schema/ValidationSchema"
import MessageAlert from "../../component/MessageAlert";
import MessageModal from "../../component/MessageModal";
import { updateFriendApi } from "../../api/FriendApi"
import  { useAuthContext } from "../../context/AuthContext"

function FriendEditModal({show, friend, friendOrig, onHide, onChange, onDelete}) {
    const [validated, setValidated] = useState(false);
    const [alertConfig, setAlertConfig] = useState({show:false, heading:"", body:""});
    const [modalConfig, setModalConfig] = useState({show:false, heading:"", body:""});
    const { userProfile } = useAuthContext();

    const closeFriendModal = (event) => {
        setValidated(false);
        setAlertConfig({show:false, heading:"", body:""})
        onHide(event);
    }

    const closeMessageModal = (event) => {
        setModalConfig({show:false, heading:"", body:""});
        closeFriendModal(event);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setAlertConfig({show:false, heading:"", body:""})

        friend.members.forEach((item, index) => {
            if(item._id && !item.active) {
                friend.members[index].name = friendOrig.members[index].name + " (deleted)"
                friend.members[index].email = friendOrig.members[index].email
            }
        })

        let gotError = false;
        let errorList = [];
        await friendSchema
                .validate(friend, { abortEarly: false })
                .catch((err) => {
                    gotError = true;
                    setValidated(true);
                    if(err.name === "ValidationError") {
                        errorList = errorList.concat(err.errors);
                    } else {
                        errorList.push(err.message)
                    }
                })
        

        if(gotError) {
            errorList = Array.from(new Set(errorList));
            errorList = errorList.map((item) => "<li>" + item + "</li>")
            const errorStr = "<ul>" + errorList.toString().replaceAll(",","") + "</ul>";
            setAlertConfig({show:true, heading:"Error found:", body:errorStr})
        } else {
            const response = await updateFriendApi(userProfile, friend);

            if( response.error ) {
                setAlertConfig({show:true, heading:"Error occured:", body: response.error})
            } else {
                setModalConfig({show:true, heading:"Message", body:"Successfully update your friend's record."});
            }
        }
    }

    return (
            <Modal
                show={show}
                onHide={onHide}
                id="friend-modal"
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop="static"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter" className="protest-riot-regular-lg">
                        Edit friends &amp; family
                    </Modal.Title>
                </Modal.Header>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Body id="_modal_body" className="friend-modal-body">
                    <MessageAlert alertConfig={alertConfig}  />
                    <MessageModal modalConfig={modalConfig} handleModalClose={closeMessageModal} />
                    <FriendEdit friend={friend} setFriend={onChange} />
                </Modal.Body>
                <Modal.Footer id="_modal_footer">
                    <Stack direction="horizontal" gap={3} className="w-100">
                        <Button variant="danger" style={{ width: "10rem" }}
                            onClick={() => onDelete(friend._id)}
                            className="">Delete</Button>
                        <Button variant="success" type="submit" style={{ width: "10rem" }}
                            className="ms-auto">Save</Button>
                        <Button variant="success" style={{ width: "10rem" }}
                            onClick={closeFriendModal}>Cancel</Button>
                    </Stack>
                </Modal.Footer>
                </Form>
            </Modal>
    );
}

export default FriendEditModal;