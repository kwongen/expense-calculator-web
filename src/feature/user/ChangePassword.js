import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

import SiteLayout from "../../component/SiteLayout";
import MessageAlert from "../../component/MessageAlert";
import MessageModal from "../../component/MessageModal";

import { Eye, EyeSlashFill } from "react-bootstrap-icons";

import { useAuthContext } from "../../context/AuthContext"
import { changePasswordSchema } from "../../schema/ValidationSchema"
import { changePasswordApi } from "../../api/UserApi"
import "./ChangePassword.css";

function ChangePassword () {
    const [alertConfig, setAlertConfig] = useState({show:false, heading:"", body:""});
    const [modalConfig, setModalConfig] = useState({show:false, heading:"", body:""});   
    const [formData, setFormData] = useState({loginId:"",currentPassword:"",newPassword:"",confirmPassword:""})

    const { userProfile } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        initFormData();
    }, [])

    const initFormData = () => {
        setFormData({loginId: userProfile._id,
            currentPassword : "", 
            newPassword : "", 
            confirmPassword : ""});
    }

    const [showPass, setShowPass] = useState(false);
    const clickShowHideEye = () => {
      setShowPass(!showPass);
    }

    const saveToDB = async () => {
        const response = await changePasswordApi(userProfile, formData);

        if( response.error ) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setAlertConfig({show:true, heading:"Error occured:", body: response.error?.message})
        } else {
            setModalConfig({show:true, heading:"Message", body:"Successfully change your password."});
        }
    }

    const fieldError = (errors, errorIndicator, fieldId) => {
        const hasError = errors.filter((item) => item.includes(errorIndicator));
        const formControl = document.getElementById(fieldId);

        if(hasError.length > 0) {
            formControl.classList.remove("is-valid");
            formControl.classList.add("is-invalid");
        } else {
            formControl.classList.remove("is-invalid");
            formControl.classList.add("is-valid");
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        let gotError = false;
        let errorList = [];
        await changePasswordSchema
            .validate(formData, { abortEarly: false })
            .catch((err) => {
                fieldError(err.errors, "Current password", "currentPassword");
                fieldError(err.errors, "New password", "newPassword");
                fieldError(err.errors, "Confirm password", "confirmPassword");

                gotError = true;
                if(err.name === "ValidationError") {
                    errorList = errorList.concat(err.errors);
                } else {
                    errorList.push(err.message)
                }
            });      
                
        if (gotError) {
            errorList = Array.from(new Set(errorList));
            errorList = errorList.map((item) => "<li>" + item + "</li>")
            const errorStr = "<ul>" + errorList.toString().replaceAll(",", "") + "</ul>";
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setAlertConfig({ show: true, heading: "Error found:", body: errorStr })
        } else {
            saveToDB();
        }               
    }

    const onChange = (event) => {
        const _formData = {...formData};
        _formData[event.currentTarget.name] = event.currentTarget.value;
        setFormData(_formData)
    }

    return (
        <SiteLayout >
            <div id="screenTitle" className="flex-container card-deck protest-riot-regular-lg">
               Change Password
            </div>
            <MessageAlert alertConfig={alertConfig}  />
            <MessageModal modalConfig={modalConfig} 
                          handleModalClose={() => {
                            setModalConfig({show:false, heading:"", body:""});
                            navigate("/main/event/list");
                          }}  />
            <Form noValidate onSubmit={handleSubmit}>
                <div className="edit-profile border rounded my-3 py-2">
                    <Row className="align-items-center m-2 py-2">
                        <Col xs={12} lg={3} className=""><b>Current Password:</b></Col>
                        <Col xs={12} lg={9}>
                            <InputGroup className="mt-2 mb-3">
                                <Form.Control
                                    id="currentPassword"
                                    name="currentPassword"
                                    type={showPass ? "text" : "password"}
                                    value={formData.currentPassword}
                                    placeholder="Enter your current password"
                                    required
                                    onChange={onChange}
                                />
                                <InputGroup.Text onClick={clickShowHideEye}>
                                    {showPass ? <Eye /> : <EyeSlashFill />}
                                </InputGroup.Text>
                            </InputGroup>                                
                        </Col>
                    </Row>
                    <Row className="align-items-center m-2 py-2">
                        <Col xs={12} lg={3} className=""><b>New Password:</b></Col>
                        <Col xs={12} lg={9}>
                            <InputGroup className="mt-2 mb-3">
                                <Form.Control
                                    id="newPassword"
                                    name="newPassword"
                                    type={showPass ? "text" : "password"}
                                    value={formData.newPassword}
                                    placeholder="Enter your new password"
                                    required
                                    onChange={onChange}
                                />
                                <InputGroup.Text onClick={clickShowHideEye}>
                                    {showPass ? <Eye /> : <EyeSlashFill />}
                                </InputGroup.Text>
                            </InputGroup>                                
                        </Col>
                    </Row>
                    <Row className="align-items-center m-2 py-2">
                        <Col xs={12} lg={3} className=""><b>Confirm Password:</b></Col>
                        <Col xs={12} lg={9}>
                            <InputGroup className="mt-2 mb-3">
                                <Form.Control
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPass ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    placeholder="Re-enter your new password"
                                    required
                                    onChange={onChange}
                                />
                                <InputGroup.Text onClick={clickShowHideEye}>
                                    {showPass ? <Eye /> : <EyeSlashFill />}
                                </InputGroup.Text>
                            </InputGroup>     
                        </Col>
                    </Row>
                    <Row className="align-items-center m-2 py-3">
                        <Col xs={12} lg={3} className=""></Col>
                        <Col xs={12} lg={3}>
                            <Button type="submit" variant="success" className="w-100 mb-2">Save</Button>
                        </Col>
                        <Col xs={12} lg={3}>
                            <Button variant="outline-success" className="w-100 mb-2" onClick={()=>initFormData()}>Reset</Button>
                        </Col>
                    </Row>                                                                    
                </div>
            </Form>
        </SiteLayout>
    )
}

export default ChangePassword;