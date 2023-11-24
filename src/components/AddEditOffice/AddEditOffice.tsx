import { Box, Table, TableBody, TableCell, TableRow, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

const AddEditOffice = () => {

  const [officeData, setOfficeData] = useState({
    officeName:'',
    officeId:'',
    OfficeAddredd:'',
    onBoardingDate:''
  });

  const handleInputChange = (event: any) => {
    setOfficeData({...officeData, [event.target.name]: event.target.value})
};

  return (
    <Box>
       <Table sx={{ mt:4 }} aria-label="custom pagination table">
          <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">Office Name</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                  <TextField size='small' sx={{ padding:0,"& fieldset": { border: '1px solid lightgrey' },}} defaultValue={officeData.officeName} name='officeName' onChange={handleInputChange}/> : <Typography variant="h6" fontWeight='bold'>{officeData.officeName}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">Office Unique ID</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                  <TextField size='small' sx={{ padding:0,"& fieldset": { border: '1px solid lightgrey' },}} defaultValue={officeData.officeName} name='officeName' onChange={handleInputChange}/> : <Typography variant="h6" fontWeight='bold'>{officeData.officeName}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">Office Address</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                  <TextField size='small' sx={{ padding:0,"& fieldset": { border: '1px solid lightgrey' },}} defaultValue={officeData.officeName} name='officeName' onChange={handleInputChange}/> : <Typography variant="h6" fontWeight='bold'>{officeData.officeName}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography variant="h6">Onboarding Date</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                  <TextField size='small' sx={{ padding:0,"& fieldset": { border: '1px solid lightgrey' },}} defaultValue={officeData.officeName} name='officeName' onChange={handleInputChange}/> : <Typography variant="h6" fontWeight='bold'>{officeData.officeName}</Typography>
                </TableCell>
              </TableRow>
          </TableBody>
        </Table>
    </Box>
  )
}

export default AddEditOffice