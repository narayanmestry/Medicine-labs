import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnHeaderParams } from '@mui/x-data-grid'
import React from 'react';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useOrganizationContext } from '../../context/MedisimContext';
import { dateFormatter, getLocationNameById, getOfficeNameById } from '../../shared/helper';
import { deleteLocationById_api } from '../../services/organizationApis';
import { ILocationResponse } from '../../interfaces/ILocation';
import CustomDialog from '../UI/CustomDialog/CustomDialog';

const emptyObject = [{
  "id": '',
  "name": "",
  "office_id": '',
  "on_boarding_date": ""
}]

const LocationTable = () => {
    const navigate = useNavigate();
    const {allOffices, allLocations, getAllLocations} = useOrganizationContext();

    const [deleteLocationDetails, setDeleteLocationDetails] = React.useState<null | ILocationResponse>(null);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    
    const handleDeleteLocation = async(id:number) =>{
      setLoading(true);
      try {
        const response = await deleteLocationById_api(id);
        setOpen(false);
        getAllLocations(allOffices);
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false);
      }
    }
    

    const columns: GridColDef[] = [
        { field: 'id', flex:1, filterable: false, sortable: true, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>ID</Typography>}, 
        { field: 'name', flex:2, filterable: false, sortable: true, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Name</Typography>},
        { field: 'office_id', flex:2, filterable: false, sortable: true, valueGetter: (params) => {
          return getOfficeNameById(params.row.office_id,allOffices)
        }, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Office Name</Typography>},
        { field: 'on_boarding_date', flex:2, filterable: false, sortable: true, valueGetter: (params) => {
          return dateFormatter(params.row.on_boarding_date)
        }, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Onboarding Date</Typography>},
        { field: 'action', flex:2, filterable: false, sortable: true,renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Action</Typography>, 
            renderCell:(params)=>{
              return(
                  <Box display='flex' gap={2}>
                      <FiEdit className='cursor-pointer' size={'1.2rem'} onClick={()=>navigate('/medisimlabs/edit-location', {state:params.row})}/>
                      <RiDeleteBin5Fill className='cursor-pointer' size={'1.2rem'} onClick={()=>{
                        setDeleteLocationDetails(params.row);
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
        description={"Location " + deleteLocationDetails?.name}
        handleClose={()=>setOpen(false)}
        handleDelete={()=>{
          if(deleteLocationDetails){
            handleDeleteLocation(deleteLocationDetails?.id)
          }
        }}
      />
      <div className='tab-panel-list'>
        <DataGrid 
          getRowId={(row)=> row.id} 
          rows={allLocations ? allLocations : emptyObject} 
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

export default LocationTable;
