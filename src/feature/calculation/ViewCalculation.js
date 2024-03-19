import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";

import SiteLayout from "../../component/SiteLayout";
import ViewCalculationSummary from "./component/ViewCalculationSummary"
import ViewCalculationDetail from "./component/ViewCalculationDetail"

const ViewCalculation = () => {
    const [eventData, setEventData] = useState({});
    const [calculationData, setCalculationData] = useState({});

    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect( () => {
        if(state) {
            if(state.hasOwnProperty("eventData") && state.hasOwnProperty("calculationData")) {
                setEventData(state.eventData);
                setCalculationData(state.calculationData)         
            }
        }
    }, []);
    
    return (
        <SiteLayout >
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
            <Button size="md" variant="success" className="w-100 my-3" onClick={()=>navigate(-1)}>Go Back</Button>
        </SiteLayout>
    )
}

export default ViewCalculation