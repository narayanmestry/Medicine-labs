import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import completedIcon from '../../Assets/icons/Group 37.svg';
import incompletedIcon from '../../Assets/icons/Group 39.svg';
import sessionsIcon from '../../Assets/icons/Group 35.svg';
import locationIcon from '../../Assets/icons/Group 19.svg';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';

import PieChart from '../../components/charts/PieChart';
import { filterDeviceFromTaskPreformed, getCompletedIncompletedCount, getMonthDetails, getSessionStorageData, isRoleSuperAdmin} from '../../shared/helper';
import { IUniqueMonths, ItaskData } from '../../interfaces/ITaskDetails';
import { useOrganizationContext } from '../../context/MedisimContext';
import { IMonthReportData } from '../../interfaces/IMonthReportData';

const Dashboard = () => {
    const{ getAllTasks, orgTasks, orgDetails, orgLocationsData, orgDeviceData,
        allTasks, allDevices, allLocations, orgOfficeData } = useOrganizationContext();

    const [taskData, setTaskData] = useState<ItaskData>({task:[], taskPerformed: [], completedTask: 0, incompletedTask: 0, monthOverviewData: []});
    const [locationsFilterTasks, setLocationFilteredTasks] = useState<IUniqueMonths>({});

    useEffect(()=>{
        getAllTasks();
    },[]);

    useEffect(()=>{
        if(!!orgDetails?.id && !!orgTasks /* && orgLocationsData.length > 0 */ /* && orgDeviceData.length > 0 */){
            // location wise filter
            let result ;
            let completedIncompletedCount ;
            let monthDetails:IUniqueMonths ;
            
            if(isRoleSuperAdmin()){
                result = filterDeviceFromTaskPreformed(allTasks, allDevices,  allLocations);
                setLocationFilteredTasks(result);
                
                completedIncompletedCount = getCompletedIncompletedCount(allTasks?.taskPerformed);
                
                monthDetails = getMonthDetails(allTasks);
            }else{
                result = filterDeviceFromTaskPreformed(orgTasks, orgDeviceData,  orgLocationsData);
                setLocationFilteredTasks(result);
                
                completedIncompletedCount = getCompletedIncompletedCount(orgTasks?.taskPerformed);
                
                monthDetails = getMonthDetails(orgTasks);
                
            }

            let monthArr: IMonthReportData[] = [];
            Object.keys(monthDetails).forEach(function(key: string, index: number) {
                monthArr.push({month: key, count: monthDetails[key].newdate, completed:  monthDetails[key].completeCount, incompleted:  monthDetails[key].incompleteCount, id:index+1});
            });   

            setTaskData({
                task: orgTasks?.tasks, 
                taskPerformed: orgTasks?.taskPerformed, 
                completedTask: completedIncompletedCount.completedCount, 
                incompletedTask: completedIncompletedCount.incompletedCount, 
                monthOverviewData: monthArr
            });
        }
            
    },[orgDetails, orgTasks, orgLocationsData, orgDeviceData]);

  return (
    <Box>
        <Grid container direction='row' spacing={2}>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={6} lg={3}>
                        <Card>
                            <Stack direction='row'>
                                <Box flex={2}>
                                    <Typography variant='h5' fontWeight='bold'>Total Sessions</Typography>
                                    <Typography variant='h1' color='primary' fontWeight='bold' >{taskData.taskPerformed?.length ? taskData.taskPerformed?.length : 0}</Typography>
                                </Box>
                                <Box flex={1} textAlign='center'>
                                    <img src={sessionsIcon} alt=''></img>
                                </Box>
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={6} lg={3}>
                        <Card>
                        <Stack direction='row'>
                                <Box flex={2}>
                                    <Typography variant='h5' fontWeight='bold'>Completed</Typography>
                                    <Typography variant='h1' color='primary' fontWeight='bold' >{taskData.completedTask ? taskData.completedTask :0 }</Typography>
                                </Box>
                                <Box flex={1} textAlign='center'>
                                    <img src={completedIcon} alt=''></img>
                                </Box>
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={6} lg={3}>
                        <Card>
                        <Stack direction='row'>
                                <Box flex={2}>
                                    <Typography variant='h5' fontWeight='bold'>Incomplete</Typography>
                                    <Typography variant='h1' color='primary' fontWeight='bold' >{taskData.incompletedTask ? taskData.incompletedTask : 0 }</Typography>
                                </Box>
                                <Box flex={1} textAlign='center'>
                                    <img src={incompletedIcon} alt=''></img>
                                </Box>
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={6} lg={3}>
                        <Card>
                        <Stack direction='row'>
                                <Box flex={2}>
                                    <Typography variant='h5' fontWeight='bold'>Locations</Typography>
                                    <Typography variant='h1' color='primary' fontWeight='bold' >{isRoleSuperAdmin() ? allLocations?.length || 0 : orgLocationsData?.length || 0  }</Typography>
                                </Box>
                                <Box flex={1} textAlign='center'>
                                    <img src={locationIcon} alt=''></img>
                                </Box>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                {/* <Grid container spacing={2}> */}
                    {/* <Grid item xs={9} > */}
                        <Grid container spacing={2}>
                            <Grid item xs={7}>
                                <Card>
                                    <Box>
                                    <Typography variant='h5' fontWeight='bold'>Monthly overview</Typography>
                                        <Box height={{md:300, xl:350}} mb={2}>
                                            <LineChart monthsData={taskData.monthOverviewData}/>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                            <Grid item xs={5}>
                                <Card>
                                    <Box>
                                        <Typography variant='h5' fontWeight='bold' margin={0} paddingBottom={2}>Location based overview (Completed sessions)</Typography>
                                        <Box height={{md:'279px', xl:350}}>
                                            {/* <DoughnutChart/> */}
                                            <PieChart locationData={locationsFilterTasks} />
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                {/* NOT IN MVP 1*/}
                                {/* <Card>
                                    <Typography variant='h5' fontWeight='bold'>Upcoming Sessions</Typography>
                                    <DataGrid rows={rows} columns={columns} hideFooterPagination={true} hideFooter={true} />
                                </Card> */}
                                <Card>
                                    <Typography variant='h5' fontWeight='bold'>Location Based Overview</Typography>
                                    <Box display='flex' justifyContent='center' width={'100%'} height={{md:300, xl:350}}>
                                        <BarChart locationData={locationsFilterTasks}/>
                                    </Box>
                                </Card>
                            </Grid>
                        </Grid>
                    {/* </Grid> */}
                    {/* NOT IN MVP 1*/}
                    {/* <Grid item xs={3} >
                        <Card sx={{ height: '95%'}}>
                            <Typography variant='h5' fontWeight='bold' mb={1}> Session History</Typography>
                            {[1, 2, 3, 4, 5, 6, 6, 2,3, 3,3 ].map(( item : any, index) => (
                                <React.Fragment key={index}>
                                    <Box paddingY={1.5} >
                                        <Typography variant='h6' color='#808080'> {index+1}. &nbsp; 01-05-2022 &nbsp;| &nbsp;12 completed</Typography>
                                    </Box>
                                    <Divider/>
                                </React.Fragment>
                            ))}
                        </Card>
                    </Grid> */}
                {/* </Grid> */}
            </Grid>
        </Grid>
    </Box>
  )
}

export default Dashboard