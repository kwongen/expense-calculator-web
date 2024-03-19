import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";

import FriendInput from "./component/FriendInput"
import { friendSchema } from "../../schema/ValidationSchema"
import MessageAlert from "../../component/MessageAlert";
import MessageModal from "../../component/MessageModal";
import { addFriendsApi } from "../../api/FriendApi"
import  { useAuthContext } from "../../context/AuthContext"

function FriendAddModal({show, onHide}) {
    const initFriendObj = { name: '', email: '', members: [] };
    const [inputFields, setInputFields] = useState([initFriendObj])
    const [validated, setValidated] = useState(false);
    const [alertConfig, setAlertConfig] = useState({show:false, heading:"", body:""});
    const [modalConfig, setModalConfig] = useState({show:false, heading:"", body:""});
    const { userProfile } = useAuthContext();

    const addFriend = () => {
        const element = document.getElementById("_modal_body");
        element.scrollTop = element.scrollHeight;
    
        setInputFields([...inputFields, initFriendObj])
    }

    const closeFriendModal = (event) => {
        setInputFields([initFriendObj]);
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

        let gotError = false;
        let errorList = [];
        for(let i=0; i<inputFields.length; i++) {
            await friendSchema.validate(inputFields[i], { abortEarly: false })
            .catch((err) => {
                gotError = true;
                setValidated(true);
                if(err.name === "ValidationError") {
                    errorList = errorList.concat(err.errors);
                } else {
                    errorList.push(err.message)
                }
            })
        }

        if(gotError) {
            errorList = Array.from(new Set(errorList));
            errorList = errorList.map((item) => "<li>" + item + "</li>")
            const errorStr = "<ul>" + errorList.toString().replaceAll(",","") + "</ul>";
            setAlertConfig({show:true, heading:"Error found:", body:errorStr})
        } else {
            const response = await addFriendsApi(userProfile, inputFields);

            if( response.error ) {
                setAlertConfig({show:true, heading:"Error occured:", body: response.error})
            } else {
                setModalConfig({show:true, heading:"Message", body:"Successfully added your friends."});
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
                        Add friends &amp; family
                    </Modal.Title>
                </Modal.Header>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Body id="_modal_body" className="friend-modal-body">
                    <MessageAlert alertConfig={alertConfig}  />
                    <MessageModal modalConfig={modalConfig} handleModalClose={closeMessageModal} />
                    {inputFields.map((input, index) => {
                        return (<FriendInput key={"friendInput" + index} index={index} inputFields={inputFields} setInputFields={setInputFields} />)
                    }
                    )}
                </Modal.Body>
                <Modal.Footer id="_modal_footer">
                    <Stack direction="horizontal" gap={3} className="w-100">
                        <Button variant="warning" style={{ width: "10rem" }} 
                            onClick={addFriend}>Add Friend</Button>
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

export default FriendAddModal;