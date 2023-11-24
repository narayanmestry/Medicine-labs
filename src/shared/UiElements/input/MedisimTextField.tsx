import { TextField } from '@mui/material'
import React from 'react'

const MedisimTextField = (props: any) => {
  return (
    <TextField {...props} size='small' sx={{
      mt: 0.5,
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#C2C2C2',
        },
        '&:hover fieldset': {
          borderColor: '#C2C2C2',
        },
        '&.Mui-focused fieldset': {
          borderColor: props.fieldsetcolor,
        },
      }
    }}
    />
  )
}

export default MedisimTextField