import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import SiteLayout from "../../component/SiteLayout";
import MessageAlert from "../../component/MessageAlert";
import MessageModal from "../../component/MessageModal";
import TooltipOverlay from "../../component/TooltipOverlay";
import { InfoCircle } from "react-bootstrap-icons";

import { useAuthContext } from "../../context/AuthContext"
import { profileSchema } from "../../schema/ValidationSchema"
import { editProfileApi } from "../../api/UserApi"
import "./EditProfile.css";

function EditProfile () {
    const [alertConfig, setAlertConfig] = useState({show:false, heading:"", body:""});
    const [modalConfig, setModalConfig] = useState({show:false, heading:"", body:""});   
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({profileId:"",name:"",email:"",paymentLinkTemplate:"",bankAccountInfo:""})

    const { userProfile, setUserProfile } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        initFormData();
    }, [])

    const initFormData = () => {
        setFormData({profileId: userProfile.profileId,
            name : userProfile.name, 
            email : userProfile.email, 
            paymentLinkTemplate : userProfile.paymentLinkTemplate,
            bankAccountInfo : userProfile.bankAccountInfo});
    }

    const saveToDB = async (formData) => {
        const response = await editProfileApi(userProfile, formData);

        if( response.error ) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setAlertConfig({show:true, heading:"Error occured:", body: response.error?.message})
        } else {
            setModalConfig({show:true, heading:"Message", body:"Successfully update your profile."});
            let _userProfile = {...userProfile};
            _userProfile.name = formData.name;
            _userProfile.email = formData.email;
            _userProfile.paymentLinkTemplate = formData.paymentLinkTemplate;
            _userProfile.bankAccountInfo = formData.bankAccountInfo;
            setUserProfile(_userProfile);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);

        const _formData = {...formData};

        // trim string fields
        Object.keys(_formData).map((key) => {
            if (typeof _formData[key] === 'string' || _formData[key] instanceof String)
                _formData[key] = _formData[key].trim()
        })

        setFormData(_formData);

        let gotError = false;
        let errorList = [];
        await profileSchema
            .validate(_formData, { abortEarly: false })
            .catch((err) => {
                gotError = true;
                setValidated(true);
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
            saveToDB(_formData);
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
               My Profile
            </div>
            <MessageAlert alertConfig={alertConfig}  />
            <MessageModal modalConfig={modalConfig} 
                          handleModalClose={() => {
                            setModalConfig({show:false, heading:"", body:""});
                            navigate("/main/event/list");
                          }}  />
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="edit-profile border rounded my-3 py-2">
                    <Row className="align-items-center m-2 py-2">
                        <Col xs={12} lg={3} className=""><b>Name:</b></Col>
                        <Col xs={12} lg={9}>
                            <Form.Control
                                    name="name"
                                    value={formData.name}
                                    placeholder="Name"
                                    aria-label="name"
                                    required
                                    minLength={2}
                                    maxLength={50}
                                    onChange={onChange}
                                />
                        </Col>
                    </Row>
                    <Row className="align-items-center m-2 py-2">
                        <Col xs={12} lg={3} className=""><b>Email:</b></Col>
                        <Col xs={12} lg={9}>
                            <Form.Control
                                    name="email"
                                    value={formData.email}
                                    placeholder="Email"
                                    aria-label="email"
                                    required
                                    minLength={2}
                                    maxLength={50}
                                    onChange={onChange}
                                />
                        </Col>
                    </Row>
                    <Row className="align-items-center m-2 py-2">
                        <Col xs={12} lg={3} className="">
                            <TooltipOverlay id="paymentLinkTips" titleStyle="text-start" 
                                title={"Information that will be shown in the calculation result so that you can share to your friends. For example, 'Hi #debtor#, please pay #ccy##amount# to #creditor# by this payment link ....'. <br/><br/>Placeholders:<br/>#ccy# - currency symbol<br/>#amount# - payment amount<br/>#creditor# - name of creditor<br/>#debtor# - name of debtor<br/>#event_name# - name of the event<br/><br/>"}>
                                <InfoCircle size={16} className="text-danger" />
                            </TooltipOverlay> <b>Payment Link Template:</b> </Col>
                        <Col xs={12} lg={9}>
                            <Form.Control
                                    as="textarea" 
                                    rows={3}
                                    name="paymentLinkTemplate"
                                    value={formData.paymentLinkTemplate}
                                    placeholder="Payment link template"
                                    aria-label="paymentLinkTemplate"
                                    onChange={onChange}
                                />
                        </Col>
                    </Row>
                    <Row className="align-items-center m-2 py-2">
                        <Col xs={12} lg={3} className="">
                            <TooltipOverlay id="bankInfoTips" titleStyle="text-start" 
                                title={"Information that will be shown in the calculation result so that you can copy and share your bank account information to your friends.<br/><br/>"}>
                                <InfoCircle size={16} className="text-danger" />
                            </TooltipOverlay> <b>Bank Information:</b>
                        </Col>
                        <Col xs={12} lg={9}>
                            <Form.Control
                                    as="textarea" 
                                    rows={3}
                                    name="bankAccountInfo"
                                    value={formData.bankAccountInfo}
                                    placeholder="Bank account information"
                                    aria-label="bankAccountInfo"
                                    onChange={onChange}
                                />
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

export default EditProfile;