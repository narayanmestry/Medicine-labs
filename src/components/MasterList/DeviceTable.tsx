import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnHeaderParams } from '@mui/x-data-grid'
import React from 'react';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useOrganizationContext } from '../../context/MedisimContext';
import { dateFormatter, getLocationNameById} from '../../shared/helper';
import { deleteDeviceById_api } from '../../services/organizationApis';
import { IDeviceResponse } from '../../interfaces/IDevice';
import CustomDialog from '../UI/CustomDialog/CustomDialog';

const emptyObject = [{
  "id": "",
  "name": "",
  "descr": "",
  "location_id": "",
  "on_boarding_date": ""
}]

const DeviceTable = () => {
    const navigate = useNavigate();
    const {allDevices,allLocations, getAllDevices} = useOrganizationContext();
    
    const [deleteDeviceDetails, setDeleteDeviceDetails] = React.useState<null | IDeviceResponse>(null);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    
    const handleDeleteDevice = async(id:number) =>{
      setLoading(true)
      try {
        const response = await deleteDeviceById_api(id);
        setOpen(false);
        getAllDevices(allLocations);
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false)
      }
    }

    const columns: GridColDef[] = [
        { field: 'id', flex:1, filterable: false, sortable: true, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>ID</Typography>}, 
        { field: 'name', flex:2, filterable: false, sortable: true, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Name</Typography>},
        { field: 'location_id', flex:2, filterable: false, sortable: true,  valueGetter: (params) => {
          return getLocationNameById(params.row.location_id,allLocations)
        },renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Location Name</Typography>},
        { field: 'on_boarding_date', flex:2, filterable: false, sortable: true,valueGetter: (params) => {
          return dateFormatter(params.row.on_boarding_date)
        }, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Onboarding Date</Typography>},
        { field: 'action', flex:2, filterable: false, sortable: true,renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Action</Typography>, 
            renderCell:(params)=>{
              return(
                  <Box display='flex' gap={2}>
                      <FiEdit className='cursor-pointer' size={'1.2rem'} onClick={()=>navigate('/medisimlabs/edit-device', {state:params.row})}/>
                      <RiDeleteBin5Fill className='cursor-pointer' size={'1.2rem'} onClick={()=>{
                         setDeleteDeviceDetails(params.row);
                         setOpen(true);
                      }}/>
                  </Box>
              )}, 
        }
      ];
    
  return (
    <React.Fragment>
      <CustomDialog
        open={open}
        loading={loading}
        description={"Device " + deleteDeviceDetails?.name}
        handleClose={()=>setOpen(false)}
        handleDelete={()=>{
          if(deleteDeviceDetails){
            handleDeleteDevice(deleteDeviceDetails?.id)
          }
        }}
      />
      <div className='tab-panel-list'>
          <DataGrid 
            getRowId={(row)=> row.id} 
            rows={allDevices ? allDevices : emptyObject} 
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }} 
            pageSizeOptions={[10, 15, 20]}
            checkboxSelection={false}
            rowSelection={false}
          />
      </div>
    </React.Fragment>
  )
}

export default DeviceTable;
