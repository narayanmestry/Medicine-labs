import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnHeaderParams } from '@mui/x-data-grid'
import React from 'react';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useOrganizationContext } from '../../context/MedisimContext';
import { deleteModuleById_api } from '../../services/organizationApis';
import { ModelsResponse } from '../../interfaces/IModel';
import CustomDialog from '../UI/CustomDialog/CustomDialog';

const emptyObject = [{
  id:"",
  name:"",
  descr:""
}]

const ModuleTable = () => {
    const navigate = useNavigate();
const {allModels, getModels} = useOrganizationContext();
    const [deleteModuleDetails, setDeleteModuleDetails] = React.useState<null | ModelsResponse>(null);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    
      const handleDeleteModel = async(id:number) =>{
        setLoading(true);
        try {
          const response = await deleteModuleById_api(id);
          setOpen(false);
          getModels();
        } catch (error) {
          console.log(error);
        }finally{
          setLoading(false);
        }
      }
    

    const columns: GridColDef[] = [
        { field: 'id', flex:1, filterable: false, sortable: true, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>ID</Typography>}, 
        { field: 'name', flex:2, filterable: false, sortable: true, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Name</Typography>},
        { field: 'descr', flex:2, filterable: false, sortable: true, renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Description</Typography>},
        { field: 'action', flex:2, filterable: false, sortable: true,renderHeader: (params: GridColumnHeaderParams) => <Typography variant='h6'>Action</Typography>, 
            renderCell:(params)=>{
              return(
                  <>
                  {params.row.id ?
                  <>
                    <Box display='flex' gap={2}>
                        <FiEdit className='cursor-pointer' size={'1.2rem'} onClick={()=>navigate('/medisimlabs/edit-module', {state:params.row})}/>
                        <RiDeleteBin5Fill className='cursor-pointer' size={'1.2rem'} onClick={()=>{
                          setDeleteModuleDetails(params.row)
                          setOpen(true);
                        }}/>
                    </Box>
                  </> :null }                 
                  </>
              )}, 
        }
      ];
    
  return (
    <React.Fragment>
      <CustomDialog
        open={open}
        loading={loading}
        description={"Module " + deleteModuleDetails?.name}
        handleClose={()=>setOpen(false)}
        handleDelete={()=>{
          if(deleteModuleDetails){
            handleDeleteModel(deleteModuleDetails?.id)
          }
        }}
      />
      <div className='tab-panel-list'>
          <DataGrid 
            getRowId={(row)=> row.id} 
            rows={allModels?.length > 0 ? allModels : emptyObject} 
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

export default ModuleTable;
