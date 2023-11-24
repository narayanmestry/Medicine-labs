import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnHeaderParams, GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid'
import React from 'react';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useOrganizationContext } from '../../context/MedisimContext';
import { dateFormatter, getEntitlementNameById } from '../../shared/helper';
import { deleteOrganizationById_api } from '../../services/organizationApis';
import CustomDialog from '../UI/CustomDialog/CustomDialog';
import { IOrganizationResponse } from '../../interfaces/IOrgnization';

const emptyObject = {
  "id": "",
  "name": "",
  "address": "",
  "spoc_email": "",
  "spoc_name": "",
  "spoc_phone": "",
  "password": "",
  "on_boarding_date": "",
  "subscription": "",
  "code": "",
  "is_qr": "",
  "is_logged_in": false,
  "access_token": null,
  "status": "active"
}

const OrganizationTable = () => {
    const navigate = useNavigate();
    const {allOrganizations, allModels, getAllOrganization} = useOrganizationContext();
    

    const [deleteOrgDetails, setDeleteOrgDetails] = React.useState<null | IOrganizationResponse>(null);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleDeleteOrganization = async(id:number) =>{
      setLoading(true);
      try {
        const response = await deleteOrganizationById_api(id);
        setOpen(false);
        getAllOrganization();
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false);
      }
    }
    // getEntitlementNameById
    const columns: GridColDef[] = [
        { field: 'id', flex:1, filterable: false, sortable: true,  renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>ID</Typography>}, 
        { field: 'name', flex:2, filterable: false, sortable: true, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Name</Typography>},
        { field: 'address', flex:2, filterable: false, sortable: true, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Address</Typography>}, 
        { field: 'spoc_name', flex:2, filterable: false, sortable: true, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>SPOC Name</Typography>},
        { field: 'spoc_email', flex:2, filterable: false, sortable: true, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Email</Typography>},
        { field: 'spoc_phone', flex:2, filterable: false, sortable: true, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Phone</Typography>},
        { field: 'on_boarding_date', flex:2.4, filterable: false, sortable: true, valueGetter: (params) => {
          return dateFormatter(params.row.on_boarding_date)
        }, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Onboarding Date</Typography>},
        { field: 'entitlement', flex:2, filterable: false, sortable: true, 
        renderCell:(params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
          return(
            <>
             {params.row?.entitlement?.[0] ? getEntitlementNameById(params.row?.entitlement?.[0],allModels) : '-'}
            </>
    
          )
        },
 
         renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Entitlement</Typography>}, 
        { field: 'is_qr', /* flex:1, */ filterable: false, sortable: true, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>IsQR</Typography>},
        { field: 'action', flex:2, filterable: false, sortable: true,renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Action</Typography>, 
            renderCell:(params)=>{
              return(
                  <Box display='flex' gap={2}>
                      <FiEdit className='cursor-pointer' size={'1.2rem'} onClick={()=>navigate('/medisimlabs/edit-organization', {state:params.row})}/>
                      <RiDeleteBin5Fill className='cursor-pointer' size={'1.2rem'} onClick={()=>{
                        setDeleteOrgDetails(params.row)
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
        description={"Organization " + deleteOrgDetails?.name}
        handleClose={()=>setOpen(false)}
        handleDelete={()=>{
          if(deleteOrgDetails){
            handleDeleteOrganization(deleteOrgDetails?.id)
          }
        }}
      />
      <div className='tab-panel-list'>
        <DataGrid 
          getRowId={(row)=> row.id} 
          rows={allOrganizations && allOrganizations.length > 0 ? allOrganizations : [emptyObject]} 
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

export default OrganizationTable;
