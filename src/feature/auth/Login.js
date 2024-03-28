// public packages
import { useState } from "react";
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import { Link } from 'react-router-dom';
import { Eye, EyeSlashFill } from "react-bootstrap-icons";
import { useGoogleLogin } from '@react-oauth/google';

// self-developed packages
import { useAuthContext } from "../../context/AuthContext"
import { loginApi, googleLoginApi, googleRegisterApi } from "../../api/AuthApi"
import MessageModal from "../../component/MessageModal";
import ThirdPartyRegistrationModal from "./component/ThirdPartyRegistrationModal"

import logo from '../../image/finance-department-employees.jpg';
import CalculatorSVG from "../../image/calculator-icon4.svg"
import SignInGoogleSVG from "../../image/sign_in_with_google.svg"


const Login = () => {
  const variant = 'success';  //set the boot-strap theme
  const { initializeAccess, resetAccess } = useAuthContext();

  const [modalConfig, setModalConfig] = useState({ show: false, heading: "", body: "" });
  const [regModal, showRegModal] = useState(false);

  const [thirdPartyCredential, setThirdPartyCredential] = useState();

  const [showPass, setShowPass] = useState(false);
  const clickShowHideEye = () => {
    setShowPass(!showPass);
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget;

    event.preventDefault();
    // event.stopPropagation();

    if (form.checkValidity() === false) {
      return
    }

    const response = await loginApi({
      email: form._email.value,
      password: form._password.value
    });

    if (response && response.auth) {
      // console.log("login success", response.auth);
      initializeAccess(response.auth)
    } else {
      setModalConfig({ show: true, heading: "Error", body: "Incorrect username or password. Please try again!" })
      resetAccess();
    }
  };

  const getSystemAccess = async (credential) => {
    const response = await googleLoginApi(credential);

    if (response && response.auth) {
      //console.log("login success", response.auth);
      initializeAccess(response.auth)
    } else if (response && response.action) {
      setThirdPartyCredential(credential);
      showRegModal(true);
    } else {
      setModalConfig({ show: true, heading: "Error", body: "Failed to get access by Google account. Please try again!" })
      resetAccess();
    }
  }

  const confirmThridPartyRegister = async (regcode) => {
    const response = await googleRegisterApi(thirdPartyCredential, regcode);

    if (response && response.auth) {
      //console.log("login success", response.auth);
      initializeAccess(response.auth)
    } else {
      setModalConfig({ show: true, heading: "Error", body: response.error.message })
      resetAccess();
    }

    showRegModal(false);
  }

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => getSystemAccess(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  return (
    <div className='Login'>
      <MessageModal modalConfig={modalConfig}
        handleModalClose={() => setModalConfig({ show: false, heading: "", body: "" })} />
      <ThirdPartyRegistrationModal show={regModal} setShow={showRegModal} confirm={confirmThridPartyRegister} />
      <Card
        bg={variant.toLowerCase()}
        key={variant}
        text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
        className="mb-2 login-card"
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
          <Form onSubmit={handleSubmit}>
            <InputGroup className="mt-4 mb-3">
              <InputGroup.Text className="w-25 ">Email</InputGroup.Text>
              <Form.Control
                name="_email"
                type="email"
                placeholder="Enter email"
                required
              />
            </InputGroup>
            <InputGroup className="mt-1 mb-2">
              <InputGroup.Text className="w-25">Password</InputGroup.Text>
              <Form.Control
                name="_password"
                type={showPass ? "text" : "password"}
                placeholder="Enter Password"
                required
              />
              <InputGroup.Text onClick={clickShowHideEye}>
                {showPass ? <Eye /> : <EyeSlashFill />}
              </InputGroup.Text>
            </InputGroup>

            <Button variant="dark" type="submit" className="w-100 mt-2 fs-5">Login</Button>
          </Form>
          <Card.Footer>
            <Link to="/register" className="fs-5 text-white-50 link-underline-success ">
              (Click here to register)
            </Link>
            <div className="mb-2">OR</div>
            {/* <div  style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
            <GoogleLogin useOneTap size="large" logo_alignment="center" shape="pill"
                onSuccess={(credentialResponse) => {
                  //console.log(credentialResponse);
                  console.log("decoded:", jwtDecode(credentialResponse.credential))
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
            />
            </div> */}
            <div>
              <Image src={SignInGoogleSVG} onClick={() => googleLogin()} />
            </div>
          </Card.Footer>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;