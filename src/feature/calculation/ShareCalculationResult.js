import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import MessageAlert from "../../component/MessageAlert";
import { getSharedCalculationResultApi } from "../../api/CalculationApi"

import ViewCalculationDetail from "./component/ViewCalculationDetail"


const ShareCalculationResult = () => {
    const {eventId, calculationId, shareCode} = useParams();
    const [eventData, setEventData] = useState();
    const [calculationData, setCalculationData] = useState();
    const [alertConfig, setAlertConfig] = useState({show:false, heading:"", body:""});

    useEffect( () => {
        fetchData(eventId, calculationId)
    }, []);

    const fetchData = (async (eventId, calculationId) => {   
        const result = await getSharedCalculationResultApi(eventId, calculationId, shareCode);

        if( result.error ) {
            setAlertConfig({show:true, heading:"Failed to load calculation result:", body: result.error});
        } else {
            setEventData(result.eventData);
            setCalculationData(result.calculationData);
        }
    });

    return (
        <>
            <MessageAlert alertConfig={alertConfig}  />
            {eventData && 
                <center>
                    <div className="text-success protest-riot-regular-lg fs-1">
                    {eventData.eventName}
                    </div>
                </center>
            }
            {calculationData && <ViewCalculationDetail eventData={eventData} calculationData={calculationData}/> }
        </>
    )
}

export default ShareCalculationResult