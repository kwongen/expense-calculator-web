import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import SiteLayout from "../../component/SiteLayout";
import MessageAlert from "../../component/MessageAlert";
import MessageModal from "../../component/MessageModal";
import { useAuthContext } from "../../context/AuthContext"
import ExpenseForm from "./component/ExpenseForm";
import { updateExpenseApi } from "../../api/ExpenseApi"

function EditExpense () {
    const [alertConfig, setAlertConfig] = useState({show:false, heading:"", body:""});
    const [modalConfig, setModalConfig] = useState({show:false, heading:"", body:""});   
    const [eventData, setEventData] = useState({});
    const [expenseFormData, setExpenseFormData] = useState({_id:"",event:"",expenseType:"",expenseDesc:"",
                                                            expenseCCY:"",expenseAmt:"",expenseDate:"",
                                                            paidBy:"",whoInvolved:[]})

    const { userProfile } = useAuthContext();
    const navigate = useNavigate();
    const { state } = useLocation();

    useEffect( () => {
        if(state) {
            if(state.hasOwnProperty("eventData") && state.hasOwnProperty("expenseData")) {
                const _eventData = state.eventData;
                const _expenseData = state.expenseData;

                _eventData.friendsInvolved.sort((a,b) => a.friendName.localeCompare(b.friendName));
                _eventData.friendsInvolved = _eventData.friendsInvolved.map((friend) => {
                                                if(_expenseData.whoInvolved.find((f) => f.friendId === friend.friendId)) {
                                                    friend.checked = true;
                                                } else {
                                                    friend.checked = false;
                                                }
                                                return friend;
                                            });   
                setEventData(_eventData);
                
                setExpenseFormData({_id:_expenseData._id,
                                    event:_eventData._id,
                                    expenseType:_expenseData.expenseType._id,
                                    expenseDesc:_expenseData.expenseDesc,
                                    expenseCCY:_expenseData.expenseCCY._id,
                                    expenseAmt:_expenseData.expenseAmt.$numberDecimal,
                                    expenseDate:_expenseData.expenseDate.slice(0,10),
                                    paidBy:_expenseData.paidBy.friendId,
                                    whoInvolved:[..._eventData.friendsInvolved]});

                setAlertConfig({show:false, heading:"", body:""});
            } else {
                setAlertConfig({show:true, heading:"Error", body:"Failed to load expense data."});
            }   
        } 
    }, []);


    const saveToDB = async (expenseData) => {
        const response = await updateExpenseApi(userProfile, expenseData);

        if( response.error ) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setAlertConfig({show:true, heading:"Error occured:", body: response.error})
        } else {
            setModalConfig({show:true, heading:"Message", body:"Successfully updated the event."});
        }
    }

    const handleModalClose = () => {
        setModalConfig({show:false, heading:"", body:""});
        // navigate("/main/event/list");
        navigate(-1);
    }

    const cancelAction = () => {
        navigate(-1);
    }

    return (
        <SiteLayout >
            <div id="screenTitle" className="flex-container card-deck protest-riot-regular-lg">
               <span className="text-dark">Edit expense:</span> <span className="text-success">{eventData.eventName}</span>
            </div>
            <MessageAlert alertConfig={alertConfig}  />
            <MessageModal modalConfig={modalConfig} 
                          handleModalClose={handleModalClose}  />
            <ExpenseForm expenseFormData={expenseFormData} 
                        setExpenseFormData={setExpenseFormData} 
                        setAlertConfig={setAlertConfig} 
                        saveToDB={saveToDB} 
                        cancelAction={cancelAction}/>
        </SiteLayout>
    )
}

export default EditExpense;