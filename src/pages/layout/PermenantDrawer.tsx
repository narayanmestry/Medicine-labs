import * as React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import { Avatar, Toolbar, Button, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import dashboardIcon from '../../Assets/icons/Group 9.svg'
import dashboardIcon_2 from '../../Assets/icons/Group 9_2.svg'
import profileIcon from '../../Assets/icons/Group 11.svg';
import profileIcon_2 from '../../Assets/icons/Group 11_2.svg';
import masterIcon from '../../Assets/icons/Group 13.svg'
import masterIcon_2 from '../../Assets/icons/Group 13_2.svg'
import reportsIcon from '../../Assets/icons/Group 15.svg'
import reportsIcon_2 from '../../Assets/icons/Group 15_2.svg'
import user from '../../Assets/icons/Group 7.svg';
import editUser from '../../Assets/icons/Group 27.svg';
import Logo from '../../Assets/images/MediSimLab-Logo_White@2x.png';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useOrganizationContext } from '../../context/MedisimContext';
import { logout_api } from '../../services/organizationApis';
import { useUserSessionContext } from '../../context/UserSessionContext';
import { getSessionStorageData, isRoleSuperAdmin } from '../../shared/helper';


/// rgb(232 216 244); selected color
/// rgb(243 239 245) report datagrid hover color

const drawerWidth = 225;

export default function PermanentDrawer() {
  const navigate = useNavigate();
  const location = useLocation();

  const {signOut, orgDetails} = useOrganizationContext();
  const {ClearExistingSessions} = useUserSessionContext();
  const filePickerRef = React.useRef<any>(null);
  const [selectedIndex, setSelectedIndex] = React.useState('dashboard');
  const [file, setFile]  = React.useState();
  const [openProfile, setOpenProfile]  = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState();

  React.useEffect(() => {
    if(!file) return;

    const fileReader: any = new FileReader();
    // runs when file is loaded OR completes his task
    fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
    };
    // covert file into dataURL
    fileReader.readAsDataURL(file);
   },[file]);
   
   React.useEffect(()=>{
    if(location.pathname.includes('profile')) {
      setSelectedIndex('profile')
    } else if(location.pathname.includes('masters-list')){
      setSelectedIndex('masterslist')
    } else if(location.pathname.includes('masters')){
      setSelectedIndex('masters')
    } else if(location.pathname.includes('reports')){
      setSelectedIndex('reports')
    } else if(location.pathname.includes('dashboard')){
      setSelectedIndex('dashboard')
    }
   },[location]);

  const pickedHandler = (event: any) => {
    let pickedFile;
        if(event.target.files && event.target.files.length === 1){
            pickedFile = event.target.files[0];
            setFile(pickedFile);
        }
    console.log(pickedFile);
   }

   const pickImageHandler = () => { 
     
     // accessing input with useRef hook 
     if(filePickerRef.current){
      console.log(filePickerRef.current);
      filePickerRef.current?.click();
    }
   };

   const logOutHandler = async() => {
    try {
      const data = {
        email: isRoleSuperAdmin() ? orgDetails.email : orgDetails.spoc_email,
        isUserLogin: false,
        role: getSessionStorageData()?.role
      }
      const response = await logout_api(data);
      console.log(response);
      if(response.data.success){
        ClearExistingSessions()
        signOut();
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      
    }
   }

   const handleListItemClick = (index: any) => {
    setSelectedIndex(index);
   }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex' }} className='sidebar'>
        <AppBar
          position="fixed"
          sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
        >
          <Box display='flex' justifyContent='space-between' width='100%'>
            <Box height='64px' display='flex' alignItems='center'>
              <Typography variant="h5" px={2} noWrap component="div">
                  {location.pathname.includes('profile') ? 'Profile' : location.pathname.includes('masters') ? 'Masters' : location.pathname.includes('reports') ? 'Reports' : 'Dashboard'}
              </Typography>
            </Box>
            <Box display='flex' alignItems='center' gap={2} paddingX={2}>
              <Typography variant='h6' color='#ffffff'>Welcome to MediSimLab!</Typography>
              <Avatar
                alt="Remy Sharp"
                src={user}
                // onClick={()=> setOpenProfile(true)}
                sx={{ cursor: 'pointer'}}
              />
            </Box>
          </Box>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Box sx={{height:'64px', paddingX:2, backgroundColor:'#150E35'}}><img src={Logo} alt="" width='100%' height='100%' style={{objectFit:'contain'}} /></Box>
          <Divider />
          <List className='medisim-list'>
            <ListItem disablePadding>
              <ListItemButton component={Link} to='dashboard' selected={selectedIndex === 'dashboard'} onClick={() => handleListItemClick('dashboard')}>
                <ListItemIcon>
                <img src={ selectedIndex === 'dashboard' ? dashboardIcon_2 :  dashboardIcon } alt="" style={{fill:'#808080'}}/>
                </ListItemIcon>
                <ListItemText primary='Dashboard' />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to='profile' selected={selectedIndex === 'profile'} onClick={() => handleListItemClick('profile')}>
                <ListItemIcon>
                  <img src={ selectedIndex === 'profile' ? profileIcon_2 : profileIcon} alt="" />
                </ListItemIcon>
                <ListItemText primary='Profile' />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to='masters' selected={selectedIndex === 'masters'} onClick={() => handleListItemClick('masters')}>
                <ListItemIcon>
                <img src={selectedIndex === 'masters' ? masterIcon_2 : masterIcon} alt="" />
                </ListItemIcon>
                <ListItemText primary='Masters' className='selected' sx={{fontWeight: selectedIndex === 'masters' ? 'bold' : 'none'}} />
              </ListItemButton>
            </ListItem>
            {isRoleSuperAdmin() && 
            <ListItem disablePadding>
              <ListItemButton component={Link} to='masters-list' selected={selectedIndex === 'masterslist'} onClick={() => handleListItemClick('masterslist')}>
                <ListItemIcon>
                <img src={selectedIndex === 'masterslist' ? masterIcon_2 : masterIcon} alt="" />
                </ListItemIcon>
                <ListItemText primary='Masters List' className='selected' sx={{fontWeight: selectedIndex === 'masterslist' ? 'bold' : 'none'}} />
              </ListItemButton>
            </ListItem>
            }
            <ListItem disablePadding>
              <ListItemButton component={Link} to='reports' selected={selectedIndex === 'reports'} onClick={() => handleListItemClick('reports')}>
                <ListItemIcon>
                <img src={selectedIndex === 'reports' ? reportsIcon_2 : reportsIcon} alt="" />
                </ListItemIcon>
                <ListItemText primary='Reports' />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={logOutHandler}>
                <ListItemIcon>
                  <LogoutIcon color='secondary'/>
                </ListItemIcon>
                <ListItemText primary='Signout'/>
              </ListItemButton>
            </ListItem>
          </List>
          
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3 }}
        >
          <Toolbar/>
          <Outlet/>
        </Box>
      </Box>
      <Modal
        open={openProfile}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
           position: 'absolute' as 'absolute',
           top: '50%',
           left: '50%',
           transform: 'translate(-50%, -50%)',
           width: 250,
           bgcolor: 'background.paper',
           boxShadow: 24,
           p: 4,
           display:'flex',
           flexDirection:'column',
           alignItems:'center',
           gap: 2
        }}>
          <input ref={filePickerRef} type='file' style={{display: 'none', marginBottom: '4px'}} onChange={pickedHandler} accept='.jpg, .png, .jpeg' />
          <Box className='image-upload__preview'>
            <img src={previewUrl ? previewUrl : editUser} alt="" />
          </Box>
          <Button variant='contained' onClick={pickImageHandler} sx={{borderRadius: '30px'}}>Upload / Edit Photo</Button>
          <Box position='absolute' top={10} right={10}>
            <CancelRoundedIcon sx={{color:'#00000026', cursor:'pointer'}} onClick={()=> setOpenProfile(false)}/>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
}