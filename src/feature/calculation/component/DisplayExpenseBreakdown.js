import Table from "react-bootstrap/Table";

const DisplayExpenseBreakdown = ({calculationData}) => {
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
            return `(${calculationData.calculationCCY.symbol}${Number(Number(localAmount)/calculationData.calculationExRate[localCCY]).toFixed(2)})`;

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
        getParentListAllExpenses(calculationData.expensesInvolved).map((p) => {
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
                                        <td colSpan="2" className="text-success fs-6"><i>Expense on  
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
    )
}

export default DisplayExpenseBreakdown;