import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import ToggleButton from "react-bootstrap/ToggleButton";

import { useAuthContext } from "../../../context/AuthContext";
import { expenseSchema } from "../../../schema/ValidationSchema";
import { getExpenseMasterDataApi } from "../../../api/ExpenseApi";

function ExpenseForm ({expenseFormData, setExpenseFormData, setAlertConfig, saveToDB, cancelAction}) {
    const [masterData, setMasterData] = useState([]);
    const [validated, setValidated] = useState(false);
    const { userProfile } = useAuthContext();

    useEffect( () => {
        fetchData();
    }, []);
 
    const fetchData = (async () => {   
        const data = await getExpenseMasterDataApi(userProfile);

        if( data.error ) {
            setAlertConfig({show:true, heading:"Failed to load expense master data:", body: data.error})
        } else {
            setMasterData(data);
        }
    });

    const selectFriend = (index) => {
        expenseFormData.whoInvolved[index].checked=!expenseFormData.whoInvolved[index].checked;
        const _expenseFormData = {...expenseFormData};
        setExpenseFormData(_expenseFormData);

        const countSelect = expenseFormData.whoInvolved.filter((f) => f.checked).length;
        const toggleBtn = document.getElementById("toggleFriendSelectionBtn");
        toggleBtn.innerText = countSelect==0?"Select All":"Clear All";
    }

    const toggleAllFriendsSelection = (event) => {        
        if(event.target.innerText === "Select All") {
            event.target.innerText = "Clear All"
            for(let i=0; i<expenseFormData.whoInvolved.length; i++) {
                expenseFormData.whoInvolved[i].checked=true;
            }
        } else {
            event.target.innerText = "Select All"
            for(let i=0; i<expenseFormData.whoInvolved.length; i++) {
                expenseFormData.whoInvolved[i].checked=false;
            }                   
        }

        setExpenseFormData({...expenseFormData});
    }

    const onChange = (event) => {
        expenseFormData[event.currentTarget.name] = event.currentTarget.value;
        setExpenseFormData({...expenseFormData})
    }

    const onBlur_Amount = (event) => {
        if(event.currentTarget.value !== "") {
            expenseFormData.expenseAmt = Number(event.currentTarget.value).toFixed(2)
            setExpenseFormData({...expenseFormData})
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);

        const dataForSubmit = {...expenseFormData};
console.log(dataForSubmit)
        // only provided selected friedId for submission
        dataForSubmit.whoInvolved = dataForSubmit
                                    .whoInvolved
                                    .reduce((acc, f) => {
                                                        if(f.checked)
                                                            acc.push(f.friendId)
                                                        return acc;
                                                        }, []);

        dataForSubmit.expenseAmt = Number(dataForSubmit.expenseAmt).toFixed(2);

        let gotError = false;
        let errorList = [];
        await expenseSchema
                .validate(dataForSubmit, { abortEarly: false })
                .catch((err) => {
                    gotError = true;
                    setValidated(true);
                    if(err.name === "ValidationError") {
                        errorList = errorList.concat(err.errors);
                    } else {
                        errorList.push(err.message)
                    }
                });

        if((new Date(dataForSubmit.expenseDate)) > (new Date())) {
            gotError = true;
            errorList.push("Expense data cannot be a future date")
        }

        if(dataForSubmit.whoInvolved.length === 0) {
            gotError = true;
            errorList.push("No friend has selected for this expense.")
        }
        
        if(gotError) {
            errorList = Array.from(new Set(errorList));
            errorList = errorList.map((item) => "<li>" + item + "</li>")
            const errorStr = "<ul>" + errorList.toString().replaceAll(",","") + "</ul>";
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setAlertConfig({show:true, heading:"Error found:", body:errorStr})
        } else {
            setAlertConfig({show:false, heading:"", body:""});
            saveToDB(dataForSubmit);
        }
    }

    return (
        <>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mt-3">
                    <Col xs={12} md={4}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="paid-by" className="event-form-label">Paid by</InputGroup.Text>
                            <Form.Select aria-label="paidBy" 
                                name="paidBy" 
                                value={expenseFormData.paidBy}
                                required
                                onChange={onChange}>
                                <option value="">Who paid this expense</option>
                                {expenseFormData.whoInvolved && expenseFormData.whoInvolved.map((friend) => <option key={friend.friendId} value={friend.friendId}>{friend.friendName}</option>)}
                            </Form.Select>
                        </InputGroup>
                    </Col>
                    <Col xs={12} md={4}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="expense-type" className="event-form-label">Expense Type</InputGroup.Text>
                            <Form.Select aria-label="expenseType" 
                                name="expenseType"                                
                                required
                                value={expenseFormData.expenseType}
                                onChange={onChange}>
                                <option value="">Expense Type</option>
                                {masterData.expenseType && 
                                masterData.expenseType.map((item) => 
                                        <option key={item._id} value={item._id}>{item.value}</option>)}
                            </Form.Select>
                        </InputGroup>   
                    </Col>
                    <Col xs={12} md={4}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="expense-date" className="event-form-label">Expense Date</InputGroup.Text>
                            <Form.Control
                                type="date"
                                name="expenseDate" 
                                value={expenseFormData.expenseDate}                               
                                placeholder="Expense Date"
                                aria-label="expenseDate"
                                onChange={onChange}
                                required
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <Row> 
                    <Col xs={12} md={4}>
                        <InputGroup className="mb-3">
                            <Form.Select aria-label="expenseCCY" 
                                name="expenseCCY"   
                                value={expenseFormData.expenseCCY}                              
                                required
                                className="ccy-select-box"
                                onChange={onChange}>
                                <option value="">CCY</option>
                                {masterData.currency && 
                                masterData.currency.map((item) => 
                                        <option key={item._id} value={item._id}>{item.value} ({item.symbol})</option>)}
                            </Form.Select>
                            <Form.Control aria-label="expenseAmt" type="number"
                                name="expenseAmt"
                                value={expenseFormData.expenseAmt}  
                                placeholder="Amount"                               
                                required
                                onChange={onChange} 
                                onBlur={onBlur_Amount}
                            />
                        </InputGroup>   
                    </Col>        
                    <Col xs={12} md={8}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="expense-desc" className="event-form-label">Description</InputGroup.Text>
                            <Form.Control aria-label="expenseDesc" 
                                name="expenseDesc" 
                                value={expenseFormData.expenseDesc}  
                                placeholder="Short description"
                                onChange={onChange} 
                            />
                        </InputGroup>   
                    </Col>                                  
                </Row>
                <Row>
                    <Col xs={12}>
                        <Stack direction="horizontal" className="border rounded bg-secondary mb-2" gap="3">
                            <div className="p-2 text-light fs-5 font-weight-bold">Who invovled in this expense</div>
                        </Stack>
                    </Col>                       
                </Row>
                <Row>
                    <Col>
                        <Button id="toggleFriendSelectionBtn" variant="warning" size="md" className="event-form-button m-1" 
                                    onClick={toggleAllFriendsSelection}>Select All</Button>                  
                        { expenseFormData.whoInvolved && expenseFormData.whoInvolved.map( (friend, index) => {
                                 return(
                                    <ToggleButton key={friend.friendId}
                                        id={friend.friendId}
                                        type="checkbox" 
                                        checked={friend.checked} 
                                        variant='outline-success' 
                                        className="event-form-button m-1"
                                        onClick={() => selectFriend(index)}>
                                    {friend.friendName}
                                    </ToggleButton>
                                )
                        })}                                   
                    </Col>
                </Row>         
                <Row className="my-4">
                    <Col xs={12} sm={6} className="mt-2">
                        <Button variant="success" 
                            type="submit" 
                            size="lg" 
                            style={{ width: "100%" }}
                            className="ms-auto">Save Expense</Button>
                    </Col>
                    <Col xs={12} sm={6} className="mt-2">
                        <Button variant="outline-danger" 
                            size="lg" 
                            style={{ width: "100%" }}
                            onClick={cancelAction}
                            className="ms-auto">Cancel</Button>
                    </Col>      
                </Row>    
            </Form>
        </>
    )
}

export default ExpenseForm;