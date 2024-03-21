import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { useAuthContext } from "../../context/AuthContext"
import { getExpenseApi, deactivateExpenseApi } from "../../api/ExpenseApi"
import { getCalculationsApi, deactivateCalculationApi } from "../../api/CalculationApi"
import SiteLayout from "../../component/SiteLayout";
import MessageAlert from "../../component/MessageAlert";
import YesNoModal from "../../component/YesNoModal";
import MessageModal from "../../component/MessageModal";
import ExpenseTable from "./component/ExpenseTable";
import CalculationTable from "../calculation/component/CalculationTable";

function ExpenseHistory () {
    const [alertConfig, setAlertConfig] = useState({show:false, heading:"", body:""});
    const [yesNoModalConfig, setYesNoModalConfig] = useState({show:false, heading:"", body:""});
    const [deleteExpenseId, setDeleteExpenseId] = useState();
    const [msgModalConfig, setMsgModalConfig] = useState({show:false, heading:"", body:""});
    const [eventData, setEventData] = useState({});
    const [expenseData, setExpenseData] = useState([]);
    const [lastExpenseDate, setLastExpenseDate] = useState("");
    const [calculationData, setCalculationData] = useState([]);
    const [deleteCalculationId, setDeleteCalculationId] = useState();
    const [deleteType, setDeleteType] = useState();

    const { userProfile } = useAuthContext();
    const navigate = useNavigate();    
    const { state } = useLocation();

    useEffect( () => { 
        if(state) {
            if(state.hasOwnProperty("eventData")) {
                setEventData(state.eventData);
                fetchExpenseData(state.eventData._id);
                fetchCalculationData(state.eventData._id);
            }         
        }

        setAlertConfig({show:false, heading:"", body:""})
    }, []);
    
    const fetchExpenseData = (async (eventId) => {   
        const result = await getExpenseApi(userProfile, eventId);

        if( result.error ) {
            setAlertConfig({show:true, heading:"Failed to load your expenses:", body: result.error});
        } else {
            setExpenseData(result);
            if(result.length > 0)
                setLastExpenseDate(result[0].expenseDate.slice(0,10))
            else
                setLastExpenseDate("No expense")
        }
    });

    const fetchCalculationData = (async (eventId) => {   
        const result = await getCalculationsApi(userProfile, eventId);

        if( result.error ) {
            setAlertConfig({show:true, heading:"Failed to load your calculation:", body: result.error});
        } else {
            setCalculationData(result);
        }
    });

    const deleteExpense = (index) => {
        const expense = expenseData[index];       
        const msgPart = `expense paid by ${expense.paidBy.friendName} on ${expense.expenseDate.slice(0,10)} for ${expense.expenseType.value.toLowerCase()} with amount ${expense.expenseCCY.symbol}${expense.expenseAmt.$numberDecimal}`;
        setDeleteType("expense");
        setDeleteExpenseId(expense._id);
        setYesNoModalConfig({show:true, heading:"Confirm", body:`Do you want to delete this ${msgPart}?`})
    }

    const deleteCalculation = (index) => {
        const calculation = calculationData[index]; 
        setDeleteType("calculation");
        setDeleteCalculationId(calculation._id);
        setYesNoModalConfig({show:true, heading:"Confirm", body:`Do you want to delete this calculation performed on ${calculation.createdAt.slice(0,10)}?`})
    }

    const confirmDelete = () => {
        if(deleteType === "expense") {
            confirmDeleteExpense();
        }

        if(deleteType === "calculation") {
            confirmDeleteCalculation();
        }
    }

    const confirmDeleteExpense = async () => {
        const expense = expenseData.find((exp) => exp._id === deleteExpenseId)
   
        const msgPart = `expense paid by ${expense.paidBy.friendName} on ${expense.expenseDate.slice(0,10)} for ${expense.expenseType.value.toLowerCase()} with amount ${expense.expenseCCY.symbol}${expense.expenseAmt.$numberDecimal}`;

        setYesNoModalConfig({show:false, heading:"", body:""})

        try {
            const result = await deactivateExpenseApi(userProfile, deleteExpenseId)

            if(result === "success") {
                setMsgModalConfig({show:true, heading:"Delete", body:`This ${msgPart} has deleted.`})
                fetchExpenseData(eventData._id);
            } else {
                setMsgModalConfig({show:true, heading:"Error", body:`Failed to delete this ${msgPart}: ${result.error}`})               
            }
        } catch (error) {
            setMsgModalConfig({show:true, heading:"Error", body:`Failed to delete this ${msgPart}: ${error.message}`})
        }
    }

    const confirmDeleteCalculation = async () => {
        const calculation = calculationData.find((calc) => calc._id === deleteCalculationId)
   
        setYesNoModalConfig({show:false, heading:"", body:""})

        try {
            const result = await deactivateCalculationApi(userProfile, deleteCalculationId)

            if(result === "success") {
                setMsgModalConfig({show:true, heading:"Delete", body:`The calculation performed on ${calculation.createdAt.slice(0,10)} has deleted.`})
                fetchCalculationData(eventData._id);
            } else {
                setMsgModalConfig({show:true, heading:"Error", body:`Failed to delete the calculation performed on ${calculation.createdAt.slice(0,10)}: ${result.error}`})               
            }
        } catch (error) {
            setMsgModalConfig({show:true, heading:"Error", body:`Failed to delete the calculation performed on ${calculation.createdAt.slice(0,10)}: ${error.message}`})
        }
    }

    const openAddExpensePage = () => {
        navigate('/main/expense/add', {state: {eventData: eventData}});
    }

    const openEditExpensePage = (index) => {
        navigate('/main/expense/edit', {state: {eventData: eventData, expenseData:expenseData[index]}});
    }

    const openNewCalculationPage = () => {
        navigate('/main/calculation/add', {state: {eventData: eventData}});
    }

    const openViewCalculationPage = (index) => {
        navigate('/main/calculation/view', {state: {eventData: eventData, calculationData:calculationData[index]}});
        //navigate('/main/calculation/view', {state: {eventData: eventData, calculationId:calculationData[index]._id}});
    }

    return (
        <SiteLayout>
            <YesNoModal modalConfig={yesNoModalConfig}
                handleYes={confirmDelete}
                handleNo={() => setYesNoModalConfig({ show: false, heading: "", body: "" })} />
            <MessageModal modalConfig={msgModalConfig}
                handleModalClose={() => setMsgModalConfig({ show: false, heading: "", body: "" })} />

            <MessageAlert alertConfig={alertConfig}  />
            <div className="w-100 ">
                <Row className="m-0 p-0 border rounded-border">
                    <Col xs={12} lg={1} className="fs-3 rounded-border-left border-end bg-secondary text-light text-center protest-riot-regular-lg" style={{overflow:"hidden"}}>Event: </Col>
                    <Col xs={12} lg={2} className="fs-3 text-center protest-riot-regular-lg"><b>{eventData.eventName}</b></Col>
                    <Col xs={0} lg={1}></Col>
                    <Col xs={12} lg={2} className="fs-3 border-end bg-secondary text-light text-center protest-riot-regular-lg">Last Expenses:</Col>
                    <Col xs={12} lg={2} className="fs-3 text-center protest-riot-regular-lg"><b>{lastExpenseDate}</b></Col>   
                    <Col xs={0} lg={1}></Col>                 
                    <Col xs={12} lg={2} className="fs-3 border-end bg-secondary text-light text-center protest-riot-regular-lg"># Expenses:</Col>
                    <Col xs={12} lg={1} className="fs-3 text-center protest-riot-regular-lg"><b>{expenseData.length}</b></Col>
                </Row>
            </div>
            <div className="mt-3 fs-3 ">
                <Row className="w-100 mx-0 pb-0">
                    <Col xs={12} lg={9}><b>Expense Records</b></Col>
                    <Col xs={12} lg={3} className="text-center">
                        <Button size="sm" className="w-100" variant="success"
                            onClick={openAddExpensePage}>New Expense</Button>{' '}
                    </Col>
                </Row>               
            </div>        

            <ExpenseTable expenseData={expenseData} editExpense={openEditExpensePage} deleteExpense={deleteExpense} />

            <div className="mt-3 fs-3 ">
                <Row className="w-100 mx-0 pb-0">
                    <Col xs={12} lg={9}><b>Calculation Records</b></Col>
                    <Col xs={12} lg={3} className="text-center">
                        <Button size="sm" className="w-100" variant="success"
                            onClick={openNewCalculationPage}>New Calculation</Button>
                    </Col>                   
                </Row>               
            </div>  

            <CalculationTable calculationData={calculationData} viewCalculation={openViewCalculationPage} deleteCalculation={deleteCalculation} />
        </SiteLayout>
    )
}

export default ExpenseHistory;
