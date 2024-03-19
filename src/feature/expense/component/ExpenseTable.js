import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

import TooltipOverlay from "../../../component/TooltipOverlay";

import "./ExpenseTable.css"

const ExpenseTable = ({expenseData, editExpense, deleteExpense}) => {
    return (
        <table key="expenseTable" role="table" className="expense-table w-100 border mt-2">
            <thead key="expenseTableHead" role="rowgroup" className="visible-row">
                <tr key="expenseTableHeadRow1" role="row">
                    <th key="expenseTableHeadCol1" role="columnheader">Date</th>
                    <th key="expenseTableHeadCol2" role="columnheader">Type</th>
                    <th key="expenseTableHeadCol3" role="columnheader">Amount</th>
                    <th key="expenseTableHeadCol4" role="columnheader">Paid by</th>
                    <th key="expenseTableHeadCol5" role="columnheader"># of people</th>
                    <th key="expenseTableHeadCol6" role="columnheader">More Info</th>
                    <th key="expenseTableHeadCol7" role="columnheader">Calculated?</th>
                    <th key="expenseTableHeadCol8" role="columnheader" className="text-center">Actions</th>
                </tr>
            </thead>
            <tbody key="expenseTableBody" role="rowgroup">
                {expenseData && expenseData.map((exp, index) => {
                    return (
                        <tr key={`bodyRow_${index}`} role="row">
                            <td key={`bodyCol_${index}_1`} role="cell"><strong className="hidden-col"><span className="expense-item-heading">Date:</span></strong>{exp.expenseDate.slice(0, 10)}</td>
                            <td key={`bodyCol_${index}_2`} role="cell"><strong className="hidden-col"><span className="expense-item-heading">Type:</span></strong>{exp.expenseType.value}</td>
                            <td key={`bodyCol_${index}_3`} role="cell"><strong className="hidden-col"><span className="expense-item-heading">Amount:</span></strong>{`${exp.expenseCCY.symbol}${exp.expenseAmt.$numberDecimal}`}</td>
                            <td key={`bodyCol_${index}_4`} role="cell"><strong className="hidden-col"><span className="expense-item-heading">Paid by:</span></strong>{exp.paidBy.friendName}</td>
                            <td key={`bodyCol_${index}_5`} role="cell"><strong className="hidden-col"><span className="expense-item-heading"># of people:</span></strong>
                                <TooltipOverlay key={`tip-${exp._id}`} id={`tip-${exp._id}`} title={exp.whoInvolved.map(f => f.friendName).join(", ")}>
                                    <Badge bg="warning" className="fs-6" pill>{exp.whoInvolved.length}</Badge>
                                </TooltipOverlay>
                            </td>
                            <td key={`bodyCol_${index}_6`} role="cell"><strong className="hidden-col"><span className="expense-item-heading">More Info:</span></strong>{exp.expenseDesc}</td>
                            <td key={`bodyCol_${index}_7`} role="cell"><strong className="hidden-col"><span className="expense-item-heading">Calculated?:</span></strong>{exp.isCalculated?"Yes":"No"}</td>
                            <td key={`bodyCol_${index}_8`} role="cell">
                                <Button key={`editBtn-${index}`} size="sm"
                                    className="expense-button"
                                    onClick={() => editExpense(index)}
                                    variant="outline-success">Edit</Button>{' '}
                                <Button key={`deleteBtn-${index}`} size="sm"
                                    className="expense-button"
                                    onClick={() => deleteExpense(index)}
                                    variant="outline-danger">Delete</Button>{' '}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
            {expenseData && ((expenseData.length === 0) ? 
                <tfoot><tr><th>No expense record</th></tr></tfoot> : "")}
        </table>        
    )
}

export default ExpenseTable;