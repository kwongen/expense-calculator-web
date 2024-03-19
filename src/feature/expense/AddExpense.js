import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import SiteLayout from "../../component/SiteLayout";
import MessageAlert from "../../component/MessageAlert";
import MessageModal from "../../component/MessageModal";
import { useAuthContext } from "../../context/AuthContext"
import ExpenseForm from "./component/ExpenseForm";
import { addExpenseApi } from "../../api/ExpenseApi"

function AddExpense () {
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
            if(state.hasOwnProperty("eventData")) {
                //console.log("setting eventData", state.eventData)
                const _eventData = state.eventData;
                _eventData.friendsInvolved.sort((a,b) => a.friendName.localeCompare(b.friendName));
                _eventData.friendsInvolved = _eventData.friendsInvolved.map((friend) => {
                                                friend.checked = false;
                                                return friend;
                                            });   
                setEventData(_eventData);
                
                setExpenseFormData({event:_eventData._id,
                                    expenseType:"",
                                    expenseDesc:"",
                                    expenseCCY:_eventData.expenseDefaultCCY._id,
                                    expenseAmt:"",
                                    expenseDate:formatDate(new Date()),
                                    paidBy:getDefaultPaidBy(_eventData.friendsInvolved),
                                    whoInvolved:[..._eventData.friendsInvolved]});
            }         
        }
        setAlertConfig({show:false, heading:"", body:""})
    }, []);

    const getDefaultPaidBy = (friendsInvolved) => {
        if(friendsInvolved) {
            const found = friendsInvolved.find((friend) => friend?.isMyself && friend.parentId===friend.friendId)
            if(found)
                return found.friendId;
        }
        return "";
    }

    const formatDate = (date) => {
        const dateObj = new Date(date)
        if(!isNaN(dateObj)) {
            return `${dateObj.getFullYear()}-${(dateObj.getMonth()+1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`
        }  
        return ""; 
    }

    const saveToDB = async (expenseData) => {
        const response = await addExpenseApi(userProfile, expenseData);

        if( response.error ) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setAlertConfig({show:true, heading:"Error occured:", body: response.error})
        } else {
            setModalConfig({show:true, heading:"Message", body:"Successfully added the event."});
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
               <span className="text-dark">New expense:</span> <span className="text-success">{eventData.eventName}</span>
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

export default AddExpense;