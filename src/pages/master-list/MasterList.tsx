import { Box, Checkbox, FormControl, FormHelperText, Paper, Tab, Table, TableBody, TableCell, TableRow, Tabs, TextField, Typography } from '@mui/material';
import React from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import IntlTelInput from 'react-intl-tel-input';
import HourGlassLoader from '../../components/UI/HourGlassLoader';
import MedisimButton from '../../shared/UiElements/button/MedisimButton';
import OrganizationTable from '../../components/MasterList/OrganizationTable';
import OfficeTable from '../../components/MasterList/OfficeTable';
import LocationTable from '../../components/MasterList/LocationTable';
import DeviceTable from '../../components/MasterList/DeviceTable';
import ModuleTable from '../../components/MasterList/ModuleTable';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
  
  
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const MasterList = () => {
  const location=useLocation()
  
  const [value, setValue] = React.useState(0);
  const memo = React.useMemo(()=>(setValue(value)),[value])
  React.useEffect(()=>{ 
    if(location.pathname == '/medisimlabs/masters-list/org-table'){
      setValue(0)
    }else if (location.pathname == '/medisimlabs/masters-list/office-table'){
      setValue(1)
    }else if(location.pathname == '/medisimlabs/masters-list/location-table'){
      setValue(2)
    } else if(location.pathname == '/medisimlabs/masters-list/device-table'){
      setValue(3)
    } else if(location.pathname =='/medisimlabs/masters-list/module-table'){
      setValue(4)
    }
  },[memo])

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

  return (
    <Box className='masters'>
    <Paper sx={{ padding: 2}}>
            <form  style={{minHeight:'70vh', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
              <Box>
                <Typography variant='h6' fontSize='1rem'>
                  In this Page the Admin will have option to see and edit Office, Location/Floor under the Office, Device and Mapping of the unique device ID to a specific locations/floor of the office.
                </Typography>
                <Box sx={{ width: '100%' }} mt={2}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className='medisim-master-tabs'>
                          <Tabs
                            value={value} onChange={(event, newValue) => {                              
                              setValue(newValue)
                            }}
                            aria-label="basic tabs example">
                            <Tab label='Organization list'  sx={{ textTransform: 'none' }} component={Link} to ="org-table"/>
                            <Tab label="Office list"  sx={{ textTransform: 'none' }} component={Link} to ="office-table" />
                            <Tab label="Location list"  sx={{ textTransform: 'none' }} component={Link} to ="location-table" />
                            <Tab label="Device list"  sx={{ textTransform: 'none' }} component={Link} to ="device-table" />
                            <Tab label="Module list"  sx={{ textTransform: 'none' }} component={Link} to ="module-table" />
                          </Tabs>
                    {/* </Tabs> */}
                  </Box>

                      <Box>
                        <TabPanel value={value} index={0}>
                          <OrganizationTable/>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                          <OfficeTable/>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                          <LocationTable/>
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                          <DeviceTable/>
                        </TabPanel>
                        <TabPanel value={value} index={4}>
                          <ModuleTable/>
                        </TabPanel>                       
                      </Box>
                </Box>
              </Box>
              <Box display='flex' justifyContent='space-between' bgcolor='#F8F8F8' gap={2} padding={2}>
                  <Box display='flex' gap={1}>
                    <Box  aria-disabled={1 === value+1  ? true : false} className={1 === value+1 ? 'cursor-pointer is-disabled' : 'cursor-pointer'}  bgcolor='#808080' height={30} width={30} sx={{ borderRadius: '50%', position: 'relative' }} onClick={() => {
                       setValue(value-1)}}>
                      <IoIosArrowBack className='react-icon' />
                    </Box>
                    <Box  aria-disabled={5 === value+1  ? 'true' : 'false'} className={5 === value+1 ? ' cursor-pointer is-disabled' : 'cursor-pointer'}  bgcolor='#808080' height={30} width={30} sx={{ borderRadius: '50%', position: 'relative' }} onClick={() => {
                   setValue(value+1) }}>
                      <IoIosArrowForward className='react-icon' />
                  </Box>
                </Box>
              </Box>
            </form>
    </Paper>
  </Box>
  )
}

export default MasterList