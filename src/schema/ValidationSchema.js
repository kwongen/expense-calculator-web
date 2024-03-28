import * as yup from 'yup';

const registerSchema = yup.object().shape({
    name: yup.string()
        .min(2, "Name: minimum 2 characters")
        .max(50, "Name: maximum 2 characters")
        .required("Name: required"),
    email: yup.string()
        .email('Email: invalid email format')
        .required('Email: required'),
    password: yup.string()
        .min(8, 'Password: must be 8 characters long')
        .matches(/[0-9]/, 'Password: requires a number')
        .matches(/[a-z]/, 'Password: requires a lowercase letter')
        .matches(/[A-Z]/, 'Password: requires an uppercase letter')
        .matches(/[^\w]/, 'Password: requires a symbol')
        .required("Password: required"),
    passwordConfirm: yup.string()
        .oneOf([yup.ref('password'), null], 'Confirm: must match "Password" field value')
        .required("Confirm: required"),
    regcode: yup.string().required("Reg Code: required"),
});

const friendSchema = yup.object().shape({
    name: yup.string()
        .min(2, "Name: minimum 2 characters")
        .max(50, "Name: maximum 50 characters")
        .required('Name: required'),
    email: yup.string()
        .email("Email: invalid email format"),
    active: yup.boolean(),
    members: yup.array (
                yup.object({
                    name: yup.string()
                        .min(2, "Name: minimum 2 characters in one of the member")
                        .max(50, "Name: maximum 50 characters in one of the member")
                        .required("Name: required in one of the member"),
                    email: yup.string()
                        .email("Email: invalid email format in one of the member"),
                    active: yup.boolean(),
                })
            )
});

const eventSchema = yup.object().shape({
    eventName: yup.string()
        .min(2, "Event name: minimum 2 characters")
        .max(50, "Event name: maximum 50 characters")
        .required("Event name: required"),
    eventDesc: yup.string(),
    eventStartDate: yup.date().typeError("Start date: invalid date format"),
    eventEndDate: yup.date().typeError("End date: invalid date format"), 
    expenseDefaultCCY: yup.string().required("Currency: required"),
    friendsInvolved: yup.array().of(yup.string()).min(1,"Friends: need to select friends involved."),
    active: yup.boolean()
});

const expenseSchema = yup.object().shape({
    event: yup.string().required("Event ID: required"),
    expenseType: yup.string().required("Expense type: required"),
    expenseDesc: yup.string(),
    expenseCCY: yup.string().required("Currency: required"),
    expenseAmt: yup.number().typeError("Invalid expense amount provide. It should be a number."),
    expenseDate: yup.date().typeError("Invalid expense date format provide.").required("Expense date: required"),
    paidBy: yup.string().required("Paid by: required"),
    whoInvolved: yup.array().of(yup.string()),
    active: yup.boolean()
});

const profileSchema = yup.object().shape({
    name: yup.string()
        .min(2, "Name: minimum 2 characters")
        .max(50, "Name: maximum 2 characters")
        .required("Name: required"),
    email: yup.string()
        .email('Email: invalid email format')
        .required('Email: required'),
    paymentLinkTemplate: yup.string(),
    bankAccountInfo: yup.string(),
});

const changePasswordSchema = yup.object().shape({
    currentPassword: yup.string()
        .min(8, 'Current password: must be 8 characters long')
        .matches(/[0-9]/, 'Current password: requires a number')
        .matches(/[a-z]/, 'Current password: requires a lowercase letter')
        .matches(/[A-Z]/, 'Current password: requires an uppercase letter')
        .matches(/[^\w]/, 'Current password: requires a symbol')
        .required("Current passsword: required"),
    newPassword: yup.string()
        .min(8, 'Password: must be 8 characters long')
        .matches(/[0-9]/, 'New password: requires a number')
        .matches(/[a-z]/, 'New password: requires a lowercase letter')
        .matches(/[A-Z]/, 'New password: requires an uppercase letter')
        .matches(/[^\w]/, 'New password: requires a symbol')
        .required("New passsword: required")
        .notOneOf([yup.ref('currentPassword'), null], 'New password: cannot be the same as current'),
    confirmPassword: yup.string()
        .required("Confirm password: required")
        .oneOf([yup.ref('newPassword'), null], 'Confirm password: must match new password'),        
});

export {
    registerSchema, friendSchema, eventSchema, expenseSchema, profileSchema, changePasswordSchema,
}