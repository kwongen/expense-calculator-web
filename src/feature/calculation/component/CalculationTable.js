import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

import TooltipOverlay from "../../../component/TooltipOverlay";

import "./CalculationTable.css"

const CalculationTable = ( {calculationData, viewCalculation, deleteCalculation} ) => {

    const getFriendList = (expensesInvolved) => {
        let friendList = [];
        
        expensesInvolved.forEach((expense) => {
            friendList = expense.costSplit.reduce((accu, item) => accu.concat(item.friendId.friendName), friendList)
        })

        friendList = [...new Set(friendList)];
        friendList.sort();

        return friendList
    }

    return (
        <table role="table" className="calc-table w-100 border mt-2">
            <thead role="rowgroup" className="visible-row">
                <tr role="row">
                    <th role="columnheader">Calculation Date</th>
                    <th role="columnheader">Included Expenses:</th>
                    <th role="columnheader">Total Amount:</th>
                    <th role="columnheader"># of people</th>
                    <th role="columnheader" className="text-center">Actions</th>
                </tr>
            </thead>
            <tbody role="rowgroup">
                {calculationData && calculationData.map((calc, index) => {
                    return (
                        <tr key={`row_${index}`} role="row">
                            <td key={`col_${index}_1`} role="cell"><strong className="hidden-col"><span className="calc-item-heading">Calculation Date:</span></strong>{calc.createdAt.slice(0, 10)}</td>
                            <td key={`col_${index}_2`} role="cell"><strong className="hidden-col"><span className="calc-item-heading">Included Expenses:</span></strong>{calc.expensesInvolved.length}</td>
                            <td key={`col_${index}_3`} role="cell"><strong className="hidden-col"><span className="calc-item-heading">Total Amount:</span></strong>{`${calc.calculationCCY.symbol}${calc.calculationResult.totalAmt.$numberDecimal}`}</td>
                            <td key={`col_${index}_4`} role="cell"><strong className="hidden-col"><span className="calc-item-heading"># of people:</span></strong>                  
                                <TooltipOverlay key={`tip-${index}`} id={`tip-${index}`} title={getFriendList(calc.expensesInvolved).join(", ")}>
                                    <Badge  key={`badge_${index}`} bg="warning" className="fs-6" pill>{calc.calculationResult.numFriendsInvolved}</Badge>
                                </TooltipOverlay> 
                            </td>
                            <td key={`col_${index}_5`} role="cell">
                                <Button key={`btn_${index}_view`}  size="sm"
                                    className="calc-button"
                                    onClick={() => viewCalculation(index)}
                                    variant="outline-success">View</Button>{' '}
                                <Button  key={`btn_${index}_delete`} size="sm"
                                    className="calc-button"
                                    onClick={() => deleteCalculation(index)}
                                    variant="outline-danger">Delete</Button>{' '}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
            {calculationData && ((calculationData.length === 0) ? 
                <tfoot><tr><th>No calculation record</th></tr></tfoot> : "")}
        </table>        
    )
}

export default CalculationTable;