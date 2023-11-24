import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {  Box,  Paper,  Tab,  Tabs,  Table,  TableBody,  TableCell,  TableRow,  TextField,  Typography,  FormHelperText,  FormControl, Checkbox, ToggleButton, ToggleButtonGroup, InputAdornment, IconButton,} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { toast } from 'react-toastify';
import MedisimButton from '../../shared/UiElements/button/MedisimButton';
import { ILocationResponse } from '../../interfaces/ILocation';
import { IDeviceResponse } from '../../interfaces/IDevice';
import { IOfficeResponse } from '../../interfaces/IOffice';
import HourGlassLoader from '../../components/UI/HourGlassLoader';
import {
  addDevice_api, addLocation_api, addModelApi, addOffice_api, addOrganization_api, getAllModelsApi,
} from '../../services/organizationApis';
import { useOrganizationContext } from '../../context/MedisimContext';
import { getSessionStorageData, isRoleSuperAdmin } from '../../shared/helper';
import IntlTelInput from 'react-intl-tel-input';

import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { checkInternationalPhone } from "./PhoneValidation";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ModelsResponse {
  id: number
  name: string
  descr: string
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

const Masters = () => {
  const navigate = useNavigate();
  const { orgDetails, orgDeviceData, orgLocationsData, allLocations, allOrganizations, 
    orgOfficeData, allOffices, allModels, getAllLocations, getAllOffices, getAllDevices,
    getAllOrganization, getModels } = useOrganizationContext();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const SuperAdminValidationSchema = Yup.object().shape({

    // Organization validation
    organizationName: Yup.string().test({
      name: 'organizationName',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 0) {
          if(value === undefined) return  this.createError({ message: 'Organization name is missing.' });
        }
        return true; // No validation needed for other tabs
      },
    }),
    organizationAddress: Yup.string().test({
      name: 'organizationAddress',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 0) {
          if(value === undefined) return  this.createError({ message: 'Organization address is missing.' });
        }
        return true; // No validation needed for other tabs
      },
    }),
    spocEmail: Yup.string().test({
      name: 'spocEmail',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 0) {
          if(value === undefined) return  this.createError({ message: 'SPOC email is missing.' });
          if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return  this.createError({ message: 'SPOC email is not valid.' });
        }
        return true; // No validation needed for other tabs
      },
    }),
    spocName: Yup.string().test({
      name: 'spocName',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 0) {          
          if(value === undefined) return  this.createError({ message: 'SPOC name is missing.' });
        }
        return true; // No validation needed for other tabs
      },
    }),
    spocPhone: Yup.string().test({
      name: 'spocPhone',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 0) {       
          if(value === undefined) return  this.createError({ message: 'SPOC phone is missing.' });
          const isValid = this.parent.isPhoneValid;
          if(!isValid) return  this.createError({ message: 'SPOC phone is invalid' });
        }
        return true; // No validation needed for other tabs
      },
    }),
    spocPassword: Yup.string().test({
      name: 'spocPassword',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 0) {
          if(value === undefined) return  this.createError({ message: 'Password is missing.' });
        }
        return true; // No validation needed for other tabs
      },
    }),
    entitlement: Yup.string().test({
      name: 'entitlement',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 0) {
          if(value === undefined) return  this.createError({ message: 'Entitlement is missing.' });
        }
        return true; // No validation needed for other tabs
      },
    }),
    

    // Office validation
    officeName: Yup.string().test({
      name: 'officeName',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 1) {
          if(value === undefined) return  this.createError({ message: 'Office name is missing.' });
          
          const isSameOfficeName = Boolean(orgOfficeData.some((office: IOfficeResponse) => office.name === value));
          return isSameOfficeName ? this.createError({ message: 'Office name already exists.' }) : true
        }
        return true; // No validation needed for other tabs
      },
    }),
    OfficeAddress: Yup.string().test({
      name: 'OfficeAddress',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 1) {
          if(value === undefined) return false;
        }
        return true; 
      },
      message: 'Office address is missing.',
    }),

    // location validation 
    locationName: Yup.string().test({
      name: 'locationName',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 2) {

          if(value === undefined) return  this.createError({ message: 'Location name is missing.' });
          
          const isSameLocationName = Boolean(orgLocationsData.some((location: ILocationResponse) => location.name.toLowerCase() === value.toLowerCase()));
          return isSameLocationName ? this.createError({ message: 'Location name already exists.' }) : true
        }
        return true; // No validation needed for other tabs
      },
    }),
    LocationOfficeName: Yup.string().test({
      name: 'LocationOfficeName',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 2) {
          if(value === undefined) return false;
        }
        return true; // No validation needed for other tabs
      },
      message: 'Office Name is missing.',
    }),
    
    // // Device validation
    deviceName: Yup.string().test({
      name: 'deviceName',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 3) {
          if(value === undefined) return  this.createError({ message: 'Device name is missing.' });
          
          const isSameDeviceName = Boolean(orgDeviceData.some((device: IDeviceResponse) => device.name === value));
          return isSameDeviceName ? this.createError({ message: 'Device name already exists.' }) : true
        }
        return true; // No validation needed for other tabs
      },
    }),
    deviceLocationName: Yup.string().test({
      name: 'deviceLocationName',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 3) {
          if(value === undefined) return false;
        }
        return true; // No validation needed for other tabs
      },
      message: 'Location Name is missing.',
    }),
    deviceDesc: Yup.string().test({
      name: 'deviceDesc',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 3) {
          if(value === undefined) return false;
        }
        return true; // No validation needed for other tabs
      },
      message: 'Device description Name is missing.',
    }),

    
    // Module validation
    moduleName: Yup.string().test({
      name: 'moduleName',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 4) {
          if(value === undefined) return  this.createError({ message: 'Module name is missing.' });
          
          const isSameDeviceName = Boolean(orgDeviceData.some((device: IDeviceResponse) => device.name === value));
          return isSameDeviceName ? this.createError({ message: 'Module name already exists.' }) : true
        }
        return true; // No validation needed for other tabs
      },
    }),
    moduleDesc: Yup.string().test({
      name: 'moduleDesc',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 4) {
          if(value === undefined) return false;
        }
        return true; // No validation needed for other tabs
      },
      message: 'Device description Name is missing.',
    }),
  });

  const validationSchema = Yup.object().shape({

    // Office validation
    officeName: Yup.string().test({
      name: 'officeName',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 0) {
          if(value === undefined) return  this.createError({ message: 'Office name is missing.' });
          
          const isSameOfficeName = Boolean(orgOfficeData.some((office: IOfficeResponse) => office.name === value));
          return isSameOfficeName ? this.createError({ message: 'Office name already exists.' }) : true
        }
        return true; // No validation needed for other tabs
      },
    }),
    OfficeAddress: Yup.string().test({
      name: 'OfficeAddress',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 0) {
          if(value === undefined) return false;
        }
        return true; 
      },
      message: 'Office address is missing.',
    }),

    // location validation 
    locationName: Yup.string().test({
      name: 'locationName',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 1) {

          if(value === undefined) return  this.createError({ message: 'Location name is missing.' });
          
          const isSameLocationName = Boolean(orgLocationsData.some((location: ILocationResponse) => location.name.toLowerCase() === value.toLowerCase()));
          return isSameLocationName ? this.createError({ message: 'Location name already exists.' }) : true
        }
        return true; // No validation needed for other tabs
      },
    }),
    LocationOfficeName: Yup.string().test({
      name: 'LocationOfficeName',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 1) {
          if(value === undefined) return false;
        }
        return true; // No validation needed for other tabs
      },
      message: 'Office Name is missing.',
    }),
    
    // // Device validation
    deviceName: Yup.string().test({
      name: 'deviceName',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 2) {
          if(value === undefined) return  this.createError({ message: 'Device name is missing.' });
          
          const isSameDeviceName = Boolean(orgDeviceData.some((device: IDeviceResponse) => device.name === value));
          return isSameDeviceName ? this.createError({ message: 'Device name already exists.' }) : true
        }
        return true; // No validation needed for other tabs
      },
    }),
    deviceLocationName: Yup.string().test({
      name: 'deviceLocationName',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 2) {
          if(value === undefined) return false;
        }
        return true; // No validation needed for other tabs
      },
      message: 'Location Name is missing.',
    }),
    deviceDesc: Yup.string().test({
      name: 'deviceDesc',
      test: function (value) {
        const tabValue = this.parent.value;
        if (tabValue === 2) {
          if(value === undefined) return false;
        }
        return true; // No validation needed for other tabs
      },
      message: 'Device description Name is missing.',
    }),

  });

  const formik = useFormik({
    initialValues: {
      organizationName:'',
      organizationAddress:'',
      spocEmail:'',
      spocName:'',
      spocPhone:'',
      spocPassword:'',
      isQr: false,
      entitlement:'',
      officeName: '',
      officeOrgName:'',
      OfficeAddress: '',
      locationName: '',
      LocationOfficeName:'',
      deviceName: '',
      deviceLocationName: '',
      deviceDesc: '',
      moduleName:'',
      moduleDesc:'',
      value:0,
      isPhoneValid: true
    },
    validationSchema : isRoleSuperAdmin() ? SuperAdminValidationSchema : validationSchema,
    onSubmit: (values) => {
      if(isRoleSuperAdmin()){
        if (formik.values.value === 0) {
          addOrganization(values);
        }else if (formik.values.value === 1) {
          addOffice(values);
        } else if (formik.values.value === 2) {
          addLocation(values);
        } else if (formik.values.value === 3) {
          addDevice(values);
        } else if(formik.values.value === 4) {
          addModule(values);
        }
      }else{
        if (formik.values.value === 0) {
          addOffice(values);
        } else if (formik.values.value === 1) {
          addLocation(values);
        } else if (formik.values.value === 2) {
          addDevice(values);
        }
      }
    },
  });

  React.useEffect(()=>{
    if(isRoleSuperAdmin()){
      formik.setFieldValue('officeOrgName', allOrganizations ? allOrganizations[0]?.name : '')
    }
  },[allOrganizations]);

  React.useEffect(()=>{
    if(isRoleSuperAdmin()){
      formik.setFieldValue('LocationOfficeName', allOffices ? allOffices[0]?.name : '')
    }else{
      formik.setFieldValue('LocationOfficeName', orgOfficeData ? orgOfficeData[0]?.name : '')
    }
  },[orgOfficeData, allOffices]);

  React.useEffect(()=>{
    if(isRoleSuperAdmin()){
      formik.setFieldValue('deviceLocationName', allLocations ? allLocations[0]?.name : '')
    }else{
      formik.setFieldValue('deviceLocationName', orgLocationsData ? orgLocationsData[0]?.name : '')
    }
  },[orgLocationsData,allLocations]);

  React.useEffect(()=>{
          if(allModels.length > 0){
            formik.setFieldValue('entitlement', allModels[0].name)
          }
  },[allModels]);

  
  const addOrganization = async (data: any) => {
    setLoading(true);
    const model_id = allModels.find((model: ModelsResponse) => model.name === formik.values.entitlement)?.id;

    const formData = {
      name: formik.values.organizationName, 
      address: formik.values.organizationAddress, 
      spocEmail: formik.values.spocEmail,
      spocName: formik.values.spocName, 
      spocPhone: formik.values.spocPhone, 
      password: formik.values.spocPassword, 
      entitlement: model_id, 
      isQR: formik.values.isQr 
    };

    try {
      const response = await addOrganization_api(formData);
      if (response.data?.success) {
        // formik.resetForm();
        toast.success(response.data.message);
        formik.setFieldValue('value', formik.values.value+1);
        formik.setTouched({}, false);
        getAllOrganization();
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

  const addOffice = async (data: any) => {
    // setLoading(true);
    let officeOrgName: string = '';
    if(isRoleSuperAdmin()){
      officeOrgName = formik.values.officeOrgName;
    }else{
      officeOrgName = orgDetails?.name
    }
    
    const organizationId = allOrganizations?.find((org: any) => org.name === officeOrgName)?.id
    
    const formData = {
      name: data.officeName,
      orgId: organizationId,
      address: data.OfficeAddress,
    };

    try {
      const response = await addOffice_api(formData);
      if (response.data?.success) {
        getAllOffices(orgDetails?.id);
        // formik.resetForm();
        toast.success(response.data.message);
        formik.setTouched({}, false);
        formik.setFieldValue('value', formik.values.value+1);
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
   
  const addLocation = async (data: any) => {
    let officeId;
    if(isRoleSuperAdmin()){
      officeId = allOffices.find((office: any) => office.name === data.LocationOfficeName)?.id;
    }else{
      officeId = orgOfficeData.find((office: any) => office.name === data.LocationOfficeName)?.id;
    }
    setLoading(true);
    
    const formData = {
      name: data.locationName,
      officeId: officeId,
    };

    try {
      const response = await addLocation_api(formData);
      if (response.data?.success) {
        if(isRoleSuperAdmin()){
          getAllLocations(allOffices);
        }else{
          getAllLocations(orgOfficeData);
        }
        // formik.resetForm();
        toast.success(response.data.message);
        formik.setTouched({}, false);
        formik.setFieldValue('value', formik.values.value+1);
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

  const addDevice = async (data: any) => {
    let locationId;
    if(isRoleSuperAdmin()){
      locationId = allLocations.find((location: any) => location.name === data.deviceLocationName)?.id;
    }else{
      locationId = orgLocationsData.find((location: any) => location.name === data.deviceLocationName)?.id;
    }
    setLoading(true);
    const formData = {
      name: data.deviceName,
      desc: data.deviceDesc,
      locationId: locationId,
    };

    try {
      const response = await addDevice_api(formData);
      if (response.data?.success) {
        getAllDevices(orgLocationsData);
        // formik.resetForm();
        toast.success(response.data.message);
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

  const addModule =async (data:any) => {
    setLoading(true);

    const formData = {
      name: formik.values.moduleName, 
      desc: formik.values.moduleDesc, 
    };

    try {
      const response = await addModelApi(formData);
      if (response.data?.success) {
        // formik.resetForm();
        toast.success('Module Added Successfully');
        getModels();
      }
    } catch (error: any) {
      console.log(error);
      if (error) {
        toast.error(error);
      } else {
        toast.error('Module already exists');
      }
    } finally {
      setLoading(false);
    }
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    formik.setFieldValue('entitlement', newAlignment)
  };

  const tabsList = [
    {label:'Add Organization', value:0},
    {label:'Add Office', value:1},
    {label:'Add Location', value:2},
    {label:'Add Device', value:3},
    {label:'Add Module', value:4},
  ];


  // const handlePhoneNumberChange = (
  //   isValid: boolean,
  //   value: string,
  //   selectedCountryData: any,
  //   fullNumber: string,
  //   extension: string
  // ) => {
  //   formik.setTouched({ ...formik.touched, spocPhone: true }, true);
  //   const dialCode = selectedCountryData.dialCode;
    
  //   // formik.setFieldValue('countryCode', dialCode);
  //   formik.setFieldValue('spocPhone',value);
  //   formik.setFieldValue('isPhoneValid', isValid);
  // };

  const handlePhoneNumberChange = (value:any, data:any) => {
    formik.setTouched({ ...formik.touched, spocPhone: true }, true);
    formik.setFieldValue('spocPhone',value);
  };


  // const handleFlagChange = (currentNumber: string,
  //   selectedCountryData: any,
  //   fullNumber: string,
  //   isValid: boolean,) => {
  //   formik.setFieldValue('country', selectedCountryData.iso2);
  //   formik.setFieldValue('isPhoneValid', isValid);
  // }

  const getOptionsHandler = () => {
    if(isRoleSuperAdmin()){
      return (
        allOffices?.length !== 0 ? allOffices?.map((item: any, index:number) => (
          <option key={item.id} value={item.name}>{item.name}</option>
        )): <option value=''>Not found</option>
      )
    }else{
      return (
        orgOfficeData.length !== 0 ? orgOfficeData.map((item: any) => (
          <option key={item.id} value={item.name}>{item.name}</option>
        )): <option value=''>Not found</option>
      )
    }
  }

  const getDeviceOptionsHandler = () => {
    if(isRoleSuperAdmin()){
      return (
        allLocations?.length !== 0 ? allLocations?.map((item: any, index:number) => (
          <option key={item.id} value={item.name}>{item.name}</option>
        )): <option value=''>Not found</option>
      )
    }else{
      return (
        orgLocationsData.length !== 0 ? orgLocationsData.map((item: any) => (
          <option key={item.id} value={item.name}>{item.name}</option>
        )): <option value=''>Not found</option>
      )
    }
  }

  return (
    <Box className='masters'>
      <Paper sx={{ padding: 2/* , minHeight: '70vh'  */}}>
              <form onSubmit={formik.handleSubmit} style={{minHeight:'70vh', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                <Box>
                  <Typography variant='h6' fontSize='1rem'>
                    In this Page the Admin will have option to add New Office, Add New Location/Floor under the Office, Add new Device and Mapping of the unique device ID to a specific locations/floor of the office.
                  </Typography>
                  <Box sx={{ width: '100%' }} mt={2}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className='medisim-master-tabs'>
                        {isRoleSuperAdmin() ? 
                          (
                            <Tabs value={formik.values.value} onChange={(event, newValue) => {
                              formik.setTouched({}, false);
                              // formik.resetForm();
                              formik.setFieldValue('value', newValue);
                            }} aria-label="basic tabs example">
                              <Tab label='Add Organization' value={0} sx={{ textTransform: 'none' }} {...a11yProps(0)} />
                              <Tab label="Add Office" value={1} sx={{ textTransform: 'none' }} {...a11yProps(1)} />
                              <Tab label="Add Location" value={2} sx={{ textTransform: 'none' }} {...a11yProps(2)} />
                              <Tab label="Add Device" value={3} sx={{ textTransform: 'none' }} {...a11yProps(3)} />
                              <Tab label="Add Module" value={4} sx={{ textTransform: 'none' }} {...a11yProps(4)} />
                            </Tabs>
                          ) 
                          : 
                          (
                            <Tabs value={formik.values.value} onChange={(event, newValue) => {
                              formik.setTouched({}, false);
                              // formik.resetForm();
                              formik.setFieldValue('value', newValue);
                            }} aria-label="basic tabs example">
                              <Tab label="Add Office" value={0} sx={{ textTransform: 'none' }} {...a11yProps(0)} />
                              <Tab label="Add Location" value={1} sx={{ textTransform: 'none' }} {...a11yProps(1)} />
                              <Tab label="Add Device" value={2} sx={{ textTransform: 'none' }} {...a11yProps(2)} />
                            </Tabs>
                          )
                        }
                        
                      {/* </Tabs> */}
                    </Box>
                    {isRoleSuperAdmin() ?
                      (
                        <Box>
                          <TabPanel value={formik.values.value} index={0}>
                            <Box>
                                <Table aria-label="custom pagination table">
                                  <TableBody>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">Orgnization Name</Typography>
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
                                          sx={{ width: 200, padding: 0, "& fieldset": { border: '1px solid lightgrey' }, }}
                                          value={formik.values.organizationAddress}
                                          name='organizationAddress'
                                          onChange={formik.handleChange}
                                          error={formik.touched.organizationAddress && Boolean(formik.errors.organizationAddress)}
                                          helperText={formik.touched.organizationAddress && formik.errors.organizationAddress}
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
                                          type='email'
                                          sx={{ width: 200, padding: 0, "& fieldset": { border: '1px solid lightgrey' }, }}
                                          value={formik.values.spocEmail}
                                          name='spocEmail'
                                          onChange={formik.handleChange}
                                          error={formik.touched.spocEmail && Boolean(formik.errors.spocEmail)}
                                          helperText={formik.touched.spocEmail && formik.errors.spocEmail}
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
                                          sx={{ width: 200, padding: 0, "& fieldset": { border: '1px solid lightgrey' }, }}
                                          value={formik.values.spocName}
                                          name='spocName'
                                          onChange={formik.handleChange}
                                          error={formik.touched.spocName && Boolean(formik.errors.spocName)}
                                          helperText={formik.touched.spocName && formik.errors.spocName}
                                        />
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">SPOC Phone</Typography>
                                      </TableCell>
                                      <TableCell style={{ width: '80%' }} align="left">
                                        {/* <IntlTelInput
                                          containerClassName="intl-tel-input"
                                          inputClassName="form-control"
                                          preferredCountries={['in','us']}
                                          value={formik.values.spocPhone}
                                          onPhoneNumberChange={handlePhoneNumberChange}
                                          onSelectFlag={handleFlagChange}
                                        /> */}
                                         <ReactPhoneInput
                                            value={formik.values.spocPhone}
                                            isValid={checkInternationalPhone}
                                            onChange={handlePhoneNumberChange}
                                            country="in"
                                            
                                          />
                                        { formik.touched.spocPhone && formik.errors.spocPhone && <FormHelperText sx={{color:'red'}}>{formik.errors.spocPhone}</FormHelperText>}
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">Password</Typography>
                                      </TableCell>
                                      <TableCell style={{ width: '80%' }} align="left">
                                        <TextField
                                          type={showPassword ? "text" : "password"}
                                          variant="standard"
                                          size='small'
                                          sx={{ width: 200, padding: 0, "& fieldset": { border: '1px solid lightgrey' }, }}
                                          value={formik.values.spocPassword}
                                          name='spocPassword'
                                          onChange={formik.handleChange}
                                          InputProps={{
                                            endAdornment: (
                                              <InputAdornment position="end">
                                                <IconButton
                                                  aria-label="toggle password visibility"
                                                  onClick={handleClickShowPassword}
                                                  edge="end"
                                                >
                                                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                                </IconButton>
                                              </InputAdornment>
                                            ),
                                          }}
                                          error={formik.touched.spocPassword && Boolean(formik.errors.spocPassword)}
                                          helperText={formik.touched.spocPassword && formik.errors.spocPassword}
                                        />
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">Entitlement</Typography>
                                      </TableCell>
                                      <TableCell style={{ width: '80%' }} align="left">
                                        <select name='entitlement' value={formik.values.entitlement} onChange={formik.handleChange}>
                                          {allModels.length !== 0 ? allModels.map((model: ModelsResponse) => (
                                            <option key={model.id} value={model.name}>{model.name}</option>
                                          )): <option value=''>Not found</option>}
                                        </select>
                                        {formik.touched.deviceLocationName && Boolean(formik.errors.deviceLocationName) && <FormHelperText>{formik.errors.deviceLocationName}</FormHelperText>}
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
                          </TabPanel>
                          <TabPanel value={formik.values.value} index={1}>
                            <Box>
                                <Table aria-label="custom pagination table">
                                  <TableBody>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">Organization Name</Typography>
                                      </TableCell>
                                      <TableCell style={{ width: '80%' }} align="left">
                                        <select name='officeOrgName' value={formik.values.officeOrgName} onChange={formik.handleChange}>
                                          {allOrganizations?.length !== 0 ? allOrganizations?.map((item: any, index: number) => (
                                            <option key={item.id} value={item.name}>{item.name}</option>
                                          )): <option value=''>Not found</option>}
                                        </select>
                                        {formik.touched.LocationOfficeName && Boolean(formik.errors.LocationOfficeName) && <FormHelperText>{formik.errors.LocationOfficeName}</FormHelperText>}
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">Office Name</Typography>
                                      </TableCell>
                                      <TableCell style={{ width: '80%' }} align="left">
                                        <TextField
                                          variant="standard"
                                          size='small'
                                          sx={{ width: 200, padding: 0, "& fieldset": { border: '1px solid lightgrey' }, }}
                                          value={formik.values.officeName}
                                          name='officeName'
                                          onChange={formik.handleChange}
                                          error={formik.touched.officeName && Boolean(formik.errors.officeName)}
                                          helperText={formik.touched.officeName && formik.errors.officeName}
                                        />
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">Office Address</Typography>
                                      </TableCell>
                                      <TableCell style={{ width: '80%' }} align="left">
                                        <TextField
                                          variant="standard"
                                          size='small'
                                          sx={{ width: 200, padding: 0, "& fieldset": { border: '1px solid lightgrey' }, }}
                                          value={formik.values.OfficeAddress}
                                          name='OfficeAddress'
                                          onChange={formik.handleChange}
                                          error={formik.touched.OfficeAddress && Boolean(formik.errors.OfficeAddress)}
                                          helperText={formik.touched.OfficeAddress && formik.errors.OfficeAddress}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                            </Box>
                          </TabPanel>
                          <TabPanel value={formik.values.value} index={2}>
                            <Box>
                                <Table aria-label="custom pagination table">
                                  <TableBody>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">Office Name</Typography>
                                      </TableCell>
                                      <TableCell style={{ width: '80%' }} align="left">
                                        <FormControl>
                                        <select name='LocationOfficeName' value={formik.values.LocationOfficeName} onChange={formik.handleChange}>
                                          {getOptionsHandler()}
                                        </select>
                                        {formik.touched.LocationOfficeName && Boolean(formik.errors.LocationOfficeName) && <FormHelperText>{formik.errors.LocationOfficeName}</FormHelperText>}
                                        </FormControl>
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
                                          sx={{ width: 200, padding: 0, "& fieldset": { border: '1px solid lightgrey' }, }}
                                          value={formik.values.locationName}
                                          name='locationName'
                                          onChange={formik.handleChange}
                                          error={formik.touched.locationName && Boolean(formik.errors.locationName)}
                                          helperText={formik.touched.locationName && formik.errors.locationName}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                            </Box>
                          </TabPanel>
                          <TabPanel value={formik.values.value} index={3}>
                            <Box>
                                <Table aria-label="custom pagination table">
                                  <TableBody>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">Device Name</Typography>
                                      </TableCell>
                                      <TableCell style={{ width: '80%' }} align="left">
                                        <TextField
                                          variant="standard"
                                          size='small'
                                          sx={{ width: 200, padding: 0, "& fieldset": { border: '1px solid lightgrey' }, }}
                                          value={formik.values.deviceName}
                                          name='deviceName'
                                          onChange={formik.handleChange}
                                          error={formik.touched.deviceName && Boolean(formik.errors.deviceName)}
                                          helperText={formik.touched.deviceName && formik.errors.deviceName}
                                        />
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">Location Name</Typography>
                                      </TableCell>
                                      <TableCell style={{ width: '80%' }} align="left">
                                        <FormControl>
                                        <select name='deviceLocationName' value={formik.values.deviceLocationName} onChange={formik.handleChange}>
                                        {getDeviceOptionsHandler()}
                                        </select>
                                        {formik.touched.deviceLocationName && Boolean(formik.errors.deviceLocationName) && <FormHelperText>{formik.errors.deviceLocationName}</FormHelperText>}
                                        </FormControl>
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">Device Description</Typography>
                                      </TableCell>
                                      <TableCell style={{ width: '80%' }} align="left">
                                        <TextField
                                          variant="standard"
                                          size='small'
                                          sx={{ width: 200, padding: 0, "& fieldset": { border: '1px solid lightgrey' }, }}
                                          value={formik.values.deviceDesc}
                                          name='deviceDesc'
                                          onChange={formik.handleChange}
                                          error={formik.touched.deviceDesc && Boolean(formik.errors.deviceDesc)}
                                          helperText={formik.touched.deviceDesc && formik.errors.deviceDesc}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                            </Box>
                          </TabPanel>
                          <TabPanel value={formik.values.value} index={4}>
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
                                          sx={{ width: 200, padding: 0, "& fieldset": { border: '1px solid lightgrey' }, }}
                                          value={formik.values.moduleName}
                                          name='moduleName'
                                          onChange={formik.handleChange}
                                          error={formik.touched.moduleName && Boolean(formik.errors.moduleName)}
                                          helperText={formik.touched.moduleName && formik.errors.moduleName}
                                        />
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">Module Description</Typography>
                                      </TableCell>
                                      <TableCell style={{ width: '80%' }} align="left">
                                        <FormControl>
                                        <TextField
                                          variant="standard"
                                          size='small'
                                          sx={{ width: 200, padding: 0, "& fieldset": { border: '1px solid lightgrey' }, }}
                                          value={formik.values.moduleDesc}
                                          name='moduleDesc'
                                          onChange={formik.handleChange}
                                          error={formik.touched.moduleDesc && Boolean(formik.errors.moduleDesc)}
                                          helperText={formik.touched.moduleDesc && formik.errors.moduleDesc}
                                        />
                                        </FormControl>
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                            </Box>
                          </TabPanel> 
                        </Box>
                      )
                      :
                      (
                        <Box>
                          <TabPanel value={formik.values.value} index={0}>
                            <Box>
                                <Table aria-label="custom pagination table">
                                  <TableBody>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">Organization Name</Typography>
                                      </TableCell>
                                      <TableCell style={{ width: '80%' }} align="left">
                                        <TextField variant="standard" size='small' sx={{ width: 200, padding: 0, "& fieldset": { border: '1px solid lightgrey' }, }} value={orgDetails?.name} name='officeOrgName' disabled />
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">Office Name</Typography>
                                      </TableCell>
                                      <TableCell style={{ width: '80%' }} align="left">
                                        <TextField
                                          variant="standard"
                                          size='small'
                                          sx={{ width: 200, padding: 0, "& fieldset": { border: '1px solid lightgrey' }, }}
                                          value={formik.values.officeName}
                                          name='officeName'
                                          onChange={formik.handleChange}
                                          error={formik.touched.officeName && Boolean(formik.errors.officeName)}
                                          helperText={formik.touched.officeName && formik.errors.officeName}
                                        />
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">Office Address</Typography>
                                      </TableCell>
                                      <TableCell style={{ width: '80%' }} align="left">
                                        <TextField
                                          variant="standard"
                                          size='small'
                                          sx={{ width: 200, padding: 0, "& fieldset": { border: '1px solid lightgrey' }, }}
                                          value={formik.values.OfficeAddress}
                                          name='OfficeAddress'
                                          onChange={formik.handleChange}
                                          error={formik.touched.OfficeAddress && Boolean(formik.errors.OfficeAddress)}
                                          helperText={formik.touched.OfficeAddress && formik.errors.OfficeAddress}
                                        />
                                      </TableCell>
                                    </TableRow>
                                    {/* Add more fields here */}
                                  </TableBody>
                                </Table>
                            </Box>
                          </TabPanel>
                          <TabPanel value={formik.values.value} index={1}>
                            <Box>
                                <Table aria-label="custom pagination table">
                                  <TableBody>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">Office Name</Typography>
                                      </TableCell>
                                      <TableCell style={{ width: '80%' }} align="left">
                                        <FormControl>
                                        <select name='LocationOfficeName' value={formik.values.LocationOfficeName} onChange={formik.handleChange}>
                                          {orgOfficeData.length !== 0 ? orgOfficeData.map((item: any) => (
                                            <option key={item.id} value={item.name}>{item.name}</option>
                                          )): <option value=''>Not found</option>}
                                        </select>
                                        {formik.touched.LocationOfficeName && Boolean(formik.errors.LocationOfficeName) && <FormHelperText>{formik.errors.LocationOfficeName}</FormHelperText>}
                                        </FormControl>
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
                                          sx={{ width: 200, padding: 0, "& fieldset": { border: '1px solid lightgrey' }, }}
                                          value={formik.values.locationName}
                                          name='locationName'
                                          onChange={formik.handleChange}
                                          error={formik.touched.locationName && Boolean(formik.errors.locationName)}
                                          helperText={formik.touched.locationName && formik.errors.locationName}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                            </Box>
                          </TabPanel>
                          <TabPanel value={formik.values.value} index={2}>
                            <Box>
                                <Table aria-label="custom pagination table">
                                  <TableBody>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">Device Name</Typography>
                                      </TableCell>
                                      <TableCell style={{ width: '80%' }} align="left">
                                        <TextField
                                          variant="standard"
                                          size='small'
                                          sx={{ width: 200, padding: 0, "& fieldset": { border: '1px solid lightgrey' }, }}
                                          value={formik.values.deviceName}
                                          name='deviceName'
                                          onChange={formik.handleChange}
                                          error={formik.touched.deviceName && Boolean(formik.errors.deviceName)}
                                          helperText={formik.touched.deviceName && formik.errors.deviceName}
                                        />
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">Location Name</Typography>
                                      </TableCell>
                                      <TableCell style={{ width: '80%' }} align="left">
                                        <FormControl>
                                        <select name='deviceLocationName' value={formik.values.deviceLocationName} onChange={formik.handleChange}>
                                          {orgLocationsData.length !== 0 ? orgLocationsData.map((item: any) => (
                                            <option key={item.id} value={item.name}>{item.name}</option>
                                          )): <option value=''>Not found</option>}
                                        </select>
                                        {formik.touched.deviceLocationName && Boolean(formik.errors.deviceLocationName) && <FormHelperText>{formik.errors.deviceLocationName}</FormHelperText>}
                                        </FormControl>
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell component="th" scope="row">
                                        <Typography variant="h6">Device Description</Typography>
                                      </TableCell>
                                      <TableCell style={{ width: '80%' }} align="left">
                                        <TextField
                                          variant="standard"
                                          size='small'
                                          sx={{ width: 200, padding: 0, "& fieldset": { border: '1px solid lightgrey' }, }}
                                          value={formik.values.deviceDesc}
                                          name='deviceDesc'
                                          onChange={formik.handleChange}
                                          error={formik.touched.deviceDesc && Boolean(formik.errors.deviceDesc)}
                                          helperText={formik.touched.deviceDesc && formik.errors.deviceDesc}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                            </Box>
                          </TabPanel>
                        </Box>
                      )
                    }
                  </Box>
                </Box>
                <Box display='flex' justifyContent='space-between' bgcolor='#F8F8F8' gap={2} padding={2}>
                    <Box display='flex' gap={1}>
                      <Box aria-disabled={formik.values.value === 0 ? true : false} className={formik.values.value === 0 ? 'cursor-pointer is-disabled' : 'cursor-pointer'} bgcolor='#808080' height={30} width={30} sx={{ borderRadius: '50%', position: 'relative' }} onClick={() => {
                        formik.setTouched({}, false);
                        // formik.resetForm();
                        formik.setFieldValue('value',formik.values.value - 1);
                      }}>
                        <IoIosArrowBack className='react-icon' />
                      </Box>
                      <Box aria-disabled={isRoleSuperAdmin()?(formik.values.value === 4):(formik.values.value === 2)} className={ isRoleSuperAdmin() ? (formik.values.value === 4 ? ' cursor-pointer is-disabled' : 'cursor-pointer'):(formik.values.value === 2 ? ' cursor-pointer is-disabled' : 'cursor-pointer')} bgcolor='#808080' height={30} width={30} sx={{ borderRadius: '50%', position: 'relative' }} onClick={() => {
                        formik.setTouched({}, false);
                        // formik.resetForm();
                        formik.setFieldValue('value',formik.values.value + 1);
                      }}>
                        <IoIosArrowForward className='react-icon' />
                    </Box>
                  </Box>
                  <Box display='flex' gap={2}>
                    <MedisimButton color='secondary' onClick={() => navigate('/medisimlabs/dashboard')}>cancel</MedisimButton>
                    <MedisimButton color='success' type="submit" disabled={loading}>
                      {loading ? <HourGlassLoader loading={loading} /> : 'Add'}
                    </MedisimButton>
                  </Box>
                </Box>
              </form>
      </Paper>
    </Box>
  );
}

export default Masters;
