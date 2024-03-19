import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import SiteLayout from "../../component/SiteLayout";
import MessageAlert from "../../component/MessageAlert";
import MessageModal from "../../component/MessageModal";
import { useAuthContext } from "../../context/AuthContext"
import EventForm from "./component/EventForm";
import { updateEventApi } from "../../api/EventApi"

function EditEvent () {
    const [alertConfig, setAlertConfig] = useState({show:false, heading:"", body:""});
    const [modalConfig, setModalConfig] = useState({show:false, heading:"", body:""});   
    const [eventData, setEventData] = useState({});
 
    const { userProfile } = useAuthContext();
    const navigate = useNavigate();

    const saveToDB = async (eventData) => {
        const response = await updateEventApi(userProfile, eventData);

        if( response.error ) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setAlertConfig({show:true, heading:"Error occured:", body: response.error})
        } else {
            setModalConfig({show:true, heading:"Message", body:"Successfully updated the event."});
        }
    }

    return (
        <SiteLayout >
            <div id="screenTitle" className="flex-container card-deck protest-riot-regular-lg">
               Edit event
            </div>
            <MessageAlert alertConfig={alertConfig}  />
            <MessageModal modalConfig={modalConfig} 
                          handleModalClose={() => {
                            setModalConfig({show:false, heading:"", body:""});
                            navigate("/main/event/list");
                          }}  />
            <EventForm eventData={eventData} setEventData={setEventData} setAlertConfig={setAlertConfig} saveToDB={saveToDB}/>
        </SiteLayout>
    )
}

export default EditEvent;