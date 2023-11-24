import React, { useEffect } from "react";
import { Box, FormControl, Stack, Typography, Divider, TextField, Button, FormHelperText } from "@mui/material";
import { toast } from "react-toastify";
import { verifyEmail_api } from "../../services/organizationApis";
import Logo_1 from '../../Assets/images/MediSimLab-Logo@2x.png'
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { sendCodeValidate } from "../../validation/sendCodeValidation";
import HourGlassLoader from "../../components/UI/HourGlassLoader";
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css'; 

export type Values = { email: string, name: string, phoneNo: string, countryCode: string, country:string, isPhoneValid:boolean}

const SendCodeForm = () => {
    const params = useParams();
    const navigate = useNavigate()
    const { values, handleChange, errors, touched, handleBlur, handleSubmit, resetForm, setFieldValue  } = useFormik({
        initialValues: {
            email:'',
            name: '',
            countryCode:'',
            country:'',
            phoneNo: '',
            isPhoneValid:true
        } as Values,
        onSubmit: submitHandler,
        validate: sendCodeValidate
      });

      const [loading, setLoading] = React.useState(false);
   
      
    const handlePhoneNumberChange = (
      isValid: boolean,
      value: string,
      selectedCountryData: any,
      fullNumber: string,
      extension: string
    ) => {

      const dialCode = selectedCountryData.dialCode;
      
      setFieldValue('countryCode', dialCode);
      setFieldValue('phoneNo',value);
      setFieldValue('country', selectedCountryData.iso2);
      setFieldValue('isPhoneValid', isValid);
    };

    const handleFlagChange = (currentNumber: string,
      selectedCountryData: any,
      fullNumber: string,
      isValid: boolean,) => {
      setFieldValue('country', selectedCountryData.iso2);
      setFieldValue('isPhoneValid', isValid);
    }


    async function submitHandler(values: Values) {
      if(values.phoneNo.length > 0 && !values.isPhoneValid) return
        setLoading(true);
        const _phoneNo =  values.countryCode+values.phoneNo
        const data = {
            orgId: params.orgId,
            phone: _phoneNo,
            fName: values.name,
            email:values.email
        }

        try{
            const response = await verifyEmail_api(data);

            if(response.data.success){
                toast.success(`code sent successfully to email ${values.email}.`);
                resetForm();
                navigate('/success', {state:{success:true, message:response.data.message}});
            }else{
                toast.success(`${response.data.message}.`);
            }
            
        }catch(error: any){
            console.log(error);
            if(error.response){
                toast.error(error.response.data.message);
                navigate('/success', {state:{success:false, message:error.response.data.message}});
              } else {
                toast.error('Something went wrong')
              }
        }finally{
            setLoading(false);
        }
    };

  return (
    <Box height={'100vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
      <Box border={'1px solid lightgray'} borderRadius={2} bgcolor='#fff'>
        {/* <Typography fontWeight='bold' bgcolor={'#C6DEE9'} padding={1}>Medisim labs</Typography> */}
        <Box display='flex' justifyContent='center' mt={1}><img src={Logo_1} alt="" height={30}/></Box>
        <Divider sx={{mt:1}}/>
        <form onSubmit={handleSubmit}>
            <Stack direction='column' spacing={2} sx={{paddingY: 2, paddingX:4, borderRadius:'2px'}}>
                <FormControl>
                    <label><Typography variant="h6">Email</Typography></label>
                    <TextField type='email' name='email' placeholder='email...' value={values.email} onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && Boolean(errors.email) && errors.email}
                        size='small'
                        sx={{
                            mt: 0.5,
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: '#C2C2C2',
                              },
                              '&:hover fieldset': {
                                borderColor: '#C2C2C2',
                              },
                            }
                          }}
                    />
                </FormControl>
                <FormControl>
                    <label><Typography variant="h6">Name<Typography variant="h6" component="span">(optional)</Typography></Typography></label>
                    <TextField name='name' value={values.name} onChange={handleChange}
                        size='small'
                        sx={{
                            mt: 0.5,
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: '#C2C2C2',
                              },
                              '&:hover fieldset': {
                                borderColor: '#C2C2C2',
                              },
                            }
                          }}
                    />
                </FormControl>
                <FormControl>
                  <label><Typography variant="h6">Phone<Typography variant="h6" component="span">(optional)</Typography></Typography></label>
                  <IntlTelInput
                    containerClassName="intl-tel-input"
                    inputClassName="form-control"
                    preferredCountries={['in','us']}
                    value={values.phoneNo}
                    onPhoneNumberChange={handlePhoneNumberChange}
                    onSelectFlag={handleFlagChange}
                  />
                  { values.phoneNo.length > 0 && !values.isPhoneValid && <FormHelperText sx={{color:'red'}}>Phone number not valid</FormHelperText>}
                </FormControl>
                <Button
                    type="submit"
                    variant='contained' 
                    endIcon={loading ? <HourGlassLoader loading={loading}/> : ''}
                    sx={{
                        borderRadius:'20px', 
                        paddingX:'30px', 
                        paddingY:'5px', 
                        boxShadow:'none',
                        color:'#ffffff', 
                        '&:hover': {
                          boxShadow:'none',
                          },
                        '&:active': {
                          boxShadow:'none'
                        }
                    }}
                    disabled={loading}
                >
                    Submit
                </Button>
            </Stack> 
         </form>
      </Box>
    </Box>
  );
};

export default SendCodeForm;
