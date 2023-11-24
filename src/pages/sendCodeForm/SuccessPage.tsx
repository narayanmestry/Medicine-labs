import React from 'react'
import { useLocation } from 'react-router-dom'

const SuccessPage = () => {
  const {state} = useLocation();
const success = state?.success || false;
const message = state?.message || 'Unknown error'
  return (
    <div className='success-container'>
    <div className="card">
    <div className='checkmark-container' style={{background: success ? "#F8FAF5":"#ff000059"}}>
      {success ? (
        <i className='checkmark' style={{color:'#9ABC66'}}>✓</i>
      ) : (
        <i className="checkmark" >❌</i>
      )}
    </div>
      <h1 style={{color:success ? "#9ABC66" : "#ff000059"}}>{success ? "Success" : "Error" }</h1> 
      <p>{success?'Code Sent To Email':'User Already Registered'}</p>
    </div>
    </div>
  )
}

export default SuccessPage