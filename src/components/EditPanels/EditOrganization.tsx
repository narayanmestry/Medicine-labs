import React from 'react';
import { Box, Paper, Checkbox, Table, TableBody, TableCell, TableRow, TextField, Typography, FormHelperText } from '@mui/material';
import MedisimButton from '../../shared/UiElements/button/MedisimButton';
import HourGlassLoader from '../UI/HourGlassLoader';
import FormWrapper from '../UI/form-wrapper/FormWrapper';
import { useFormik } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllModelsApi, updateOrganization } from '../../services/organizationApis';
import { ModelsResponse } from '../../interfaces/IModel';
import { fineModelById } from '../../shared/helper';
import { toast } from 'react-toastify';
import { useOrganizationContext } from '../../context/MedisimContext';
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { checkInternationalPhone } from "../../pages/masters/PhoneValidation";
import { UpdateQRContext } from '../../context/OrgUpadateContext';


const EditOrganization = () => {
  const navigate = useNavigate();
  const {state} = useLocation();
  const [loading, setLoading] = React.useState(false);
  const [models, setModels] = React.useState<ModelsResponse[]>([]);

  const {update , setUpdate} = React.useContext(UpdateQRContext);

  const formik = useFormik({
    initialValues: {
      organizationName: state?.name,
      organizationAddress: state?.address,
      spocEmail: state?.spoc_email,
      spocName: state?.spoc_name,
      spocPhone: state?.spoc_phone,
      isQr: state?.is_qr,
      entitlement: fineModelById(state?.subscription, models),
      isPhonevalid: true
    },
    // validationSchema: SuperAdminValidationSchema 
    onSubmit: (values) => {
      handleUpdateOrg(values);
    },
  });

  React.useEffect(()=>{
    const getModels = async () => {
      try {
        const response = await getAllModelsApi();
        if(response.data.success){
          setModels(response.data.message)
        }
      } catch (error) {
        console.log(error);
      }
  }
    getModels();
  },[]);

  React.useEffect(()=>{
    formik.setFieldValue('entitlement', fineModelById(state?.entitlement ? state?.entitlement[0] : undefined, models))
  },[models, state?.entitlement])

  const handleUpdateOrg = async(values: any) => {
    setLoading(true);
    const model_id = models.find((model: ModelsResponse) => model.name === formik.values.entitlement)?.id /* || models[0]?.id */;

    let data = {
      email: values.spocEmail,
      isQR:values.isQr,
      name:values.organizationName,
      address:values.organizationAddress,
      spocName:values.spocName,
      spocPhone:values.spocPhone,
      entitlement:model_id
  };

    try {
      const response = await updateOrganization(data, state?.id);
      if (response.data?.success) {
        setUpdate(!update)
        toast.success('Organization updated successfully.');
        navigate(-1);
      }
    } catch (error: any) {
      console.log(error);
      toast.error('Something went wrong.')
    }finally{
      setLoading(false);
    }
  };

  // console.warn(formik.values);
  const handlePhoneNumberChange = (value:any, data:any) => {
    formik.setTouched({ ...formik.touched, spocPhone: true }, true);
    formik.setFieldValue('spocPhone',value);
  };
  
  
  return (
    <div className='edit-org'>
    <Paper sx={{ padding: 2, minHeight:'70vh'}}>
      <Box mb={2}>
        <Typography variant='h5' fontWeight='bold'>Edit Organization</Typography>
      </Box>
      <FormWrapper loading={loading} btnText={'save'} handleSubmit={formik.handleSubmit} handleCancel={()=>navigate(-1)}>
        <Box>
          <Table aria-label="custom pagination table">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">Organization Name</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                  <TextField 
                    variant="standard" 
                    size='small' 
                    sx={{ width: 200, padding: 0, 
                      "& fieldset": { border: '1px solid lightgrey' }, 
                    }} 
                    value={formik.values.organizationName} 
                    name='organizationName' 
                    onChange={formik.handleChange}
                    error={formik.touched.organizationName && Boolean(formik.errors.organizationName)}
                    // helperText={formik.touched.organizationName && formik.errors.organizationName}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">Organization Address</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                  <TextField 
                    variant="standard" 
                    size='small' 
                    sx={{ width: 200, padding: 0, 
                      "& fieldset": { border: '1px solid lightgrey' }, 
                    }} 
                    value={formik.values.organizationAddress} 
                    name='organizationAddress' 
                    onChange={formik.handleChange}
                    error={formik.touched.organizationAddress && Boolean(formik.errors.organizationAddress)}
                    // helperText={formik.touched.organizationName && formik.errors.organizationName}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">SPOC Name</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                  <TextField 
                    variant="standard" 
                    size='small' 
                    sx={{ width: 200, padding: 0, 
                      "& fieldset": { border: '1px solid lightgrey' }, 
                    }} 
                    value={formik.values.spocName} 
                    name='spocName' 
                    onChange={formik.handleChange}
                    error={formik.touched.spocName && Boolean(formik.errors.spocName)}
                    // helperText={formik.touched.organizationName && formik.errors.organizationName}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">SPOC Email</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                  <TextField 
                    variant="standard" 
                    size='small' 
                    sx={{ width: 200, padding: 0, 
                      "& fieldset": { border: '1px solid lightgrey' }, 
                    }} 
                    disabled
                    value={formik.values.spocEmail} 
                    name='spocEmail' 
                    onChange={formik.handleChange}
                    error={formik.touched.spocEmail && Boolean(formik.errors.spocEmail)}
                    // helperText={formik.touched.organizationName && formik.errors.organizationName}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">SPOC Phone</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">

                    <ReactPhoneInput
                      value={formik.values.spocPhone}
                      isValid={checkInternationalPhone}
                      onChange={handlePhoneNumberChange}
                      country="in"                      
                      />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">Entitlement</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                  <select name='entitlement' value={formik.values.entitlement} onChange={formik.handleChange}>
                    <option  value ='' >Select Module</option>
                    {models.length !== 0 ? models.map((model: ModelsResponse) => (                      
                      <option key={model.id} value={model.name}>{model.name}</option>                      
                    )): <option value=''>Not found</option>}
                  </select>
                  {formik.touched.entitlement && Boolean(formik.errors.entitlement) && <FormHelperText>{formik.errors.entitlement?.toString()}</FormHelperText>}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">Is QR</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                <Checkbox checked={formik.values.isQr} onChange={(event)=>{
                    formik.setFieldValue( 'isQr', event.target.checked)
                  }}
                />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </FormWrapper>
    </Paper>

    </div>
  )
}

export default EditOrganization