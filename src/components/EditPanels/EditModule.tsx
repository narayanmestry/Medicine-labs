import { Paper, Box, Typography, Checkbox, FormHelperText, Table, TableBody, TableCell, TableRow, TextField } from '@mui/material'
import React from 'react'
import { ModelsResponse } from '../../interfaces/IModel'
import FormWrapper from '../UI/form-wrapper/FormWrapper'
import { fineModelById } from '../../shared/helper'
import { editModule_api, getAllModelsApi } from '../../services/organizationApis'
import { useFormik } from 'formik'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useOrganizationContext } from '../../context/MedisimContext'

const EditModule = () => {

  const navigate = useNavigate();
  const {state} = useLocation();

  const {getModels} = useOrganizationContext();
  const [loading, setLoading] = React.useState(false);
  const [models, setModels] = React.useState<ModelsResponse[]>([]);

  const formik = useFormik({
    initialValues: {
      name: state?.name,
      descr: state?.descr,
    },
    // validationSchema: SuperAdminValidationSchema 
    onSubmit: (values) => {
        editModuleHandler(values);
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

  const editModuleHandler = async (data: any) => {
    setLoading(true);
    // const model_id = models.find((model: ModelsResponse) => model.name === formik.values.entitlement)?.id;

    const formData = {
      name: formik.values.name, 
      descr: formik.values.descr, 
    };    

    try {
      const response = await editModule_api(formData, state?.id);
      if (response.data?.success) {
        formik.resetForm();
        toast.success(response.data.message);
        getModels();
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
        <Typography variant='h5' fontWeight='bold'>Edit Module</Typography>
      </Box>
      <FormWrapper loading={loading} btnText={'save'} handleSubmit={formik.handleSubmit} handleCancel={()=>navigate(-1)}>
        <Box>
          <Table aria-label="custom pagination table">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">Module Name</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                  <TextField 
                    variant="standard" 
                    size='small' 
                    sx={{ width: 200, padding: 0, 
                      "& fieldset": { border: '1px solid lightgrey' }, 
                    }} 
                    disabled
                    value={formik.values.name} 
                    name='name' 
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    // helperText={formik.touched.name && formik.errors.name}
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
                    value={formik.values.descr} 
                    name='descr' 
                    onChange={formik.handleChange}
                    error={formik.touched.descr && Boolean(formik.errors.descr)}
                    // helperText={formik.touched.name && formik.errors.name}
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

export default EditModule