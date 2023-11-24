import React from 'react';
import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import apis from "../services/api";
import { sessionTimeoutInMins, sessionWarningTimeInMins } from "../data/constants";
import { useOrganizationContext } from "./MedisimContext";
import { getSessionStorageData, isAuthenticated, isRoleSuperAdmin } from "../shared/helper";

export interface IUserRoleType {
  setSessionState: Dispatch<SetStateAction<number | null | any>>;
  ClearExistingSessions: ()=>void
}

const defaultValue = {
  setSessionState: () => { },
  ClearExistingSessions: ()=>{}
} as IUserRoleType

export const UserSessionContext = createContext(defaultValue);

type UserSessionContextProviderProps = {
  children: ReactNode;
};

export const useUserSessionContext = () => {
  return useContext(UserSessionContext);
}

const UserSessionContextProvider = ({ children }: UserSessionContextProviderProps) => {
  const {orgDetails} = useOrganizationContext();
  const location = useLocation();
  const navigate = useNavigate();

  const emailRef = useRef('');
  const unAuthorizedErrorCount = useRef(0);
  const sessionTimeOutWarning = useRef<NodeJS.Timeout>();
  const sessionTimeOut = useRef<NodeJS.Timeout>();
  emailRef.current = orgDetails?.spoc_email;
  
  const [showFullScreenLoader] = useState(false);
  const [sessionTimeoutLatestWarningTime] = useState<Number>(Number(sessionTimeoutInMins-sessionWarningTimeInMins));
  const [showSessionTimeoutWarningDialog, setShowSessionTimeoutWarningDialog] = useState(false);
  const [showSessionTimeoutDialog, setShowSessionTimeoutDialog] = useState(false);
  const [sessionState, setSessionState] = useState("inactive");

  const role = getSessionStorageData()?.role;


  const InitiateSessions = (isSessionContinued: boolean,) => {
    ClearExistingSessions();
    
    if (isSessionContinued && showSessionTimeoutWarningDialog) {
      setShowSessionTimeoutWarningDialog(false);
    }
    InitiateSessionTimeoutWarning();
    InitiateSessionTimeout();
  };

  const InitiateSessionTimeoutWarning = () => {
      const calculatedTime = Number(sessionWarningTimeInMins);
      
      const currentSessionWarningTimerID = setTimeout(() => {
        setShowSessionTimeoutWarningDialog(true);
      }, calculatedTime * 60000);
      // const previousWarningTimerID = localStorage.getItem('sessionTimeoutWarningTimerID') as any;
      clearTimeout(sessionTimeOutWarning.current);
      sessionTimeOutWarning.current = currentSessionWarningTimerID;
      // localStorage.setItem('sessionTimeoutWarningTimerID', currentSessionWarningTimerID.toString());
  }

  const InitiateSessionTimeout = () => {
      let currentSessionTimerID = setTimeout(() => {
        ClearExistingSessions();
        setShowSessionTimeoutWarningDialog(false);
        setShowSessionTimeoutDialog(true);
        ExpireUserSession();
      }, Number(sessionTimeoutInMins) * 60000);
      clearTimeout(sessionTimeOut.current);
      sessionTimeOut.current = currentSessionTimerID;
  }

  const LogoutUser = async () => {
    setShowSessionTimeoutDialog(false);
    
    // const params = {
    //   email: isRoleSuperAdmin() ? orgDetails.email : orgDetails.spoc_email,
    //   isUserLogin: false,
    //   role: getSessionStorageData()?.role
    // }
    // await apis.loginInstance
    //   .post(`logout`, params)
    //   .then((resp: any) => {
    //     if (resp.data.success) {
    //     } else toast.error('something went wrong.');
    //   })
    //   .catch((err) => {
    //     toast.error(err.response.data.message);
    //     console.log(err);
    //   });
      ClearExistingSessions();
      sessionStorage.clear();
      navigate("/");
  };

  const ExpireUserSession = async () => {
    const data = {
      id: getSessionStorageData()?.id,
      role:role
    }
    await apis.privateInstance
      .post(`${'/api/sessionExpired'}`, data)
      .then((resp: any) => {
        if (!resp.data.success) {
          toast.error('somthing went wrong');
        } else {
          ClearExistingSessions(); 
          // setShowSessionTimeoutWarningDialog(false);
          // setShowSessionTimeoutDialog(false);
          // toast.warning('Session expired')
          sessionStorage.clear();
          // navigate("/");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        console.log(err);
      });
      ClearExistingSessions(); 
      sessionStorage.clear();
  }

  const CheckUserSession = async () => {  
    const data = {
      id: getSessionStorageData()?.id,
      role: role
    }
    await apis.privateInstance
      .post(`${'/api/checkSessionStatus'}`, data)
      .then((resp: any) => {
        if (resp.data.success && !resp.data.message.is_logged_in) {
          ClearExistingSessions();
          setShowSessionTimeoutWarningDialog(false);
          setShowSessionTimeoutDialog(true);
          sessionStorage.clear()
          navigate("/");
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          ClearExistingSessions();
          sessionStorage.clear()
          navigate("/");
        }
      }
      );
  }

  const ClearExistingSessions = () => {
    // const previousWarningTimerID = localStorage.getItem('sessionTimeoutWarningTimerID') as any;
    // clearTimeout(previousWarningTimerID);

    clearTimeout(sessionTimeOutWarning.current);
    sessionTimeOutWarning.current = undefined;


    // const previousTimerID = localStorage.getItem('sessionTimeoutTimerID') as any;
    // clearTimeout(previousTimerID);

    clearTimeout(sessionTimeOut.current);
    sessionTimeOut.current = undefined;


  }

  apis.privateInstance.interceptors.request.use((req: any) => {
    InitiateSessions(true);
    req.headers['Authorization'] = `Barear ${getSessionStorageData()?.token}`;
    return req;
  });

  // runs if only when logout req
  useEffect(() => {
    
    //don't start sessions if the user is at login page, login otp page, and initial page
    if (location.pathname !== '/' && isAuthenticated()) {
      const intercept = apis.privateInstance.interceptors.request.use((req: any) => {
        
        req.headers['Authorization'] = ` Barear ${sessionStorage.getItem('token')}`;
        //if user is trying to logout clear existing sessions
        const logoutUrl = "/api/logout";
        if (req.url === logoutUrl) {
          ClearExistingSessions();
        } else {
          if (!showSessionTimeoutDialog) {
            InitiateSessions(false);
          }
        }
        return req;
      }, error => {
        return error;
      });

        CheckUserSession();
    }

    return () => {
      //apis.instance.interceptors.request.eject(intercept);
    };
  }, [sessionState]);

  // if new session started old session nevigate to login 
  useEffect(() => {
    const interceptor = apis.privateInstance.interceptors.response.use(
      (response) => {
        unAuthorizedErrorCount.current = 0;
        return response;
      },
      (error) => {
        console.log(error);
        if (error.response.status === 401 && unAuthorizedErrorCount.current <= 0) {
          unAuthorizedErrorCount.current += 1;
          ClearExistingSessions(); 
          setShowSessionTimeoutWarningDialog(false);
          setShowSessionTimeoutDialog(false);
          
          sessionStorage.clear()
          navigate("/");
          toast.warning('user session expired');
        }
        return Promise.reject();
      }
    );
    // Clean up the interceptor when the component is unmounted
    return () => {
      apis.privateInstance.interceptors.response.eject(interceptor);
    };
  },[]);


  useEffect(() => {
    if (showSessionTimeoutDialog) {
      ClearExistingSessions();
    }
  }, [showSessionTimeoutDialog]);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer - 2, backgroundColor: 'rgba(255,255,255,0.3)', width: { sm: 'calc(100vw - 240px)' }, marginLeft: { xs: '0', sm: '240px' }, height: { xs: 'calc(100vh - 60px)', sm: 'calc(100vh - 64px)' }, marginTop: { xs: '60px', sm: '64px' } }}
        open={showFullScreenLoader}
        onClick={() => { return null }}
      >
        <CircularProgress color="primary" />
      </Backdrop>

      {/* session timeout WARNING */}
      {location.pathname !== '/login' && (
      <Dialog
        open={showSessionTimeoutWarningDialog}
        onClose={() => { return null }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title" color="primary">
           Warning
        </DialogTitle>
        <DialogContent>
            <Typography>
            {
            `Your session about to expire in the next ${sessionTimeoutLatestWarningTime} mins.
            Click on 'Continue' button to remain logged in.`
          }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color='error' onClick={() => setShowSessionTimeoutWarningDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" color='primary' onClick={() => InitiateSessions(true)}>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      )}

      {/* session TIMEOUT */}
      <Dialog
        open={showSessionTimeoutDialog}
        onClose={() => { return null }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title" color="#6A0DAD">
          Session Expired
        </DialogTitle>
        <DialogContent>
          <Typography>
            {('Uh oh! Your session is expired, Please try login.')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{justifyContent:'center'}}>
          <Button variant="contained" color='primary' onClick={LogoutUser}>
            Go back to login
          </Button>
        </DialogActions>
      </Dialog>
      <UserSessionContext.Provider
        value={{
          setSessionState,
          ClearExistingSessions
        }}
      >
        {children}
      </UserSessionContext.Provider>
    </>
  );
}

export { UserSessionContextProvider }