import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnHeaderParams } from '@mui/x-data-grid'
import React from 'react';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useOrganizationContext } from '../../context/MedisimContext';
import { dateFormatter, getLocationNameById, getOrganizationNameById, getSessionStorageData } from '../../shared/helper';
import { deleteOfficeById_api } from '../../services/organizationApis';
import CustomDialog from '../UI/CustomDialog/CustomDialog';
import { IOfficeResponse } from '../../interfaces/IOffice';

const emptyObject = [{
  "id": "",
  "name": "",
  "address": "",
  "organization_id": "",
  "on_boarding_date": ""
}]

const OfficeTable = () => {
    const navigate = useNavigate();
    const {allOffices, allOrganizations, getAllOffices} = useOrganizationContext();

    const [deleteOfficeDetails, setDeleteOfficeDetails] = React.useState<null | IOfficeResponse>(null);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    
    const handleDeleteOffice = async(id:number) =>{
      setLoading(true);
      try {
        const response = await deleteOfficeById_api(id);
        setOpen(false);
        getAllOffices(getSessionStorageData()?.id);
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false);
      }
    }
    
    const columns: GridColDef[] = [
        { field: 'id', flex:1, filterable: false, sortable: true, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>ID</Typography>}, 
        { field: 'name', flex:2, filterable: false, sortable: true, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Name</Typography>},
        { field: 'address', flex:2, filterable: false, sortable: true, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Address</Typography>}, 
        { field: 'organization_id', flex:2, filterable: false, sortable: true,valueGetter: (params) => {
          return getOrganizationNameById(params.row.organization_id, allOrganizations)
        }, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Organization Name</Typography>},
        { field: 'on_boarding_date', flex:2, filterable: false, sortable: true, valueGetter: (params) => {
          return dateFormatter(params.row.on_boarding_date)
        }, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Onboarding Date</Typography>},
        { field: 'action', flex:2, filterable: false, sortable: true,renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Action</Typography>, 
            renderCell:(params)=>{
              return(
                  <Box display='flex' gap={2}>
                      <FiEdit className='cursor-pointer' size={'1.2rem'} onClick={()=>navigate('/medisimlabs/edit-office', {state:params.row})}/>
                      <RiDeleteBin5Fill className='cursor-pointer' size={'1.2rem'}  onClick={()=>{
                        setDeleteOfficeDetails(params.row)
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
        description={"Office " + deleteOfficeDetails?.name}
        handleClose={()=>setOpen(false)}
        handleDelete={()=>{
          if(deleteOfficeDetails){
            handleDeleteOffice(deleteOfficeDetails?.id)
          }
        }}
      />
      <div className='tab-panel-list'>
          <DataGrid 
            getRowId={(row)=> row.id} 
            rows={allOffices ? allOffices : emptyObject} 
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

export default OfficeTable;
