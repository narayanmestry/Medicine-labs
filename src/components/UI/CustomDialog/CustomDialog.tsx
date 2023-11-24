import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@mui/material'
import HourGlassLoader from '../HourGlassLoader'

const CustomDialog = ({open, description, loading, handleClose, handleDelete}: any) => {
  return (
    <div>
        <Dialog
          open={open}
          keepMounted
          // onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>
            <Typography variant='h5' fontWeight='bold'>Delete</Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to delete <strong>{description}</strong>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>cancel</Button>
            <Button variant='contained' disabled={loading} endIcon={loading ?  <HourGlassLoader loading={loading}/> : ''} onClick={handleDelete}>Delete</Button>
          </DialogActions>
        </Dialog>
        </div>
  )
}

export default CustomDialog