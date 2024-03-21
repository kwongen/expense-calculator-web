import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";

import SiteLayout from "../../component/SiteLayout";
import MessageAlert from "../../component/MessageAlert";
import { useAuthContext } from "../../context/AuthContext"
import { getCalculationsApi } from "../../api/CalculationApi"

import ViewCalculationSummary from "./component/ViewCalculationSummary"
import ViewCalculationDetail from "./component/ViewCalculationDetail"


const ViewCalculation = () => {
    const [alertConfig, setAlertConfig] = useState({show:false, heading:"", body:""});
    const [eventData, setEventData] = useState({});
    const [calculationData, setCalculationData] = useState({});

    const { state } = useLocation();
    const navigate = useNavigate();
    const { userProfile } = useAuthContext();

    useEffect( () => {
        if(state) {
            if(state.hasOwnProperty("eventData") && state.hasOwnProperty("calculationData")) {
                setEventData(state.eventData);   
                setCalculationData(state.calculationData);
            } else if(state.hasOwnProperty("eventData") && state.hasOwnProperty("calculationId")) {
                setEventData(state.eventData);   
                fetchCalculationData(state.eventData._id, state.calculationId)
            }
        }
    }, []);
 
    const fetchCalculationData = (async (eventId, calculationId) => {   
        const result = await getCalculationsApi(userProfile, eventId, {_id:calculationId});
        if( result.error ) {
            setAlertConfig({show:true, heading:"Failed to load calculation data:", body: result.error});
        } else {
            setCalculationData(result[0]);
        }
    });

    return (
        <SiteLayout >
            <MessageAlert alertConfig={alertConfig}  />
            <div id="screenTitle" className="flex-container card-deck protest-riot-regular-lg">
               <div className="text-dark" style={{display:"float",width:"300px"}}>View calculation:</div> 
               <span className="text-success">{eventData.eventName}</span>
            </div>
            <Tabs variant="tabs"
                defaultActiveKey="summary"
                id="calculation-view"
                className="mb-3"
                fill
            >
                <Tab eventKey="summary" title="Summary">
                    <ViewCalculationSummary eventData={eventData} calculationData={calculationData}/>
                </Tab>
                <Tab eventKey="profile" title="Detail">
                    <ViewCalculationDetail eventData={eventData} calculationData={calculationData}/>
                </Tab>
            </Tabs>
            <Button size="md" variant="success" className="w-100 my-3" onClick={()=>navigate("/main/expense/history",{state: {eventData: eventData}})}>Go Back</Button>
        </SiteLayout>
    )
}

export default ViewCalculation