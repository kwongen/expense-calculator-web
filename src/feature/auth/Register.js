import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import { Link } from "react-router-dom";
import { Eye, EyeSlashFill } from "react-bootstrap-icons";

import { useAuthContext } from "../../context/AuthContext"
import { registerApi } from "../../api/AuthApi"
import { registerSchema } from "../../schema/ValidationSchema"
import MessageAlert from "../../component/MessageAlert";
import logo from "../../image/finance-department-employees.jpg";
import CalculatorSVG from "../../image/calculator-icon4.svg"


function Register() {
  const variant='success';  //set the boot-strap theme

  const [alertConfig, setAlertConfig] = useState({show:false, heading:"", body:""});
  
  const [validated, setValidated] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const clickShowHideEye = () => {
    setShowPass(!showPass);
  }

  const {initializeAccess, resetAccess} = useAuthContext();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    const formData = {
        name: form.name.value,
        email: form.email.value,
        password: form.password.value,
        passwordConfirm: form.passwordConfirm.value,
        regcode: form.regcode.value,
    }

    registerSchema.validate(formData, { abortEarly: false })
    .then (async () => {
        // console.log(form.name.value, form.email.value, 
        //     form.password.value, form.passwordConfirm.value,
        //     form.regcode.value);    
        setValidated(false);
        setAlertConfig({show:false, heading:"", body:""})

        const response = await registerApi(formData);

        if( response && response.auth ) {
            //console.log("register success", response.auth);
            initializeAccess(response.auth)
        } else {
            console.log("register failed");
            resetAccess();
            throw new Error("Failed to register. Please try again!")
        }
    })
    .catch((err) => {
        // console.log(err.name)
        // console.log(err.errors)
        if(err.name === "ValidationError") {
            const errorList = err.errors.reduce((accumulator, item) => {
                    return  accumulator + "<li>" + item + "</li>";
                }, "<ul>") + "</ul>";

            setValidated(true);
            setAlertConfig({show:true, heading:"Note:", body:errorList})
        } else {
            setAlertConfig({show:true, heading:"Error occured:", body:err.message})
        }
    })

    // event.stopPropagation();

    if (form.checkValidity() === false) {
      return
    }
  };

  return (
    <div className='Register'>
        <Card
            bg={variant.toLowerCase()}
            key={variant}
            text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
            className="mb-2 register-card"
        >
            <Card.Img variant="top" src={logo} style={{ width: '100%', height: 'auto' }} />
            <Card.Body>
                <Card.Title className="fs-2 fst-italic text-warning">
                    <img
                        src={CalculatorSVG}
                        width="50"
                        height="40"
                        className="d-inline-block align-top"
                        alt="Expense Calculator icon"
                    />
                    &nbsp;
                    Expenses Calculator
                </Card.Title>
                <Card.Subtitle className="text-start fs-5 mt-4 mb-2 text-white-50 fw-bolder">
                    <u>Please fill in below to register:</u>
                </Card.Subtitle>   
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <InputGroup className="mt-4 mb-3">
                        <InputGroup.Text className="w-25">Name</InputGroup.Text>
                        <Form.Control
                            name="name"
                            type="text"
                            placeholder="Enter your name"
                            required
                            minLength={2}
                            maxLength={50}
                        />
                    </InputGroup>
                    <InputGroup className="mt-2 mb-3">
                        <InputGroup.Text className="w-25 ">Email</InputGroup.Text>
                        <Form.Control
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            required
                        />
                    </InputGroup>
                    <InputGroup className="mt-2 mb-3">
                        <InputGroup.Text className="w-25">Password</InputGroup.Text>
                        <Form.Control
                            name="password"
                            type={showPass ? "text" : "password"}
                            placeholder="Enter your password"
                            required
                        />
                        <InputGroup.Text onClick={clickShowHideEye}>
                            {showPass ? <Eye /> : <EyeSlashFill />}
                        </InputGroup.Text>
                    </InputGroup>
                    <InputGroup className="mt-2 mb-3">
                        <InputGroup.Text className="w-25">Confirm</InputGroup.Text>
                        <Form.Control
                            name="passwordConfirm"
                            type={showPass ? "text" : "password"}
                            placeholder="Confirm your password"
                            required
                        />
                        <InputGroup.Text onClick={clickShowHideEye}>
                            {showPass ? <Eye /> : <EyeSlashFill />}
                        </InputGroup.Text>
                    </InputGroup>
                    <InputGroup className="mt-2 mb-3">
                        <InputGroup.Text className="w-25">Reg Code</InputGroup.Text>
                        <Form.Control
                            name="regcode"
                            type="text"
                            placeholder="Enter the registration code"
                            required
                        />
                    </InputGroup>
                    <MessageAlert alertConfig={alertConfig} setAlertConfig={setAlertConfig} />
                    <Button variant="dark" type="submit" className="w-100 fs-5 mt-3">Register</Button>
                </Form>
                <div>
                <Link to="/login" className="fs-5 text-white-50 link-underline-success ">
                (Click here to login)
                </Link>
                </div>
            </Card.Body>
        </Card>
    </div>
  );
}

export default Register;