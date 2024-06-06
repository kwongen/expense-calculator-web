import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useAuthContext } from "../../context/AuthContext"
import { getEventApi, deactivateEventApi } from "../../api/EventApi"
import SiteLayout from "../../component/SiteLayout";
import MessageAlert from "../../component/MessageAlert";
import YesNoModal from "../../component/YesNoModal";
import MessageModal from "../../component/MessageModal";

import EventCard from "./component/EventCard";

function EventList () {
    const [events, setEvents] = useState([]);
    const [pageReady, setPageReady] = useState(false);
    const [alertConfig, setAlertConfig] = useState({show:false, heading:"", body:""});
    const [yesNoModalConfig, setYesNoModalConfig] = useState({show:false, heading:"", body:""});
    const [deleteEventId, setDeleteEventId] = useState();
    const [msgModalConfig, setMsgModalConfig] = useState({show:false, heading:"", body:""});

    const { userProfile } = useAuthContext();

    useEffect( () => {    
        setAlertConfig({show:false, heading:"", body:""})
        fetchEventData();
    }, []);
    
    const fetchEventData = (async () => {   
        const result = await getEventApi(userProfile);
        
        if( result.error ) {
            setAlertConfig({show:true, heading:"Failed to load your events:", body: result.error});
        } else {
            setEvents(result);
            setPageReady(true);
        }
    });

    const deleteEvent = (anEvent) => {
        setDeleteEventId(anEvent._id)
        setYesNoModalConfig({show:true, heading:"Confirm", body:`Do you want to delete "${anEvent.eventName}" event?`})
    }

    const confirmDelete = async () => {
        const anEvent = events.find((f) => f._id === deleteEventId)

        setYesNoModalConfig({show:false, heading:"", body:""})

        try {
            const result = await deactivateEventApi(userProfile, deleteEventId)

            if(result === "success") {
                setMsgModalConfig({show:true, heading:"Delete", body:`This event "${anEvent.eventName}" has deleted.`})
                fetchEventData();
            } else {
                setMsgModalConfig({show:true, heading:"Error", body:`Failed to delete this event "${anEvent.eventName}": ${result.error}`})               
            }
        } catch (error) {
            setMsgModalConfig({show:true, heading:"Error", body:`Failed to delete this event "${anEvent.eventName}": ${error.message}`})
        }
    }

    return (
        <SiteLayout >
            <YesNoModal modalConfig={yesNoModalConfig}
                handleYes={confirmDelete}
                handleNo={() => setYesNoModalConfig({ show: false, heading: "", body: "" })} />
            <MessageModal modalConfig={msgModalConfig}
                handleModalClose={() => setMsgModalConfig({ show: false, heading: "", body: "" })} />
            <MessageAlert alertConfig={alertConfig}  />
            <div className="flex-container card-deck">
                {pageReady && events && events.map((anEvent) => <EventCard key={`eventCard_${anEvent._id}`} eventData={anEvent} onDelete={deleteEvent} />)}
            </div>
            {pageReady && events && events.length === 0 && (
                <Container className="">
                    <Row className="">
                        <Col xs={12} lg={8} className="text-success fs-1">Welcome to Expense Calculator!</Col>
                        <Col xs={12} lg={8} className="text-secondary fs-2">
                            <ol className="mt-4">
                                <li>Create your <Link to="/main/friend/list">friend &amp; family</Link> list.</li>
                                <li>Create <Link to="/main/event/add">event(s)</Link> for entering your expenses.</li>
                                <li>Finally, create expenses and do calculation when ready.</li>
                            </ol>
                        </Col>
                    </Row>
                </Container>
                )}
        </SiteLayout>
    )
}

export default EventList;
