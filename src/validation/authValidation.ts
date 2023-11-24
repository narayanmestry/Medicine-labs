 // Synchronous validation
 export const authValidate = (values: any) => {
    const errors: any = {};

    // if(!values.role){
    //   errors.role = 'Role required';
    // }
  
    if (!values.signIn_email) {
      errors.signIn_email = 'Email required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.signIn_email)) {
      errors.signIn_email = 'Invalid email address';
    };

    if(!values.signIn_password){
        errors.signIn_password = 'Password required';
    }
  
    return errors;
  };