import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const initModalConfig = {show:false, heading:"", body:""};

function MessageModal({modalConfig = initModalConfig, handleModalClose}) {
  const {show, heading, body} = modalConfig;

  return (
    <>
      <Modal show={show} 
              onHide={() => { handleModalClose(initModalConfig)}}
              size="md"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              >
        <Modal.Header closeButton className="bg-body-secondary">
          <Modal.Title>{heading}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-danger">{body}</Modal.Body>
        <Modal.Footer className="bg-body-secondary">
          <Button variant="secondary" onClick={() => { handleModalClose(initModalConfig)}}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MessageModal;