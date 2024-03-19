import { useState, useEffect } from "react";
import { ScrollRestoration, Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { useAuthContext } from "../../context/AuthContext"
import { getEventApi, deactivateEventApi } from "../../api/EventApi"
import SiteLayout from "../../component/SiteLayout";
import MessageAlert from "../../component/MessageAlert";
import YesNoModal from "../../component/YesNoModal";
import MessageModal from "../../component/MessageModal";

import EventCard from "./component/EventCard";

function EventList () {
    const [events, setEvents] = useState([]);
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
                {events && events.map((anEvent) => <EventCard key={`eventCard_${anEvent._id}`} eventData={anEvent} onDelete={deleteEvent} />)}
            </div>
            {events && events.length === 0 && (
                <div className=" d-flex justify-content-center">
                    <Card className="w-75 my-5 py-3 px-5">
                        <Card.Body className="">
                            <Card.Title className="text-success fs-1">Welcome to Expense Calculator!</Card.Title>
                            <Card.Body className="text-secondary fs-2">
                                <ol>
                                    <li>Create your <Link to="/main/friend/list">friend &amp; family</Link> list.</li>
                                    <li>Create <Link to="/main/event/add">event(s)</Link> for entering your expenses.</li>
                                    <li>Finally, create expenses and do calculation when ready.</li>
                                </ol>
                            </Card.Body>
                        </Card.Body>
                    </Card>
                </div>
                )}
        </SiteLayout>
    )
}

export default EventList;