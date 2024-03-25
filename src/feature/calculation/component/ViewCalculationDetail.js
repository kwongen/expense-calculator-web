import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Stack from "react-bootstrap/Stack";
import Table from "react-bootstrap/Table";

import { Link45deg } from "react-bootstrap-icons";

import TooltipOverlay from "../../../component/TooltipOverlay";

const ViewCalculationDetail = ({eventData, calculationData}) => {
    console.log(calculationData)
    const getFriendList = (expensesInvolved) => {
        let friendList = [];
        
        expensesInvolved && expensesInvolved.forEach((expense) => {
            friendList = expense.costSplit.reduce((accu, item) => accu.concat(item.friendId.friendName), friendList)
        })

        friendList = [...new Set(friendList)];
        friendList.sort();

        return friendList
    }

    const countMembers = (expensesInvolved, parentId) => {
        let memberList = [];
        
        expensesInvolved && expensesInvolved.forEach((expense) => {
            expense.costSplit.forEach((split) => {
                if(memberList.indexOf(split.friendId.friendId) < 0 && split.friendId.parentId === parentId) {
                    memberList.push(split.friendId.friendId)
                }
            })
        })

        return memberList.length;
    }

    const getPaymentLinkContent = (creditor, targetDebtor) => {
        const [creditorName, creditorId] = creditor.split("_");
        const totalAmtStr = `${calculationData.calculationCCY.symbol}${calculationData.calculationResult.totalAmt.$numberDecimal}`;
        let targetDebtorAmt = 0;

        let content = `${eventData.eventName}\n`
        content += `Total amount: ${totalAmtStr}\n`
        content += `No. of people: ${calculationData.calculationResult.numFriendsInvolved}\n\n`
        Object.keys(calculationData.calculationResult.directResult[creditor]).map((debtor) => {
            const [debtorName, debtorId] = debtor.split("_");
            if(targetDebtor === debtor)
                targetDebtorAmt = calculationData.calculationResult.directResult[creditor][debtor];

            content += `${debtorName} (x${countMembers(calculationData.expensesInvolved, debtorId)}) : ${calculationData.calculationCCY.symbol}${calculationData.calculationResult.directResult[creditor][debtor]}\n`
        });

        content += `\n${creditorName} asked for ${calculationData.calculationCCY.symbol}${targetDebtorAmt}. Pay in seconds, with no set up or details needed. https://settleup.starlingbank.com/kamkanerickwong?amount=${targetDebtorAmt}&message=${encodeURI(eventData.eventName)}`

        return content;
    }

    const copyPaymentLink = async (creditor, targetDebtor) => {
        try {
            await navigator.clipboard.writeText(getPaymentLinkContent(creditor, targetDebtor));
            // console.log('Content copied to clipboard');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    const convertExpenseType = (expenseTypeCode) => {
        return expenseTypeCode.substring(3).replaceAll("_", " ");
    }

    const getConvertedAmount = (localAmount, localCCY) => {
        if(calculationData.calculationExRate && calculationData.calculationExRate[localCCY])
            return Number(Number(localAmount)/calculationData.calculationExRate[localCCY]);

        return Number(localAmount);
    }

    const getConvertedAmountStr = (localAmount, localCCY) => {
        if(calculationData.calculationExRate && calculationData.calculationExRate[localCCY])
            return `> ${calculationData.calculationCCY.symbol}${Number(Number(localAmount)/calculationData.calculationExRate[localCCY]).toFixed(2)}`;

        return "";
    }

    const getParentListAllExpenses = (expensesInvolved = []) => {
        let parentList = [];

        expensesInvolved.forEach((exp) => {
            exp.costSplit.forEach((f) => {
                if(!parentList.find(e => e.parentId === f.friendId.parentId)) {
                    parentList.push({parentId: f.friendId.parentId, parentName: f.friendId.parentName});
                }
            })
        })

        parentList.sort((a,b) => a.parentName.localeCompare(b.parentName));

        return parentList;        
    }

    return (
        <Container className="border rounded h5">    
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1">Calculation Currency:</Col>
                <Col xs={12} lg={9} className="text-success">{calculationData?.calculationCCY?.value}  </Col>
            </Row>
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1">Calculation Exchange Rate :</Col>
                <Col xs={12} lg={9} className="text-success">
                    {calculationData.calculationExRate && Object.entries(calculationData.calculationExRate)
                        .map((item) => <div dangerouslySetInnerHTML={{ __html: item[0] + " : " + item[1] + "</br>" }} />)}
                    {(!calculationData.calculationExRate || Object.entries(calculationData.calculationExRate).length <= 0 ) ? <div>N/A</div> : ""}
                </Col>
            </Row>
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1">Total amount:</Col>
                <Col xs={12} lg={9} className="text-success">{calculationData?.calculationCCY?.symbol}{calculationData?.calculationResult?.totalAmt?.$numberDecimal}</Col>
            </Row>
            <Row className="my-2">
                <Col xs={12} lg={12} className="mb-1">Expense Involved & breakdown:</Col>
                <Col xs={12} lg={12} className="text-success">
                    {
                        getParentListAllExpenses(calculationData?.expensesInvolved).map((p) => {
                            let total = 0;
                            return (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th colSpan="2" className="bg-secondary text-light fs-6">Group under {p.parentName}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        calculationData.expensesInvolved.map((exp) => {
                                            if(exp.costSplit.find(f => f.friendId.parentId===p.parentId)) {
                                                const debtList =  exp.costSplit.filter((f) => f.friendId.parentId === p.parentId);
                                                let subtotal = 0;

                                                return (
                                                    <>
                                                    <tr>
                                                        <td colSpan="2" className="text-dark fs-6"><i>Expense on  
                                                            {` ${exp.expense.expenseDate.slice(0,10)} / 
                                                            ${convertExpenseType(exp.expense.expenseType)} / 
                                                            paid by ${exp.paidBy.friendName} /
                                                            ${exp.expenseCCY.symbol}${exp.expenseAmt.$numberDecimal} ${getConvertedAmountStr(exp.expenseAmt.$numberDecimal,exp.expenseCCY._id)} 
                                                            `}
                                                            </i>
                                                        </td>
                                                    </tr>
                                                    { 
                                                        debtList.map((f,index) => {
                                                            subtotal += Number(f.amount.$numberDecimal);
                                                            total += getConvertedAmount(f.amount.$numberDecimal, exp.expenseCCY._id);
                                                            return (
                                                                <tr key={`row${index}_${f.friendId.friendId}`}>
                                                                    <td key={`col_1_${index}_${f.friendId.friendId}`} style={{width:"9rem"}} className="fs-6">{f.friendId.friendName}</td>
                                                                    <td key={`col_2_${index}_${f.friendId.friendId}`} className="fs-6">{exp.expenseCCY.symbol}{f.amount.$numberDecimal} {getConvertedAmountStr(f.amount.$numberDecimal, exp.expenseCCY._id)}</td>
                                                                </tr>
                                                            )
                                                        })  
                                                    } 
                                                    <tr>
                                                        <td className="text-dark text-end fs-6"><i><b>Subtotal:</b></i></td>
                                                        <td className="text-dark fs-6"><i><b>{exp.expenseCCY.symbol}{subtotal} {getConvertedAmountStr(subtotal, exp.expenseCCY._id)} </b></i></td>
                                                    </tr>
                                                    </>
                                                )
                                            }
                                        })
                                    }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td className="bg-secondary text-light text-end fs-6"><b>Total:</b></td>
                                            <td className="bg-secondary text-light fs-6"><b>{calculationData.calculationCCY.symbol}{Math.round(total*100)/100}</b></td>
                                        </tr>
                                    </tfoot>
                                </Table>
                            )
                        })
                    }
                </Col>
            </Row>                               
            <Row className="my-2">
                <Col xs={12} lg={12} className="mb-1">Calculation Result w/o Simplify:</Col>
                <Col xs={12} lg={12} className="text-success">
                    <Accordion defaultActiveKey={[0, 1, 2]} alwaysOpen className="show">
                        {calculationData?.calculationResult && 
                            Object.keys(calculationData?.calculationResult?.directResult).map((creditor, index) => {
                            
                            const [creditorName, creditorId] = creditor.split("_");

                            return (
                                <Accordion.Item key={`${creditor}`} eventKey={index}>
                                    <Accordion.Header key={`header_${index}`}>{`People owe "${creditorName}" money`}</Accordion.Header>
                                    <Accordion.Body key={`body_${index}`} className="fs-6">
                                        {
                                          Object.keys(calculationData?.calculationResult?.directResult[creditor]).map((debtor) => {
                                            const [debtorName, debtorId] = debtor.split("_");

                                            return (
                                                <Stack key={`stack_${index}_${debtorId}`} direction="horizontal" gap={3}>
                                                    <div key={`div_1_${index}_${debtorId}`}  className="mb-1" style={{width:"9rem", height:"2rem"}}>
                                                        {debtorName} (x{countMembers(calculationData?.expensesInvolved, debtorId)})
                                                    </div>
                                                    <div key={`div_2_${index}_${debtorId}`} className="mb-1" style={{height:"2rem"}}>:</div>
                                                    <div key={`div_3_${index}_${debtorId}`} className="mb-1" style={{width:"3rem", height:"2rem"}}>{calculationData?.calculationCCY?.symbol}{calculationData?.calculationResult?.directResult[creditor][debtor]}</div>
                                                </Stack>
                                            )
                                          })  
                                        }
                                    </Accordion.Body>
                                </Accordion.Item>
                            )
                        })}
                    </Accordion>                    
                </Col>
            </Row>
        </Container>   
    )
}

export default ViewCalculationDetail;