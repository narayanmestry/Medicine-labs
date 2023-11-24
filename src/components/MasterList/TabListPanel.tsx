import { DataGrid, GridColDef, GridColumnHeaderParams } from '@mui/x-data-grid'
import React from 'react'

import {Box} from '@mui/material'

import {FiEdit} from 'react-icons/fi'
import {RiDeleteBin5Fill} from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'




const TabListPanel = ({rows}: any) => {
    const navigate =useNavigate();

    const columnsData: GridColDef[] = Object.keys(rows[0]).map((obj: any)=>{
        return { field: obj, flex:1, filterable: false, sortable: true, 
            renderHeader: (params: GridColumnHeaderParams) => obj, }
        });

        columnsData.push({ field: 'action', /* flex:1, */ filterable: false, sortable: true, 
        renderHeader: (params: GridColumnHeaderParams) => "Action", renderCell:()=>{
          return(
              <Box display='flex' gap={2}>
                  <FiEdit size={'1.2rem'} onClick={()=>navigate('/medisimlabs/edit')}/>
                  <RiDeleteBin5Fill size={'1.2rem'}/>
              </Box>
          )
        }})
    
    const columns: GridColDef[] = columnsData;

  return (
    <div className='tab-panel-list'>
        <DataGrid 
          rows={rows} 
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
  )
}

export default TabListPanel