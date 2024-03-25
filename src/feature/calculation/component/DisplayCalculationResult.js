import Accordion from "react-bootstrap/Accordion";
import Stack from "react-bootstrap/Stack";

import { Link45deg } from "react-bootstrap-icons";

import TooltipOverlay from "../../../component/TooltipOverlay";
import { useAuthContext } from "../../../context/AuthContext"

const DisplayCalculationResult = ({calculationData, eventData, resutlType="direct"}) => {
    const { userProfile } = useAuthContext();

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

        if(calculationData.shareCode)
            content += `\n\nYou can also click this link to view calculation details: https://www.expensecalculator.co.uk/share/calc-result/${calculationData.event}/${calculationData._id}/${calculationData.shareCode}`

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
                            </Accordion.Body>
                        </Accordion.Item>
                    )
                })}
        </Accordion>          
    )
}

export default DisplayCalculationResult;