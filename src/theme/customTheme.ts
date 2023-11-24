import { ThemeOptions } from '@mui/material/styles';


export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#6A0DAD',
    },
    secondary: {
      main: '#3C9AFB',
      light: '#438AFE'
    },
    text: {
      primary: '#111111',
      secondary: '#333333',
    //   disabled: '#777777',
    },
    info: {
      main: '#0058E5',
    },
    warning: {
      main: '#F2AF4C',
    },
    success: {
      main: '#5DC983',
    },
    error: {
      main: '#E9394F',
    },
    divider: '#E3E3E3',
  },
  typography: {
    fontFamily: 'Montserrat',
    h6: {
      fontSize: '0.8rem',
      // fontWeight: 700,
      lineHeight: '1rem',
      color : '#7C7C7C'
    },
    h5: {
      fontSize: '1.2rem',
      // fontWeight: 700,
      lineHeight: '1.4rem',
    },
    h4: {
      fontSize: '1.8rem',
      fontWeight: 700,
      lineHeight: '2rem',
    },
    h3: {
      fontSize: '2.2rem',
      fontWeight: 700,
      lineHeight: '2.4rem',
    },
    h2: {
      fontSize: '2.8rem',
      fontWeight: 700,
      lineHeight: '2.9rem',
    },
    h1: {
      fontSize: '3.2rem',
      fontWeight: 600,
      lineHeight: '3.4rem',
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
        },
      },

    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: '#04165D',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#04165D',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#AEAEAE',
            },
            '&:hover fieldset': {
              borderColor: '#0058E5',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#04165D',
            },
          },
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          ":hover": {
            borderColor: 'red',
          },
          '&.MuiInputBase-root.MuiOutlinedInput-root': {
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'red',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: 0,
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem',
          '&.custom-default': {
            color: 'rgba(255, 255, 255, 1)',
            backgroundColor: 'rgba(255, 255, 255, .3)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, .16)',
            },
          },
          borderRadius: '5px',
        },
        colorPrimary: {
          backgroundColor: 'rgba(4, 22, 93, 0.1)',
          color: 'rgba(4, 22, 93, 1)',
          '&:hover': {
            backgroundColor: 'rgba(4, 22, 93, 1)',
            color: 'rgba(255, 255, 255, 1)',
          }
        },
        colorSecondary: {
          backgroundColor: 'rgba(46, 107, 36, 0.1)',
          color: 'rgba(46, 107, 36, 1)',
          '&:hover': {
            backgroundColor: 'rgba(46, 107, 36, 1)',
            color: 'rgba(255, 255, 255, 1)',
          }
        },
        colorSuccess: {
          backgroundColor: 'rgba(93, 201, 131, 0.1)',
          color: 'rgba(93, 201, 131, 1)',
          '&:hover': {
            backgroundColor: 'rgba(93, 201, 131, 1)',
            color: 'rgba(255, 255, 255, 1)',
          }
        },
        colorError: {
          backgroundColor: 'rgba(233, 57, 79, 0.1)',
          color: 'rgba(233, 57, 79, 1)',
          '&:hover': {
            backgroundColor: 'rgba(233, 57, 79, 1)',
            color: 'rgba(255, 255, 255, 1)',
          }
        },
        

      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '5px',
        },
        colorSuccess: {
          backgroundColor: 'rgba(93, 201, 131, 0.2)',
          color: 'rgba(93, 201, 131, 1)',
        },
        colorError: {
          backgroundColor: 'rgba(233, 57, 79, 0.2)',
          color: 'rgba(233, 57, 79, 1)',
        },
      }
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
        },
        // paperAnchorLeft: {
        //   backgroundColor: user.isCadisAdmin ?'#5DC983':user.isConsultant ?'#04165D':'#2E6B24',
        // },
        paperAnchorRight: {
          zIndex: '99999',
          width: '90%',
          maxWidth: '460px',
          padding: '0 20px',
          overflowY: 'scroll',
          boxSizing: 'border-box',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          
        },
        circular: {
          '.MuiAvatar-img': {
            width: 'unset',
            height: 'unset',
            maxWidth: '100%',
            maxHeight: '100%',
          },
          colorScheme: 'light',
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 38,
          height: 22,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(16px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                opacity: 1,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 18,
            height: 18,
          },
          '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: '#E9E9EA',
            opacity: 1,
            transition:'background-color',
            duration: 500,
            },
          },
        }
    },
    MuiBadge: {
      styleOverrides: {
        colorSecondary: {
          backgroundColor: "#ffffff",
          border: '2px solid #777777',
        },
        colorSuccess: {
          border: 'transparent',
        },
        root: {
          '& .MuiBadge-badge': { 
            padding: '0 4px',
            height: '14px',
            borderRadius: '50%',
            minWidth: '14px',
            boxShadow: '0 0 0 2px #ffffff',
          },
          
        },
        
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.4rem',
          lineHeight:'1.6rem',
        }
      }
    },

    
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 900,
      lg: 1200,
      xl: 1536
    },
  },
};