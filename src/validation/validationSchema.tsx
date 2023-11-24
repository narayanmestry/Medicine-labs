import * as Yup from "yup";

export const signIn_SignUpSchema = Yup.object({
    activeTab: Yup.number(),
    signIn_email: Yup.string().when('activeTab',(fieldValue: any, schema) => fieldValue[0] === 0
        ? schema.email('Must be a valid email').required('Email is required')
         : schema.notRequired()),
    signIn_password: Yup.string().when('activeTab',(fieldValue: any, schema) =>  fieldValue[0] === 0
        ? schema.required('Password is required')
         : schema.notRequired()),
    fName: Yup.string().when('activeTab',(fieldValue: any, schema) =>  fieldValue[0] === 1
        ? schema.required('first name is required')
         : schema.notRequired()),
    lName: Yup.string().when('activeTab',(fieldValue: any, schema) => fieldValue[0] === 1 
    ? schema.required('last name is required')
     : schema.notRequired()),
    signUp_email: Yup.string().when('activeTab',(fieldValue: any, schema) =>  fieldValue[0] === 1
        ? schema.email('Must be a valid email').required('Email is required')
         : schema.notRequired()),
    signUp_password: Yup.string().when('activeTab',(fieldValue: any, schema) =>  fieldValue[0] === 1
        ? schema.required('password is required')
         : schema.notRequired()),
    confirmPassword: Yup.string().when('activeTab',(fieldValue: any, schema) =>  fieldValue[0] === 1
        ? schema.oneOf([Yup.ref('signUp_password')], 'password must be same.').required('confirm password is required')
         : schema.notRequired()),
  });