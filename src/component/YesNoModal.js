import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';

const initModalConfig = {show:false, heading:"", body:""};

function YesNoModal({modalConfig = initModalConfig, handleYes, handleNo}) {
  const {show, heading, body} = modalConfig;

  return (
    <>
      <Modal show={show} 
              onHide={handleNo}
              size="md"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              >
        <Modal.Header className="bg-light">
          <Modal.Title className="fs-5">{heading}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-danger fs-5">{body}</Modal.Body>
        <Modal.Footer className="bg-light">
            <Stack direction="horizontal" gap={3} className="w-100">
                <Button variant="success" onClick={handleYes} className="w-100">Yes</Button>
                <Button variant="danger" onClick={handleNo}  className="w-100">No</Button>
            </Stack>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default YesNoModal;