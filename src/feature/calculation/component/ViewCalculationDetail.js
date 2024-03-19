import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Stack from "react-bootstrap/Stack";
import { Link45deg } from "react-bootstrap-icons";

import TooltipOverlay from "../../../component/TooltipOverlay";

const ViewCalculationDetail = ({eventData, calculationData}) => {
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

    const getConvertedAmountStr = (localAmount, localCCY) => {
        if(calculationData.calculationExRate && calculationData.calculationExRate[localCCY])
            return `> ${calculationData.calculationCCY.symbol}${Number(Number(localAmount)/calculationData.calculationExRate[localCCY]).toFixed(2)}`;

        return "";
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
                <Col xs={12} lg={3} className="mb-1">Expense Involved & breakdown:</Col>
                <Col xs={12} lg={9} className="text-success">
                    <Accordion defaultActiveKey={[0, 1, 2]} alwaysOpen className="show">
                        {calculationData?.expensesInvolved && 
                            calculationData.expensesInvolved.map((exp, index) => {
                            
                            return (
                                <Accordion.Item key={`${exp.expense._id}`} eventKey={index}>
                                    <Accordion.Header key={`header_${index}`}>{`${exp.expense.expenseDate.slice(0,10)} / ${exp.expenseCCY.symbol}${exp.expenseAmt.$numberDecimal} ${getConvertedAmountStr(exp.expenseAmt.$numberDecimal,exp.expenseCCY._id)} / ${convertExpenseType(exp.expense.expenseType)} / paid by ${exp.paidBy.friendName}`}</Accordion.Header>
                                    <Accordion.Body key={`body_${index}`} className="fs-6">
                                        {
                                            exp.costSplit.map((f) => {
                                                return (
                                                    <Row key={`row${index}_${f.friendId.friendId}`} className="my-2">
                                                        <Col key={`col_1_${index}_${f.friendId.friendId}`} xs={12} lg={3}>{f.friendId.friendName} ({f.friendId.parentName}) :</Col>
                                                        <Col key={`col_2_${index}_${f.friendId.friendId}`} xs={12} lg={9}>{exp.expenseCCY.symbol}{f.amount.$numberDecimal} {getConvertedAmountStr(f.amount.$numberDecimal, exp.expenseCCY._id)} </Col>
                                                    </Row>
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
            <Row className="my-2">
                <Col xs={12} lg={3} className="mb-1">Calculation Result w/o Simplify:</Col>
                <Col xs={12} lg={9} className="text-success">
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
                                                        <TooltipOverlay key={`tip_${index}_${debtorId}`} id={`tip`} titleStyle="text-start" title={"<center><u>Payment Info</u></center>" + getPaymentLinkContent(creditor, debtor).replaceAll("\n","<br/>") + "<br/><br/><i><center>(click to copy above text)<center></i>"}>
                                                            <Link45deg className="copy-payment" size="20" 
                                                                onClick={() => copyPaymentLink(creditor, debtor)} />
                                                        </TooltipOverlay>
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