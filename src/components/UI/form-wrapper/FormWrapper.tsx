import React from 'react'
import {Box} from '@mui/material'
import MedisimButton from '../../../shared/UiElements/button/MedisimButton'
import HourGlassLoader from '../HourGlassLoader'

const FormWrapper = (props : any) => {
  return (
    <form onSubmit={props.handleSubmit} >
      <Box sx={{minHeight:'70vh', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
        <Box>
          {props.children}
        </Box>
        <Box display='flex' justifyContent='end' bgcolor='#F8F8F8' gap={2} padding={2}>
          <Box display='flex' gap={2}>
            <MedisimButton color='secondary' onClick={props.handleCancel}>cancel</MedisimButton>
            <MedisimButton color='success' type="submit" disabled={props.loading}>
              {props.loading ? <HourGlassLoader loading={props.loading} /> : props.btnText}
            </MedisimButton>
          </Box>
        </Box>
      </Box>
    </form>
  )
}

export default FormWrapper