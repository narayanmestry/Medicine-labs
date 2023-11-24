export const GridStyling = {
    width: '100%',
    mt:2,

    '& .app-them-row-hidden .app-them-cell-hidden': {
        opacity: 0.7,
      },
    '& .MuiDataGrid-footerContainer': {
        justifyContent: 'center',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
        fontFamily: 'poppins',
    },
    '.MuiDataGrid-columnHeaders': {
        borderTop: '3px solid #f5f7f7',
        borderBottom: '3px solid #f5f7f7',
    },
    '& .app-theme-header': {
        color: '#AEAEAE',
        '.MuiDataGrid-columnHeaderTitle': {
            fontWeight: 300,
        },
        '&:hover, &:focus': {
            outline: 'none !important',
        }
    },
    '& .app-theme-cell': {
        '&:hover, &:focus': {
            outline: 'none !important',
        }
    },
    '.MuiDataGrid-cell': {
        overflowWrap: 'anywhere',
        whiteSpace: 'unset !important',
        borderBottom: '1px solid #F3F3F3',
        '&:focus-within': {
            outline: 'none !important',
        }
    },
    '.MuiDataGrid-root': {
        fontSize: '1rem',
        borderBottom:'3px solid #f5f7f7',
        // '.MuiDataGrid-columnHeaderDraggableContainer' :{
        //     '.MuiDataGrid-menuIcon': {
        //         display:'none'
        //     }
        // },
        '.MuiDataGrid-row' : {
            '&.Mui-selected': {
                backgroundColor:'#fffFFF'
            }
        },
    },
    '& .MuiDataGrid-columnHeader--sortable': {
        ' .MuiDataGrid-iconButtonContainer': {
            display:'none'
        },
        '&.MuiDataGrid-columnHeader--sorted': {
            outline: 'none !important',
            ' .MuiDataGrid-iconButtonContainer': {
                '.MuiDataGrid-sortIcon': {
                    opacity: '0 !important',
                }
            }
        },
    },
    '.MuiDataGrid-columnSeparator--sideRight': {
        visibility: 'hidden',
    },
    
}
