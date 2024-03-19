import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SiteLayout from "../../component/SiteLayout";
import MessageAlert from "../../component/MessageAlert";
import MessageModal from "../../component/MessageModal";
import { useAuthContext } from "../../context/AuthContext"
import EventForm from "./component/EventForm";
import { addEventApi } from "../../api/EventApi"

function AddEvent () {
    const [alertConfig, setAlertConfig] = useState({show:false, heading:"", body:""});
    const [modalConfig, setModalConfig] = useState({show:false, heading:"", body:""});   
    const [eventData, setEventData] = useState({});
 
    const { userProfile } = useAuthContext();
    const navigate = useNavigate();

    const saveToDB = async (eventData) => {
        const response = await addEventApi(userProfile, eventData);

        if( response.error ) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setAlertConfig({show:true, heading:"Error occured:", body: response.error})
        } else {
            setModalConfig({show:true, heading:"Message", body:"Successfully added the event."});
        }
    }

    return (
        <SiteLayout >
            <div id="screenTitle" className="flex-container card-deck protest-riot-regular-lg">
               Create a new event
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

export default AddEvent;