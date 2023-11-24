import { Box, Paper, Table, TableBody, TableCell, TableRow, TextField, Typography, Checkbox, Modal, Button, FormControl, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import MedisimButton from '../../shared/UiElements/button/MedisimButton';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import { toast } from 'react-toastify';
import { dateFormatter, getSessionStorageData, isRoleAdmin, isRoleSuperAdmin } from '../../shared/helper';
import { IOrganization } from '../../interfaces/IOrgnization';
import { updateOrganization } from '../../services/organizationApis';
import { useOrganizationContext } from '../../context/MedisimContext';
import HourGlassLoader from '../../components/UI/HourGlassLoader';

const Profile = () => {

    const {orgDetails, getOrgDetails, getSuperAdminDetails} = useOrganizationContext();
    const [loading, setLoading] = useState(false);
    const [isEditForm, setIsEditForm] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [profileData, setProfileData] = useState<IOrganization>({
        orgName:'',
        orgId:'',
        orgAddress:'',
        onBoardDate:'',
        spocName:'',
        spocEmail:'',
        spocContactNo:'',
        subscriptionPackages:'',
        isQr:false
    });
    const [OpenDialog, setOpenDialog] = useState(false);

    const role = getSessionStorageData()?.role

    useEffect(()=>{
      // getOrgnizationDetails();
      if(orgDetails){
        setProfileData({
          orgName:orgDetails.name,
          orgId:orgDetails.id,
          orgAddress:orgDetails.address,
          onBoardDate: dateFormatter(orgDetails.on_boarding_date),
          spocName: role == 1 ? orgDetails.name : orgDetails.spoc_name,
          spocEmail: role == 1 ? orgDetails.email :  orgDetails.spoc_email,
          spocContactNo: role == 1 ? orgDetails.phone : orgDetails.spoc_phone,
          subscriptionPackages:orgDetails.subscription,
          isQr: orgDetails.is_qr ? orgDetails.is_qr : false
        });
      }
    },[orgDetails]);

    useEffect(()=>{
      if(isRoleSuperAdmin()){
        getSuperAdminDetails();
      }else{
        getOrgDetails();
      }
    },[isUpdate]);

    const handleInputChange = (event: any) => {      
        setProfileData({...profileData, [event.target.name]: event.target.value})
    };

    const handleUpdateorg = async(event: any) => {
      setLoading(true);
      event.preventDefault();
      let data = {
        email: profileData.spocEmail,
        isQR:profileData.isQr
    };

      try {
        const response = await updateOrganization(data, orgDetails.id);
        if (response.data?.success) {
          toast.success('Organization updated successfully.');
          setIsUpdate(!isUpdate);
          setOpenDialog(false);
        }
      } catch (error: any) {
        console.log(error);
        toast.error('Something went wrong.')
      }finally{
        setLoading(false);
      }
    };

  return (
    <Box>
        <Paper sx={{padding:2, minHeight:'70vh'}}>
          <Table sx={{ mt: 2}} aria-label="custom pagination table">
            <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="h6">{isRoleSuperAdmin()? "Name" :'Organization Name'} </Typography>
                  </TableCell>
                  <TableCell style={{ width: '80%' }} align="left">
                  {isEditForm ? <TextField size='small' disabled variant='standard' sx={{ padding:0,"& fieldset": { border: '1px solid lightgrey' },}} defaultValue={profileData.orgName} name='orgName' onChange={handleInputChange}/> : <Typography variant="h6" fontWeight='bold'>{profileData.orgName}</Typography>}              </TableCell>
                </TableRow>
                {/* <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="h6">Organization Unique ID</Typography>
                  </TableCell>
                  <TableCell style={{ width: '80%' }} align="left">
                  {isEditForm ? <TextField size='small' disabled variant='standard' defaultValue={profileData.orgId} name='orgId' onChange={handleInputChange}/> : <Typography variant="h6" fontWeight='bold'>{profileData.orgId}</Typography>}              </TableCell>
                </TableRow> */}
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="h6"> Address</Typography>
                  </TableCell>
                  <TableCell style={{ width: '80%' }} align="left">
                  {isEditForm ? <TextField disabled variant='standard' size='small' defaultValue={profileData.orgAddress} name='orgAddress' onChange={handleInputChange}/> : <Typography variant="h6" fontWeight='bold'>{profileData.orgAddress}</Typography>}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="h6">Onboarding Date</Typography>
                  </TableCell>
                  <TableCell style={{ width: '80%' }} align="left">
                  {isEditForm ? <TextField size='small' disabled variant='standard' type='date' defaultValue={profileData.onBoardDate} name='onBoardDate' onChange={handleInputChange}/> : <Typography variant="h6" fontWeight='bold'>{profileData.onBoardDate}</Typography>}
                  </TableCell>
                </TableRow>
               {isRoleAdmin()? (<TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="h6">{'SPOC'} Name</Typography>
                  </TableCell>
                  <TableCell style={{ width: '80%' }} align="left">
                  {isEditForm ? <TextField size='small' disabled variant='standard' defaultValue={profileData.spocName} name='spocName' onChange={handleInputChange}/> : <Typography variant="h6" fontWeight='bold'>{profileData.spocName}</Typography>}
                  </TableCell>
                </TableRow>):null}
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="h6"> {isRoleSuperAdmin()? null :'SPOC'} Email ID</Typography>
                  </TableCell>
                  <TableCell style={{ width: '80%' }} align="left">
                  {isEditForm ? <TextField size='small' disabled variant='standard' defaultValue={profileData.spocEmail} name='spocEmail' onChange={handleInputChange}/> : <Typography variant="h6" fontWeight='bold'>{profileData.spocEmail}</Typography>}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="h6">{isRoleSuperAdmin()? null :'SPOC'} Phone number</Typography>
                  </TableCell>
                  <TableCell style={{ width: '80%' }} align="left">
                  {isEditForm ? <TextField size='small'  disabled variant='standard' defaultValue={profileData.spocContactNo} name='spocContactNo' onChange={handleInputChange}/> : <Typography variant="h6" fontWeight='bold'>{profileData.spocContactNo}</Typography>}
                  </TableCell>
                </TableRow>
                {isRoleAdmin() && 
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography variant="h6">Subscription Packages</Typography>
                    </TableCell>
                    <TableCell style={{ width: '80%' }} align="left">
                    {isEditForm ?
                    <TextField size='small' disabled variant='standard' defaultValue={profileData.subscriptionPackages} name='subscriptionPackages' onChange={handleInputChange}/>
                      : 
                      <Box display='flex' gap={2}>
                        <Box paddingX={2} paddingY={'5px'} sx={{ border: `1px solid  ${parseInt(profileData.subscriptionPackages) === 1 ? '#6A0DAD' : '#00000066'} `, backgroundColor: parseInt(profileData.subscriptionPackages) === 1 ? '#6A0DAD' : '', textAlign:'center', color: `${parseInt(profileData.subscriptionPackages) === 1 ? '#ffffff' : ''}`, borderRadius: '30px'}} height={20} /* width={50} */>CPR</Box>
                        <Box paddingX={2} paddingY={'5px'} sx={{ border: '1px solid #00000066', textAlign:'center', color: '#00000066', borderRadius: '30px'}} height={20} /* width={50} */>Mental Health</Box>
                        <Box paddingX={2} paddingY={'5px'} sx={{ border: '1px solid #00000066', textAlign:'center', color: '#00000066', borderRadius: '30px'}} height={20} /* width={50} */>ACLS</Box>
                        <Box paddingX={2} paddingY={'5px'} sx={{ border: '1px solid #00000066', textAlign:'center', color: '#00000066', borderRadius: '30px'}} height={20} /* width={50} */>Emergency Response</Box>
                      </Box>
                    }
                    </TableCell>
                  </TableRow>
                }
                {isRoleAdmin() && 
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography variant="h6">isQR</Typography>
                    </TableCell>
                    <TableCell style={{ width: '80%' }} align="left">
                    {isEditForm ? <Checkbox checked={profileData.isQr ? profileData.isQr : false} name='isQr' onChange={(event)=>setProfileData({...profileData, [event.target.name]: event.target.checked})}/> : <Typography variant="h6" fontWeight='bold'>{orgDetails?.is_qr ? orgDetails?.is_qr.toString() : 'false'}</Typography>}
                    </TableCell>
                  </TableRow>
                }
            </TableBody>
          </Table>
        </Paper>
        {/* <Box display='flex' justifyContent='end' bgcolor='#F8F8F8' gap={2} padding={2}> */}
          {/* <MedisimButton color='secondary' onClick={()=>isEditForm ? setIsEditForm(false) : setIsEditForm(true) }>{isEditForm ? 'cancel' : 'edit' }</MedisimButton>
          <MedisimButton color='success' disabled={!isEditForm} onClick={saveProfileDataHandler}>save</MedisimButton> */}
         {/* {isRoleAdmin()? <MedisimButton color='success' onClick={()=>setOpenDialog(true)}>Edit</MedisimButton>:null} */}
        {/* </Box> */}
        <Modal
        open={OpenDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
           position: 'absolute' as 'absolute',
           top: '50%',
           left: '50%',
           transform: 'translate(-50%, -50%)',
           width: 300,
           bgcolor: 'background.paper',
           boxShadow: 24,
           p: 2,
           display:'flex',
           flexDirection:'column',
           alignItems:'center',
           gap: 2
        }}>
          <Typography variant='h5' fontWeight='bold'>Update Organization</Typography>
          <form action="" onSubmit={handleUpdateorg}>
            <Stack>
              <FormControl>
                <label><Typography>Email</Typography></label>
                <TextField disabled size='small' value={profileData.spocEmail}/>
              </FormControl>
              <Box display={'flex'} alignItems='center'>
                <label><Typography>IsQR</Typography></label>
                <Checkbox name='isQr' checked={profileData.isQr} onChange={(event)=>{
                  setProfileData((profileData) => {
                    return {
                      ...profileData,
                      [event.target.name] : event.target.checked
                    }
                  })
                }}/>
              </Box>
              <Box display='flex' justifyContent='center' gap={2}>
                <Button variant='outlined' onClick={()=> setOpenDialog(false)} >Cancel</Button>
                <Button type='submit' variant='contained' disabled={loading} endIcon={loading ?  <HourGlassLoader loading={loading}/> : ''} >Save</Button>
              </Box>
            </Stack>
          </form>
          <Box position='absolute' top={10} right={10}>
            <CancelRoundedIcon sx={{color:'#00000026', cursor:'pointer'}} onClick={()=> setOpenDialog(false)}/>
          </Box>
        </Box>
      </Modal>
    </Box>

  )
}

export default Profile