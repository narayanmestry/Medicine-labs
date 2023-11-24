import { Paper, Box, Typography, Checkbox, FormHelperText, Table, TableBody, TableCell, TableRow, TextField } from '@mui/material'
import React from 'react'
import { ModelsResponse } from '../../interfaces/IModel'
import FormWrapper from '../UI/form-wrapper/FormWrapper'
import { fineModelById, getLocationNameById } from '../../shared/helper'
import { editDevice_api, editLocation_api, getAllModelsApi } from '../../services/organizationApis'
import { useFormik } from 'formik'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useOrganizationContext } from '../../context/MedisimContext'
import { UpdateQRContext } from '../../context/OrgUpadateContext';

const EditDevice = () => {

  const navigate = useNavigate();
  const {state} = useLocation();
  const { allLocations } = useOrganizationContext();

  const [loading, setLoading] = React.useState(false);
  const [models, setModels] = React.useState<ModelsResponse[]>([]);
  const {update , setUpdate} = React.useContext(UpdateQRContext);

  const formik = useFormik({
    initialValues: {
      locationId: getLocationNameById(state?.location_id, allLocations),
      deviceName: state?.name,
      desc: state?.descr,
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
      location_id: formik.values.locationId, 
      name: formik.values.deviceName, 
      desc: formik.values.desc,
    };

    try {
      const response = await editDevice_api(formData, state?.id);
      if (response.data?.success) {
        setUpdate(!update)
        formik.resetForm();
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
        <Typography variant='h5' fontWeight='bold'>Edit Device</Typography>
      </Box>
      <FormWrapper loading={loading} btnText={'save'} handleSubmit={formik.handleSubmit} handleCancel={()=>navigate(-1)}>
        <Box>
          <Table aria-label="custom pagination table">
            <TableBody>
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
                    disabled
                    value={formik.values.locationId} 
                    name='locationId' 
                    onChange={formik.handleChange}
                    error={formik.touched.locationId && Boolean(formik.errors.locationId)}
                    // helperText={formik.touched.officeName && formik.errors.officeName}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">Device Name</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                  <TextField 
                    variant="standard" 
                    size='small' 
                    sx={{ width: 200, padding: 0, 
                      "& fieldset": { border: '1px solid lightgrey' }, 
                    }} 
                    value={formik.values.deviceName} 
                    name='deviceName' 
                    onChange={formik.handleChange}
                    error={formik.touched.deviceName && Boolean(formik.errors.deviceName)}
                    // helperText={formik.touched.officeName && formik.errors.officeName}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">Description</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                  <TextField 
                    variant="standard" 
                    size='small' 
                    sx={{ width: 200, padding: 0, 
                      "& fieldset": { border: '1px solid lightgrey' }, 
                    }} 
                    value={formik.values.desc} 
                    name='desc' 
                    onChange={formik.handleChange}
                    error={formik.touched.desc && Boolean(formik.errors.desc)}
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

export default EditDevice