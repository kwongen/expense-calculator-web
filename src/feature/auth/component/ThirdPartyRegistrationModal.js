import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

function ThirdPartyRegistrationModal({ show, setShow, confirm }) {
    const confirmClick = (event) => {
        confirm(document.getElementById("regCodeInput").value)
    }

    return (
        <>
            <Modal show={show}
                onHide={() => setShow(false)}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className="bg-light">
                    <Modal.Title className="fs-5">Registration of your Google account</Modal.Title>
                </Modal.Header>
                <Modal.Body className="fs-6">
                    <Stack direction="horizontal" gap={3} className="w-100">
                        <div>Reg Code:</div>
                        <Form.Control id="regCodeInput" type="text" placeholder="registration code" style={{ width: "300px" }} />
                    </Stack>
                </Modal.Body>
                <Modal.Footer className="bg-light">
                    <Stack direction="horizontal" gap={3} className="w-100">
                        <Button variant="outline-success" onClick={() => setShow(false)} className="w-100">Cancel</Button>
                        <Button variant="success" onClick={confirmClick} className="w-100">Confirm</Button>
                    </Stack>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ThirdPartyRegistrationModal;