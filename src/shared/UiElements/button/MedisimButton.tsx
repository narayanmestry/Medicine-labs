import { Button } from '@mui/material'
import React from 'react'

const MedisimButton = (props: any) => {
  return (
    <Button {...props} color={props.color} variant='contained' sx={{
        borderRadius:'20px', 
        paddingX:'30px', 
        paddingY:'5px', 
        boxShadow:'none',
        color:'#ffffff', 
        '&:hover': {
          backgroundColor:props.hovercolor,
          boxShadow:'none',
          },
        '&:active': {
          boxShadow:'none'
        }
        }}
      >
        {props.children}
      </Button>
  )
}

export default MedisimButton