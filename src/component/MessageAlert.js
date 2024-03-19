import Alert from 'react-bootstrap/Alert';

function MessageAlert({alertConfig}) {
    const {show, heading, body} = alertConfig;

    if (show) {
        return (
        <Alert variant="warning" className="text-start text-danger">
            <Alert.Heading className="fs-5">{heading}</Alert.Heading>
            <div className="fs-6"><div dangerouslySetInnerHTML={{ __html: body }} /></div>
        </Alert>
        );
    }
}

export default MessageAlert;