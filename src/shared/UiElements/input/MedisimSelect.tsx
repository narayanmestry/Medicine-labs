import React from 'react';
import {Select, MenuItem, FormControl} from '@mui/material';

// type optionObject = {
//   label:string | number,
//   value: React.ReactNode
// }


const MedisimSelect = (props:any) => {
  return (
      <FormControl  sx={{ minWidth: 200 }}>
         <Select {...props} size="small">
            {props.children}
         </Select>
      </FormControl>
            
      )
}

export default MedisimSelect