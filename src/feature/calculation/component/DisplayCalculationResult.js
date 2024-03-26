import { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

import { Link45deg } from "react-bootstrap-icons";

import TooltipOverlay from "../../../component/TooltipOverlay";
import { useAuthContext } from "../../../context/AuthContext"
import { extendShareCodeApi } from "../../../api/CalculationApi"
import MessageModal from "../../../component/MessageModal";

const DisplayCalculationResult = ({calculationData, setCalculationData, eventData, resutlType="direct"}) => {
    const { userProfile } = useAuthContext();
    const [msgModalConfig, setMsgModalConfig] = useState({show:false, heading:"", body:""});

    const resultData = (resutlType==="direct") ? calculationData.calculationResult.directResult : calculationData.calculationResult.simplifiedResult;

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

    const getPaymentInfoContent = (creditor) => {
        const [creditorName, creditorId] = creditor.split("_");
        const totalAmtStr = `${calculationData.calculationCCY.symbol}${calculationData.calculationResult.totalAmt.$numberDecimal}`;

        let content = `${eventData.eventName}\n`
        content += `Total amount: ${totalAmtStr}\n`
        content += `No. of people: ${calculationData.calculationResult.numFriendsInvolved}\n\n`
        Object.keys(calculationData.calculationResult.directResult[creditor]).map((debtor) => {
            const [debtorName, debtorId] = debtor.split("_");

            content += `${debtorName} (x${countMembers(calculationData.expensesInvolved, debtorId)}) : ${calculationData.calculationCCY.symbol}${calculationData.calculationResult.directResult[creditor][debtor]}\n`
        });

        if(userProfile.bankAccountInfo)
            content += `\nBelow is ${creditorName}'s bank account information:\n${userProfile.bankAccountInfo}`;

        if (calculationData.shareCode && calculationData.shareCodeExpiry && new Date(calculationData.shareCodeExpiry) >= new Date())
            content += `\n\nYou can also click this link to view calculation details: ${getShareResultLink()}`

        return content;
    }

    const copyPaymentInfo = async (creditor) => {
        try {
            await navigator.clipboard.writeText(getPaymentInfoContent(creditor));
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    const getShareResultLink = () => {
        return`${process.env.REACT_APP_SITE_URL}/result/${calculationData.event}/${calculationData._id}/${calculationData.shareCode}`
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
 
        if (calculationData.shareCode && calculationData.shareCodeExpiry && new Date(calculationData.shareCodeExpiry) >= new Date())
            content += `\n\nYou can also click this link to view calculation details: ${getShareResultLink()}`
                            
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

    const extendShareCodeExpiry = async () => {
        const result = await extendShareCodeApi(userProfile, calculationData._id);

        if( result.error ) {
            setMsgModalConfig({show:true, heading:"Error", body:"Failed to extend security code!"})
        } else {
            setMsgModalConfig({show:true, heading:"Success", body:"Successfully extend the security code"})
            setCalculationData({...calculationData, shareCodeExpiry:result.shareCodeExpiry, shareCode:result.shareCode})
        }
    }

    return (
        <>
        <MessageModal modalConfig={msgModalConfig}
            handleModalClose={() => setMsgModalConfig({ show: false, heading: "", body: "" })} />
        <Accordion defaultActiveKey={Array.from(Array(Object.keys(resultData).length).keys())} alwaysOpen className="show">
            {resultData && Object.keys(resultData).map((creditor, index) => {
                    const [creditorName, creditorId] = creditor.split("_");

                    return (
                        <Accordion.Item key={`${creditor}`} eventKey={index}>
                            <Accordion.Header key={`header_${index}`}>{`People owe "${creditorName}" money`}</Accordion.Header>
                            <Accordion.Body key={`body_${index}`} className="fs-6">
                                {
                                    resultData && Object.keys(resultData[creditor]).map((debtor) => {
                                        const [debtorName, debtorId] = debtor.split("_");

                                        return (
                                            <Stack key={`stack_${index}_${debtorId}`} direction="horizontal" gap={3}>
                                                <div key={`div_1_${index}_${debtorId}`} className="mb-1" style={{ width: "9rem", height: "2rem" }}>
                                                    {resutlType==="simplified" && creditorId === userProfile?.myFriendId &&
                                                        <TooltipOverlay key={`tip_${index}_${debtorId}`} id={`tip`} titleStyle="text-start" title={"<center><u>Payment Info</u></center>" + getPaymentLinkContent(creditor, debtor).replaceAll("\n", "<br/>") + "<br/><br/><i><center>(click to copy above text)<center></i>"}>
                                                            <Link45deg className="copy-payment" size="20"
                                                                onClick={() => copyPaymentLink(creditor, debtor)} />
                                                        </TooltipOverlay>
                                                    }
                                                    {debtorName} (x{countMembers(calculationData.expensesInvolved, debtorId)})
                                                </div>
                                                <div key={`div_2_${index}_${debtorId}`} className="mb-1" style={{ height: "2rem" }}>:</div>
                                                <div key={`div_3_${index}_${debtorId}`} className="mb-1" style={{ width: "3rem", height: "2rem" }}>{calculationData.calculationCCY.symbol}{resultData[creditor][debtor]}</div>
                                            </Stack>
                                        )
                                    })
                                }
                                {
                                    resutlType==="simplified" && creditorId === userProfile?.myFriendId &&
                                    <TooltipOverlay key={`tip_paymentInfo_${creditorId}`} id={`tip`} titleStyle="text-start" title={"<center><u>Payment Info</u></center>" + getPaymentInfoContent(creditor).replaceAll("\n", "<br/>") + "<br/><br/><i><center>(click to copy above text)<center></i>"}>
                                        <Button key={`btn_paymentInfo_${creditorId}`}  
                                                    variant="outline-success"
                                                    onClick={() => copyPaymentInfo(creditor)}>Copy Payment Information</Button>
                                    </TooltipOverlay>
                                }
                                {
                                    resutlType==="simplified" && creditorId === userProfile?.myFriendId 
                                        && calculationData?.shareCodeExpiry 
                                        && new Date(calculationData.shareCodeExpiry) > new Date() &&
                                    <div className="mt-2 text-danger">
                                        <i>
                                        Note: the security code to view calculation result will be expired in {calculationData.shareCodeExpiry.slice(0,10)}.
                                        You can <Link to={getShareResultLink()} target="_blank" rel="noopener noreferrer">click here</Link> to view the shared page.
                                        </i>
                                    </div>
                                }
                                {
                                    resutlType==="simplified" 
                                        && creditorId === userProfile?.myFriendId 
                                        && (calculationData?.shareCodeExpiry===undefined || 
                                            (calculationData?.shareCodeExpiry && new Date(calculationData.shareCodeExpiry) <= new Date()))
                                        &&
                                    <div className="mt-2 text-danger">
                                        <i>
                                        Note: the security code to view calculation result has expired.
                                        You can <Link onClick={extendShareCodeExpiry}>click here</Link> to extend the expiration date for 1 week.
                                        </i>
                                    </div>
                                }
                            </Accordion.Body>
                        </Accordion.Item>
                    )
                })}
        </Accordion>    
        </>      
    )
}

export default DisplayCalculationResult;