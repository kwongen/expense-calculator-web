import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProgressBar from "react-bootstrap/ProgressBar";

import { useAuthContext } from "../../context/AuthContext";
import { getExpenseApi } from "../../api/ExpenseApi";
import { getCalculationMasterDataApi, addCalculationApi } from "../../api/CalculationApi";
import SiteLayout from "../../component/SiteLayout";
import MessageAlert from "../../component/MessageAlert";
import MessageModal from "../../component/MessageModal";

import CalculationStep1 from "./component/CalculationStep1";
import CalculationStep1a from "./component/CalculationStep1a";
import CalculationStep2 from "./component/CalculationStep2";
import CalculationStep2a from "./component/CalculationStep2a";
import CalculationStep3 from "./component/CalculationStep3";
import CalculationStep4 from "./component/CalculationStep4";
import CalculationStep4a from "./component/CalculationStep4a";
import CalculationStep5 from "./component/CalculationStep5";

import "./Calculation.css";

function AddCalculation () {
    const [alertConfig, setAlertConfig] = useState({show:false, heading:"", body:""});
    const [msgModalConfig, setMsgModalConfig] = useState({show:false, heading:"", body:""});
    const [eventData, setEventData] = useState({});
    const [expenseData, setExpenseData] = useState([]);
    const [currencyMaster, setCurrencyMaster] = useState([]);
    const [step, setStep] = useState("1");
    const allSteps = ["1", "1a", "2", "2a", "3", "4", "4a", "5"];
    const [formData, setFormData] = useState({expenseItemOption: 0, splitOption: 0, exRateOption: 0, defaultCCY: "", selectedCCY:"", 
                                              selectedExpenses:[], splitCostData:{}, involvedCCY:[], systemExRate:{}, finalExRate: {}})
    const [prevState, setPrevState] = useState({expenseItemOption: -1, splitOption: -1, exRateOption: -1, selectedCCY:"", selectedExpenses:[]})

    const { userProfile } = useAuthContext();
    const navigate = useNavigate();    
    const { state } = useLocation();

    useEffect( () => { 
        const fetchExpenseData = async (eventId) => {   
            const result = await getExpenseApi(userProfile, eventId);
    
            if( result.error ) {
                setAlertConfig({show:true, heading:"Failed to load your expenses:", body: result.error});
            } else {
                setExpenseData(result);
            }
        };
    
        const fetchMasterData = async () => {       
            const result = await getCalculationMasterDataApi(userProfile);
    
            if( result.error ) {
                setAlertConfig({show:true, heading:"Failed to load calculation master data:", body: result.error});
            } else {
                setCurrencyMaster(result.currency);
            }        
        }

        if(state) {
            if(state.hasOwnProperty("eventData")) {
                setEventData(state.eventData);
                fetchExpenseData(state.eventData._id);
                fetchMasterData(state.eventData.expenseDefaultCCY._id);
                setFormData({...formData, defaultCCY: state.eventData.expenseDefaultCCY._id,
                                          selectedCCY:state.eventData.expenseDefaultCCY._id})            
            }         
        }

        setAlertConfig({show:false, heading:"", body:""});
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);
    

    const splitCostEvenly = (expense) => {
        let friendSplit = {};
        let avgCost = 0.0;
        let lastCost = 0.0;        
        avgCost = Math.round(expense.expenseAmt.$numberDecimal/expense.whoInvolved.length * 100) / 100;
        lastCost = Math.round((expense.expenseAmt.$numberDecimal - (avgCost * (expense.whoInvolved.length - 1))) * 100)/100;

        expense.whoInvolved.forEach((f, index) => {
            friendSplit[f.friendId] = (index === expense.whoInvolved.length-1)? lastCost : avgCost;
        })

        return friendSplit;
    }

    const buildSplitCostData = (selectedExpenses) => {
        let splitCostData = {};

        if(!selectedExpenses)
            selectedExpenses = formData.selectedExpenses;

        expenseData.forEach((exp) => {
           if(selectedExpenses.indexOf(exp._id) >= 0) {
                splitCostData[exp._id] = splitCostEvenly(exp);
            }
        })

        return splitCostData;
    }

    const validateCostSplitInput = () => {
        let errorList = [];

        for (const [expenseId, splitObj] of Object.entries(formData.splitCostData)) {
            const expense = expenseData.find((exp) => exp._id === expenseId)

            let gotError = false;

            const totalAmt = Object.values(splitObj).reduce((acc, value) => {
                            if(isNaN(Number(value)) || value === "") {
                                gotError = true;
                                return acc;
                            } else {
                                return acc + value;
                            }
                        }, 0)

            const expenseLabel = `${expense.expenseDate.slice(0,10)} / ${expense.expenseType.value} / ${expense.expenseCCY.symbol}${expense.expenseAmt.$numberDecimal} /  paid by ${expense.paidBy.friendName}`            
            if(gotError) {
                errorList.push(`One or more split amount(s) in the expense "${expenseLabel}" is invalid.`)
            }

            if(Math.round(Number(expense.expenseAmt.$numberDecimal)*100)/100 !== Math.round(totalAmt*100)/100){
                errorList.push(`Sum of cost split does not match the expense amount of "${expenseLabel}"`);
            }
        }

        if(errorList.length > 0) {
            const errorMsg = "<ul>" + errorList.reduce((acc, errmsg) => acc + "<li>" + errmsg + "</li>", "") + "</ul>";
            setAlertConfig({show:true, heading:"Error:", body: errorMsg});
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return false;
        } 

        setAlertConfig({show:false, heading:":", body: ""});
        return true;
    }

    const validateFinalExRate = () => {
        let errorList = [];

        for(const [ccy, rate] of Object.entries(formData.finalExRate)) {
            if(isNaN(Number(rate)) || rate.toString().trim() === "") {
                errorList.push(`Incorrect or missing exchange rate for currency "${ccy}"`);
            } else {
                formData.finalExRate[ccy] = Number(rate).toFixed(6);
            }
        }

        if(errorList.length > 0) {
            const errorMsg = "<ul>" + errorList.reduce((acc, errmsg) => acc + "<li>" + errmsg + "</li>", "") + "</ul>";
            setAlertConfig({show:true, heading:"Error:", body: errorMsg});
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return false;
        }

        setFormData({...formData});

        return true;
    }

    const getSystemExRate = (involvedCCY) => {
        if(!involvedCCY) {
            involvedCCY = formData.involvedCCY;
        }

        let systemExRate = {};
        const currency = currencyMaster.find((c) => c._id === formData.selectedCCY);

        involvedCCY.forEach((ccy) => {
            if(ccy !== formData.selectedCCY) {                            
                systemExRate[ccy]=currency.exrate[ccy];
            }                       
        })

        return systemExRate;
    }

    const stateControl = () => {
        switch(step) {
            case "1":
                if(prevState.expenseItemOption !== formData.expenseItemOption ) {
                    let selectedExpenses = [];

                    if(formData.expenseItemOption===0) {
                        const _involvedCCY = [expenseData[0].expenseCCY._id];
                        selectedExpenses = [expenseData[0]._id]
                        setFormData({...formData, selectedExpenses:selectedExpenses, 
                                    involvedCCY:_involvedCCY, 
                                    splitCostData:buildSplitCostData(selectedExpenses),
                                    finalExRate:getSystemExRate(_involvedCCY)});
                                                     
                    } else if(formData.expenseItemOption===1) {
                        const _involvedCCY = [...new Set(expenseData.map((exp) => exp.expenseCCY._id))]
                        selectedExpenses = expenseData.map((exp) => exp._id);
                        setFormData({...formData, selectedExpenses:selectedExpenses, 
                                    involvedCCY:_involvedCCY.sort(), 
                                    splitCostData:buildSplitCostData(selectedExpenses),
                                    finalExRate:getSystemExRate(_involvedCCY)});
                                    
                    } else {
                        setFormData({...formData, selectedExpenses:[], involvedCCY:[], splitCostData:{}, finalExRate:{}});
                    }

                    setPrevState({...prevState, expenseItemOption:formData.expenseItemOption, selectedExpenses:selectedExpenses});
                }
                break;
            case "1a":
                let isSelectExpenseChanged = false;

                if(prevState.selectedExpenses.length !== formData.selectedExpenses.length) {
                    isSelectExpenseChanged  = true;
                } else {
                    for(let i=0; i<formData.selectedExpenses.length; i++) {
                        if(!prevState.selectedExpenses.includes(formData.selectedExpenses[i])) {
                            isSelectExpenseChanged = true;
                            break;
                        }
                    }
                }

                if(isSelectExpenseChanged) {
                    // Get the currency involved from the selected expenses
                    const _involvedCCY = expenseData.filter((exp) => formData.selectedExpenses.includes(exp._id))
                                                    .map((exp) => exp.expenseCCY._id);
                  
                    setFormData({ ...formData, involvedCCY: [...new Set(_involvedCCY)].sort(), 
                                               splitCostData:buildSplitCostData(formData.selectedExpenses),
                                               finalExRate:getSystemExRate(_involvedCCY)});
                }

                setPrevState({...prevState, selectedExpenses:[...formData.selectedExpenses]});

                break;
            case "2":
                if(prevState.splitOption !== formData.splitOption) {
                    setFormData({...formData, splitCostData:buildSplitCostData(formData.selectedExpenses)});
                }

                setPrevState({...prevState, splitOption:formData.splitOption});
                break;
            case "3":
                if(prevState.selectedCCY !== formData.selectedCCY) {                    
                    setFormData({...formData, systemExRate:getSystemExRate(), finalExRate:getSystemExRate()});
                }

                setPrevState({...prevState, selectedCCY:formData.selectedCCY});
                break;
            case "4":
                if(prevState.exRateOption !== formData.exRateOption) {                    
                    setFormData({...formData, finalExRate:getSystemExRate()});
                }

                setPrevState({...prevState, exRateOption:formData.exRateOption});
                break;                
        }
    }

    const next = () => {
        setAlertConfig({show:false, heading:"", body:""})

        let nextStep;

        // handle jumping step
        switch(step) {
            case "1":  // Expense item options
                nextStep = (formData.expenseItemOption===2) ? "1a" : "2";
                break;
            case "1a": // Manual select expense items
                if(formData.selectedExpenses.length === 0) {
                    setAlertConfig({show:true, heading:"Error:", body: "Please select at least 1 expense item for calculation"});
                    return;
                }

                nextStep = "2"
                break;
            case "2": // Split options
                nextStep = (formData.splitOption===1) ? "2a" : "3";
                break;
            case "2a": // Manual input split cost
                nextStep = validateCostSplitInput() ? "3" : "2a";
                break;
            case "3": // Select base CCY
                if(formData.involvedCCY.length === 1 && formData.involvedCCY.includes(formData.selectedCCY)) {
                    nextStep = "5";
                } else {
                    nextStep = "4"
                }               
                break;
            case "4": // Exchange rate options 
                nextStep = (formData.exRateOption===1) ? "4a" : "5";
              
                break;
            case "4a": // Manual input exchange rate
                nextStep = validateFinalExRate() ? "5" : "4a";
                break;
            default:
                nextStep = "";           
        }

        stateControl();

        if(nextStep) {
            setStep(nextStep);
        } else if(allSteps.indexOf(step) + 1 < allSteps.length) {
            setStep(allSteps[allSteps.indexOf(step) + 1]);
        }
    }

    const prev = () => {
        let prevStep;

        // handle jumping step
        switch(step) {
            case "1a":
                if(formData.selectedExpenses.length === 0) {
                    setAlertConfig({show:true, heading:"Error:", body: "Please select at least 1 expense item for calculation"});
                    return;
                }

                prevStep = "1"
                break;
            case "2":
                prevStep = (formData.expenseItemOption===2) ? "1a" : "1";
                break;
            case "2a":
                prevStep = validateCostSplitInput() ? "2" : "2a";
                break;                
            case "3":
                prevStep = (formData.splitOption===1) ? "2a" : "2";
                break;
            case "4a":
                prevStep = validateFinalExRate() ? "4" : "4a";
                break;
            case "5":
                if(formData.involvedCCY.length === 1 && formData.involvedCCY.includes(formData.selectedCCY)) {
                    prevStep = "3";
                } else {
                    prevStep = (formData.exRateOption===1) ? "4a" : "4";  
                }
                
                break;      
            default:
                prevStep = "";           
        }

        stateControl();

        if(prevStep) {
            setStep(prevStep);
        } else if(allSteps.indexOf(step)  > 0) {
            setStep(allSteps[allSteps.indexOf(step) - 1]);
        }
    }

    const submitForm = async () => {
//console.log("formData:", formData)
        let submitData = {};
        const expenseItemOptionCode = ["last","all","manual"];
        const splitOptionCode = ["evenly","manual"];
        const exRateOptionCode = ["system","manual"];

        submitData["event"] = eventData._id;
        submitData["calculationOptions"] = {
            "expenseSelectionOption": expenseItemOptionCode[formData.expenseItemOption],
            "splitCostOption": splitOptionCode[formData.splitOption],
            "exRateOption": exRateOptionCode[formData.exRateOption]
        }
        submitData["eventCCY"] = formData.defaultCCY;
        submitData["calculationCCY"] = formData.selectedCCY;
        submitData["involvedCCY"]=[...formData.involvedCCY];
        submitData["systemExRate"]={...formData.systemExRate};
        submitData["calculationExRate"]={...formData.finalExRate};

        submitData["expensesInvolved"] = [];

        for(let i=0; i<formData.selectedExpenses.length; i++) {
            const expense = expenseData.find((exp) => exp._id===formData.selectedExpenses[i])
            let expensesInvolvedObj = {};

            expensesInvolvedObj["expense"] = expense._id;
            expensesInvolvedObj["expenseCCY"] = expense.expenseCCY._id;
            expensesInvolvedObj["paidBy"] = expense.paidBy.friendId;
            expensesInvolvedObj["expenseAmt"] = expense.expenseAmt;

            expensesInvolvedObj["costSplit"] = []           
            for(const [friendId, amount] of Object.entries(formData.splitCostData[expense._id])) {
                expensesInvolvedObj["costSplit"].push({friendId: friendId, amount:amount});
            }

            submitData["expensesInvolved"].push(expensesInvolvedObj);
        }

//console.log("submitData:", submitData)
        const response = await addCalculationApi(userProfile, submitData);

        if( response.error ) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setAlertConfig({show:true, heading:"Error occured:", body: response.error})
        } else {
            setMsgModalConfig({show:true, heading:"Message", body:"Your calculation request has completed."});
        }
    }

    const handleModalClose = () => {
        setMsgModalConfig({ show: false, heading: "", body: "" })
        // navigate("/main/event/list");
        navigate(-1);
    }

    return (
        <SiteLayout>
            <MessageModal modalConfig={msgModalConfig}
                handleModalClose={handleModalClose} />

            <div id="screenTitle" className="flex-container card-deck protest-riot-regular-lg">
               <span className="text-dark">New Calculation:</span><span className="text-success">{eventData.eventName}</span>
            </div>            
            <MessageAlert alertConfig={alertConfig}  />
   
            <ProgressBar className="fs-4 my-4" style={{height:"2rem"}} 
                now={(allSteps.indexOf(step)+1)/allSteps.length*100} 
                label={`${Math.round((allSteps.indexOf(step)+1)/allSteps.length*100)}%`} />

            {step === "1" &&
                <CalculationStep1 formData={formData} setFormData={setFormData} prev={prev} next={next}/>
            }
            {step === "1a" &&
                <CalculationStep1a formData={formData} setFormData={setFormData} prev={prev} next={next} expenseData={expenseData} />
            }
            {step === "2" &&
                <CalculationStep2 formData={formData} setFormData={setFormData} prev={prev} next={next} />           
            }
            {step === "2a" &&
                <CalculationStep2a formData={formData} setFormData={setFormData} prev={prev} next={next} 
                                expenseData={expenseData} splitCostLogic={splitCostEvenly} />          
            }
            {step === "3" &&
                <CalculationStep3 formData={formData} setFormData={setFormData} prev={prev} next={next} currency={currencyMaster} />          
            }            
            {step === "4" &&
                <CalculationStep4 formData={formData} setFormData={setFormData} prev={prev} next={next} /> 
            }
            {step === "4a" &&
                <CalculationStep4a formData={formData} setFormData={setFormData} prev={prev} next={next} currency={currencyMaster} /> 
            }            
            {step === "5" &&
                <CalculationStep5 formData={formData} prev={prev} submitForm={submitForm}  expenseData={expenseData} /> 
            }

        </SiteLayout>
    )
}

export default AddCalculation;
