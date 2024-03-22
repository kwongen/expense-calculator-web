import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
import { Link45deg } from "react-bootstrap-icons";

import TooltipOverlay from "../../../component/TooltipOverlay";
import { useAuthContext } from "../../../context/AuthContext"

const ViewCalculationSummary = ({eventData, calculationData}) => {
    const { userProfile } = useAuthContext();

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
        let targetDebtorName = "";

        let content = `${eventData.eventName}\n`
        content += `Total amount: ${totalAmtStr}\n`
        content += `No. of people: ${calculationData.calculationResult.numFriendsInvolved}\n\n`
        Object.keys(calculationData.calculationResult.simplifiedResult[creditor]).map((debtor) => {
            const [debtorName, debtorId] = debtor.split("_");
            if(targetDebtor === debtor) {
                targetDebtorAmt = calculationData.calculationResult.simplifiedResult[creditor][debtor];
                targetDebtorName = debtorName;
            }

            content += `${debtorName} (x${countMembers(calculationData.expensesInvolved, debtorId)}) : ${calculationData.calculationCCY.symbol}${calculationData.calculationResult.simplifiedResult[creditor][debtor]}\n`
        });

        content += "\n" + userProfile.paymentLinkTemplate.replaceAll("#creditor#", creditorName)
                                        .replaceAll("#debtor#",targetDebtorName)
                                        .replaceAll("#ccy#",calculationData.calculationCCY.symbol)
                                        .replaceAll("#amount#",targetDebtorAmt)
                                        .replaceAll("#event_name#",encodeURI(eventData.eventName));
                                      
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

    return (
        <Container className="border rounded h5">
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1">Calculation Date:</Col>
                <Col xs={12} lg={9} className="text-success">{calculationData?.createdAt?.slice(0,10)} at {calculationData?.createdAt?.split("T")[1]?.split(".")[0]}</Col>
            </Row>            
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1">Expense Item Option:</Col>
                <Col xs={12} lg={9} className="text-success">{calculationData?.calculationOptions?.expenseSelectionOption}</Col>
            </Row>
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1">Split Cost Option:</Col>
                <Col xs={12} lg={9} className="text-success">{calculationData?.calculationOptions?.splitCostOption} </Col>
            </Row>
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1">Exchange Rate Option: </Col>
                <Col xs={12} lg={9} className="text-success">{calculationData?.calculationOptions?.exRateOption} </Col>
            </Row>
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
            <Row className="my-2 border-bottom">
                <Col xs={12} lg={3} className="mb-1"># of people:</Col>
                <Col xs={12} lg={9} className="text-success">
                    <TooltipOverlay key={`tip`} id={`tip`} title={getFriendList(calculationData?.expensesInvolved).join(", ")}>
                        <Badge  key={`badge`} bg="warning" className="fs-6" pill>{calculationData?.calculationResult?.numFriendsInvolved}</Badge>
                    </TooltipOverlay> 
                </Col>
            </Row>                            
            <Row className="my-2">
                <Col xs={12} lg={3} className="mb-1">Calculation Result:</Col>
                <Col xs={12} lg={9} className="text-success">
                    <Accordion defaultActiveKey={[0, 1, 2]} alwaysOpen className="show">
                        {calculationData?.calculationResult && 
                            Object.keys(calculationData?.calculationResult?.simplifiedResult).map((creditor, index) => {
                            
                            const [creditorName, creditorId] = creditor.split("_");

                            return (
                                <Accordion.Item key={`${creditor}`} eventKey={index}>
                                    <Accordion.Header key={`header_${index}`}>{`People owe "${creditorName}" money`}</Accordion.Header>
                                    <Accordion.Body key={`body_${index}`} className="fs-6">
                                        {
                                          Object.keys(calculationData?.calculationResult?.simplifiedResult[creditor]).map((debtor) => {
                                            const [debtorName, debtorId] = debtor.split("_");

                                            return (
                                                <Stack key={`stack_${index}_${debtorId}`} direction="horizontal" gap={3}>
                                                    <div key={`div_1_${index}_${debtorId}`}  className="mb-1" style={{width:"9rem", height:"2rem"}}>
                                                        {creditorId === userProfile?.myFriendId &&
                                                        <TooltipOverlay key={`tip_${index}_${debtorId}`} id={`tip`} titleStyle="text-start" title={"<center><u>Payment Info</u></center>" + getPaymentLinkContent(creditor, debtor).replaceAll("\n","<br/>") + "<br/><br/><i><center>(click to copy above text)<center></i>"}>
                                                            <Link45deg className="copy-payment" size="20" 
                                                                onClick={() => copyPaymentLink(creditor, debtor)} />
                                                        </TooltipOverlay>
                                                        }
                                                        {debtorName} (x{countMembers(calculationData?.expensesInvolved, debtorId)})
                                                    </div>
                                                    <div key={`div_2_${index}_${debtorId}`} className="mb-1" style={{height:"2rem"}}>:</div>
                                                    <div key={`div_3_${index}_${debtorId}`} className="mb-1" style={{width:"3rem", height:"2rem"}}>{calculationData?.calculationCCY?.symbol}{calculationData?.calculationResult?.simplifiedResult[creditor][debtor]}</div>
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

export default ViewCalculationSummary;