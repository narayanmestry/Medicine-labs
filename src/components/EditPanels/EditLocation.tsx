import { Paper, Box, Typography, Checkbox, FormHelperText, Table, TableBody, TableCell, TableRow, TextField } from '@mui/material'
import React from 'react'
import { ModelsResponse } from '../../interfaces/IModel'
import FormWrapper from '../UI/form-wrapper/FormWrapper'
import { fineModelById, getOfficeNameById } from '../../shared/helper'
import { editLocation_api, getAllModelsApi } from '../../services/organizationApis'
import { useFormik } from 'formik'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useOrganizationContext } from '../../context/MedisimContext'
import { UpdateQRContext } from '../../context/OrgUpadateContext';

const EditLocation = () => {

  const navigate = useNavigate();
  const {state} = useLocation();
  const {allOffices,} = useOrganizationContext();

  const [loading, setLoading] = React.useState(false);
  const [models, setModels] = React.useState<ModelsResponse[]>([]);
  const {update , setUpdate} = React.useContext(UpdateQRContext);

  const formik = useFormik({
    initialValues: {
      officeName: getOfficeNameById(state?.office_id, allOffices),
      locationName: state?.name,
      on_boarding_date: state?.on_boarding_date,
    },
    // validationSchema: SuperAdminValidationSchema 
    onSubmit: (values) => {
        editLocation(values);
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
    formik.setFieldValue('entitlement', fineModelById(1, models))
  },[models, state?.entitlement])

  const editLocation = async (data: any) => {
    setLoading(true);
    // const model_id = models.find((model: ModelsResponse) => model.name === formik.values.entitlement)?.id;

    const formData = {
      office_id: state?.office_id, 
      name: formik.values.locationName, 
      on_boarding_date: formik.values.on_boarding_date,
    };

    try {
      const response = await editLocation_api(formData, state?.id);
      if (response.data?.success) {
        formik.resetForm();
        setUpdate(!update)
        toast.success(response.data.message);
        navigate(-1);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ padding: 2, minHeight:'70vh'}}>
      <Box mb={2}>
        <Typography variant='h5' fontWeight='bold'>Edit Location</Typography>
      </Box>
      <FormWrapper loading={loading} btnText={'save'} handleSubmit={formik.handleSubmit} handleCancel={()=>navigate(-1)}>
        <Box>
          <Table aria-label="custom pagination table">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">Office Name</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                  <TextField 
                    variant="standard" 
                    size='small' 
                    sx={{ width: 200, padding: 0, 
                      "& fieldset": { border: '1px solid lightgrey' }, 
                    }} 
                    disabled
                    value={formik.values.officeName} 
                    name='officeName' 
                    onChange={formik.handleChange}
                    error={formik.touched.officeName && Boolean(formik.errors.officeName)}
                    // helperText={formik.touched.officeName && formik.errors.officeName}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">Location Name</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                  <TextField 
                    variant="standard" 
                    size='small' 
                    sx={{ width: 200, padding: 0, 
                      "& fieldset": { border: '1px solid lightgrey' }, 
                    }} 
                    value={formik.values.locationName} 
                    name='locationName' 
                    onChange={formik.handleChange}
                    error={formik.touched.locationName && Boolean(formik.errors.locationName)}
                    // helperText={formik.touched.officeName && formik.errors.officeName}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">Onboarding Date</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                  <TextField 
                    variant="standard" 
                    size='small' 
                    sx={{ width: 200, padding: 0, 
                      "& fieldset": { border: '1px solid lightgrey' }, 
                    }} 
                    disabled
                    value={formik.values.on_boarding_date} 
                    name='on_boarding_date' 
                    onChange={formik.handleChange}
                    error={formik.touched.on_boarding_date && Boolean(formik.errors.on_boarding_date)}
                    // helperText={formik.touched.officeName && formik.errors.officeName}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </FormWrapper>
    </Paper>
  )
}

export default EditLocation