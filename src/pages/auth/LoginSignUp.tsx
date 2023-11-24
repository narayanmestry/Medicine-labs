import * as React from 'react';
import { useFormik} from "formik";
import { Link, useNavigate } from 'react-router-dom';
import {Box, Tab, Tabs, Checkbox, FormControl, FormControlLabel, Grid, Stack, Typography, FormHelperText, MenuItem, Select, Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton, InputAdornment } from '@mui/material';
import MedisimTextField from '../../shared/UiElements/input/MedisimTextField';
import MedisimButton from '../../shared/UiElements/button/MedisimButton';
import Logo from '../../Assets/images/MediSimLab-Logo@2x.png'
import { toast } from 'react-toastify';
import { ILoginSignUpInterface } from '../../interfaces/ILoginSignUp';
import { login_api, resetToken_api, superAdminLogin_api } from '../../services/organizationApis';
import { authValidate } from '../../validation/authValidation';
import { useOrganizationContext } from '../../context/MedisimContext';
import HourGlassLoader from '../../components/UI/HourGlassLoader';
import CadisLoader from '../../shared/UiElements/loader/MedisimLoader';
import { existingSessionMessage } from '../../data/constants';

import { MdVisibilityOff, MdVisibility } from "react-icons/md";
import { useUserSessionContext } from '../../context/UserSessionContext';
import { isRoleSuperAdmin } from '../../shared/helper';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function LoginSignUp() {
  const navigate = useNavigate();
  const {getOrgDetails, callIsAuthorizedApis} = useOrganizationContext();
  const [activeTab, setActiveTab] = React.useState(0);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [showPopup, setShowPopup] = React.useState(false);

  const { values, handleChange, errors, touched, handleBlur, handleSubmit } = useFormik({
    initialValues: {
      signIn_email:'',
      signIn_password:'',
      role:'2',
      fName: '',
      lName: '',
      signUp_email:'',
      signUp_password:'',
      confirmPassword: '',
      activeTab:0
    } as ILoginSignUpInterface,
    
    onSubmit: (values)=>{
      setLoading(true);
      if(activeTab !== 1){
          loginApiCall(parseInt(values.role));
      }else{
        toast.info('Account created successfully.')
        setActiveTab(0);
        values.activeTab = 0;
      }
    },
    validate: authValidate
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    values.activeTab = newValue;
  };

  const loginApiCall = async(role:number) => {
    
    let data = {
      email: values.signIn_email,
      password: values.signIn_password
    };

    try {
      if(role === 1){
        const response = await superAdminLogin_api(data);
        if (response.data?.success) {    
          setLoading(false);
          const userDetails = {
            id: response.data.data.id,
            role: parseInt(values.role),
            token: response.data.token
          }

          sessionStorage.setItem('userdetails', JSON.stringify(userDetails));
          getOrgDetails();
          callIsAuthorizedApis();
          navigate("medisimlabs/dashboard");
          toast.success('Login successfully');
        }
      }else{
        const response = await login_api(data);
        if (response.data?.success) {
          setLoading(false);
          const userDetails = {
            id: response.data.data.id,
            role: parseInt(values.role),
            token: response.data.token
          }
          
          sessionStorage.setItem('userdetails', JSON.stringify(userDetails));
          getOrgDetails();
          callIsAuthorizedApis();
          navigate("medisimlabs/dashboard");
          toast.success('Login successfully');
        }
      }
    } catch (error: any) {
      console.log(error);
      if(error.response){
        if(!error.response.data.success && error.response.data.message === existingSessionMessage ){
          return setShowPopup(true);
        }
        toast.error(error.response.data.message)
      } else {
        toast.error('Something went wrong')
      }
    }finally {
      setLoading(false);
    }
    
  }

  const handleContinue = async () => {
    setLoading(true);
    const params = {
        email: values.signIn_email,
        role: values.role
    }
    try {
    const response = await resetToken_api(params);
        if (response.data.success) {
            setShowPopup(false);
            setLoading(false);
            const userDetails = {
              id: response.data.data.id,
              role: parseInt(values.role),
              token: response.data.token
            }
            
            sessionStorage.setItem('userdetails', JSON.stringify(userDetails));
            getOrgDetails();
            callIsAuthorizedApis();
            navigate("medisimlabs/dashboard");
            toast.success('Login successfully');
        }
    }
    catch (error: any) {
        toast.error(error.message);
        setLoading(false);
    }
};

const handleCancel = () => {
  navigate("/Login");
  setShowPopup(false);
};

const handleShowPasswordToggle = () => {
  setShowPassword(!showPassword)
}

  return (
    <Box height='100vh'  display='flex' justifyContent='center'>
      <Box display='flex' flexDirection='column'>
        <Box  className='upper-box'></Box>
        <Box className='lower-box'>
          <Box className='auth-form'>
            <Box display='flex' justifyContent='center' alignItems='center'  padding={4}>
              <img src={Logo} alt="medisimlabs" width='90%' height='90%'/>
              </Box>
            <Box bgcolor='#FFFFFF' borderRadius='10px' boxShadow='0px 2px 10px #0000000D'>
              <Box className='medisim-tabs'>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="basic tabs example" variant="fullWidth">
                  <Tab label="Sign In" sx={{
                    textTransform: 'none'
                  }} {...a11yProps(0)} />
                  <Tab label="Sign Up" disabled {...a11yProps(1)} disableRipple={true} sx={{
                    textTransform: 'none'
                  }}/>
                </Tabs>
              </Box>
              <TabPanel value={activeTab} index={0}>
                <form style={{padding:'20px'}} onSubmit={handleSubmit}>
                  <Stack direction='column' spacing={2}>
                    <Typography variant='h6' textAlign='center' color='#7C7C7C'>Sign in to access your account</Typography>
                    <FormControl>
                      <label htmlFor='email' className='medisim-label'><Typography variant='h6' color='#C2C2C2'> Role</Typography></label>
                        <Select 
                          id='role' 
                          name='role' 
                          value={values.role}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.role && Boolean(errors.role)}
                          sx={{height:'38px'}}
                          displayEmpty
                        >
                          <MenuItem value='1'>Super Admin</MenuItem>
                          <MenuItem value='2'>Admin</MenuItem>
                        </Select>
                        {touched.role && Boolean(errors.role) && <FormHelperText className='field-error'>{errors.role}</FormHelperText>}
                    </FormControl>
                    <FormControl>
                      <label htmlFor='email' className='medisim-label'><Typography variant='h6' color='#C2C2C2'> Email Address</Typography></label>
                      <MedisimTextField 
                        id='email' 
                        // label="Your Label"
                        name='signIn_email' 
                        type='text' 
                        value={values.signIn_email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.signIn_email && Boolean(errors.signIn_email)}
                        helperText={touched.signIn_email && errors.signIn_email}
                        fieldsetcolor='#3C9AFB' 
                        fullWidth/>
                    </FormControl>
                    <FormControl>
                      <label><Typography variant='h6' color='#C2C2C2'> Password</Typography></label>
                      <MedisimTextField 
                        type={showPassword ? 'text' : 'password'}
                        name='signIn_password'
                        value={values.signIn_password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.signIn_password && Boolean(errors.signIn_password)}
                        helperText={touched.signIn_password && errors.signIn_password}
                        fieldsetcolor='#3C9AFB' 
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleShowPasswordToggle}
                                edge="end"
                              >
                                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        fullWidth/>
                    </FormControl>
                  </Stack>
                  <Box display='flex' justifyContent='space-between' alignItems='center' marginTop={0}>
                    <FormControlLabel control={<Checkbox style={{color:'#777777'}} />} label={<Typography variant="h6" color='#777777'>Remember me</Typography>}/>
                    {/* <Typography variant='h6'> <Link to='#' style={{textDecoration:'none', color:'#3C9AFB'}}>Forgot Password? </Link></Typography> */}
                  </Box>
                  <Box display='flex' justifyContent='center' marginTop={2}>
                    <MedisimButton type='submit' color='secondary' hoverolor='#3C9BFB' variant='contained' disabled={loading} endIcon={loading ?  <HourGlassLoader loading={loading}/> : ''}>
                      Sign In
                    </MedisimButton>
                  </Box>
                </form>
              </TabPanel>
              <TabPanel value={activeTab} index={1}>
              <form style={{padding:'20px'}} onSubmit={handleSubmit}>
                    <Typography variant='h6' textAlign='center' color='#7C7C7C' mb={2}>Create your MediSimLab account </Typography>
                    <Grid container spacing={2}>
                      <Grid item md={6} sm={6}>
                        <FormControl>
                          <label><Typography variant='h6' color='#C2C2C2'> First Name</Typography></label>
                          <MedisimTextField 
                            type='text'
                            name='fName'
                            value={values.fName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.fName && Boolean(errors.fName)}
                            helperText={touched.fName && errors.fName}
                            fieldsetcolor='#6A0DAD' 
                            fullWidth/>
                        </FormControl>
                      </Grid>
                      <Grid item md={6}  sm={6}> 
                        <FormControl>
                          <label><Typography variant='h6' color='#C2C2C2'> Last Name</Typography></label>
                          <MedisimTextField 
                            type='text'
                            name='lName'
                            value={values.lName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.lName && Boolean(errors.lName)}
                            helperText={touched.lName && errors.lName}
                            fieldsetcolor='#6A0DAD' 
                            fullWidth/>
                        </FormControl>
                      </Grid>
                      <Grid item md={12} sm={12} >
                        <FormControl fullWidth>
                          <label><Typography variant='h6' color='#C2C2C2'> Email Address</Typography></label>
                          <MedisimTextField 
                            type='text' 
                            name='signUp_email'
                            value={values.signUp_email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.signUp_email && Boolean(errors.signUp_email)}
                            helperText={touched.signUp_email && errors.signUp_email}
                            fieldsetcolor='#6A0DAD' 
                            fullWidth/>
                        </FormControl>
                      </Grid>
                      <Grid item md={12} sm={12} >
                        <FormControl fullWidth>
                          <label><Typography variant='h6' color='#C2C2C2'> Password</Typography></label>
                          <MedisimTextField 
                            type={showPassword ? 'text' : 'password'}
                            name='signUp_password'
                            value={values.signUp_password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.signUp_password && Boolean(errors.signUp_password)}
                            helperText={touched.signUp_password && errors.signUp_password}
                            fieldsetcolor='#6A0DAD'/>
                        </FormControl>
                      </Grid>
                      <Grid item md={12} sm={12} >
                        <FormControl fullWidth>
                          <label><Typography variant='h6' color='#C2C2C2'> Confirm Password</Typography></label>
                          <MedisimTextField 
                            type={showPassword ? 'text' : 'password'} 
                            name='confirmPassword'
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                            helperText={touched.confirmPassword && errors.confirmPassword}
                            fieldsetcolor='#6A0DAD' 
                            fullWidth/>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Box display='flex' justifyContent='space-between' alignItems='center' marginTop={0}>
                      <FormControlLabel control={<Checkbox defaultChecked={showPassword ? true : false} style={{color:'#777777'}} onChange={()=> setShowPassword(!showPassword)}/>} label={<Typography variant="h6" color='#777777'>Show Password?</Typography>}/>
                    </Box>
                  <Box display='flex' justifyContent='center' marginTop={2}>
                    <MedisimButton type='submit' color='primary' hoverolor='#6A0DAD' variant='contained' >
                      Sign Up
                    </MedisimButton>
                  </Box>
                </form>
              </TabPanel>
            </Box>
          </Box>
          </Box>
        </Box>
        <Dialog
                open={showPopup}>
                <DialogTitle id="alert-dialog-title">
                    Confirmation
                </DialogTitle>
                <DialogContent>
                    You already have an active session. Please click on 'Continue' to close that session and continue here. Click 'Cancel' to keep the previous session active.
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color='primary' onClick={handleContinue} disabled={loading} endIcon={loading ? <CadisLoader color='primary' size={14} /> : ''}>
                        Continue
                    </Button>
                    <Button variant="contained" color='error' onClick={handleCancel} disabled={loading}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
    </Box>
  );    
}