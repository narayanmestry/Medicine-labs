import React, { useEffect, useState ,useRef} from 'react'
import { CSVLink } from "react-csv";
import { Box, FormControl, Grid, Paper, Stack, Table, TableBody, TableCell, TableRow, Button, Typography, Backdrop, CircularProgress, Menu, MenuItem ,Fade} from '@mui/material'
import { DataGrid, GridColDef, GridColumnHeaderParams } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { GrDocumentDownload } from 'react-icons/gr';
import {MdOutlineExpandMore ,MdOutlineExpandLess} from 'react-icons/md'
import  jsPDF, { CellConfig }  from 'jspdf';
import 'jspdf-autotable'
import { GridStyling } from '../../shared/styling/sharedStyling';
import { ScenarioName, csvContentGenerator, dateFormatter, filterByDeviceId, filterByScenario, filterByUserId, filterOnlyByLocationId, filterOnlyByOfficeId, filterTasksByOrgId, findScenarios, getSessionStorageData, getTimeDifference, isRoleSuperAdmin, timeIntoSecORMin, transformReportData } from '../../shared/helper';
import {  getOrgUsersApi} from '../../services/organizationApis';
import { useOrganizationContext } from '../../context/MedisimContext';
import { ILocationResponse } from '../../interfaces/ILocation';
import { IDeviceResponse } from '../../interfaces/IDevice';    
import { ITaskPerformed } from '../../interfaces/ITaskDetails';

import medisimLogo from '../../Assets/images/MediSimLab-Logo.png';
import { scenariosList } from '../../data/constants';

const columns: GridColDef[] = [
  { field: 'id', flex:1, filterable: false, sortable: true, valueGetter: (params)=>{
    return dateFormatter(params.row.start_time) !== 'NaN-NaN-NaN' ? dateFormatter(params.row.start_time) : ''
    }, 
    renderHeader: (params: GridColumnHeaderParams) => (<Typography fontWeight='bold' color='#7C7C7C'> Day </Typography>), },
   { field: 'start_time', flex:1, filterable: false, sortable: false, valueGetter: (params) =>
   {
    let time = '';
    if(params.row.start_time){
      const splited = params.row.start_time.split('T')[1];
      time = splited.slice(0,8);
    }
    return time;
    }, renderHeader: (params: GridColumnHeaderParams) => (<Typography color='#7C7C7C'> <strong>Start Time </strong></Typography>), },
  { field: 'end_time', flex:1, filterable: false, sortable: false, valueGetter: (params) => {
    let time = '';
    if(params.row.start_time){      
      const splited = params.row.end_time.split('T')[1];
      time = splited.slice(0,8);    
    }
    return time;
    }, 
    renderHeader: (params: GridColumnHeaderParams) => (<Typography color='#7C7C7C'> <strong>End Time</strong></Typography>), },
  { field: 'version', flex:1, filterable: false, sortable: false, valueGetter: (params) => {
    const timeDiff = timeIntoSecORMin(params.row.start_time, params.row.end_time);
    return  timeDiff !== 'NaN.NaN min' ? timeDiff: '';
    // SCENARIOS
    }, 
    renderHeader: (params: GridColumnHeaderParams) => (<Typography color='#7C7C7C'> <strong>Usage Time</strong></Typography>), },
  { field: 'model_id', flex:1, filterable: false, sortable: false, valueFormatter: (params: any)=> params.value, renderHeader: (params: GridColumnHeaderParams) => (<Typography fontWeight='bold' color='#7C7C7C'> Module </Typography>), },
  { field: 'scenario', flex:1, filterable: false, sortable: false,valueFormatter: (params)=>{
    return ScenarioName(params.value)
    // return params.value
  }, renderHeader: (params: GridColumnHeaderParams) => (<Typography fontWeight='bold' color='#7C7C7C'> Scenario </Typography>), },
  { field: 'complete', flex:1, filterable: false, sortable: false, renderHeader: (params: GridColumnHeaderParams) => (<Typography fontWeight='bold' color='#7C7C7C'> Completion </Typography>), },
];

const Reports = () => {
  const{ allOrganizations,  orgTasks, orgDetails, orgOfficeData, orgDeviceData, orgLocationsData, 
    allTasks } = useOrganizationContext();
  
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const [locations, setLocations] = useState<ILocationResponse[]>([]);
  const [deviceData, setDeviceData] = useState<IDeviceResponse[]>([]);
  const [senarios, setSenarios] = useState<String[]>([]);

  const [csvData, setCsvData] = useState<string>('');
  const csvRef = useRef<any>(null);
  const [typeOfDataDownloaded, setTypeOfDataDownloaded]= useState('');
  const [searchParams, setSearchParams] = useState({
    organization: {id: 0,  name: 'All',  spoc_email: "", on_boarding_date: ""}, 
    office: {id: 0,  name: 'All',  address: "", organization_id: 0, on_boarding_date: ""}, 
    location:{id: 0, name: "All", office_id: 0,  on_boarding_date: ""}, 
    device:{ id: 0,name: "All", descr: "",location_id: 0,on_boarding_date: ""},
    user:{ id: 0, email: "All", fname: "",lname: '',organization_id:0, on_boarding_date: ""},
    scenario:'All'
  });

    // code for Download data format menu
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

  const [taskData, setTaskData] = useState<any>({task:[], taskPerformed: [], completedTask: 0, incompletedTask: 0, completionRate: 0, averageUasage:0, dateWiseReportdata:[{date: '', count: '', completed: '', id:1}]});
  
  const role = getSessionStorageData()?.role;
  
  const getOrganizationUsers = async() => {
    try {
      const response = await getOrgUsersApi(orgDetails.id);
      if(response.data.success){
        setUsers(response.data.message)
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  // useEffect(()=>{
  //   getAllTasks();
  // },[]);

  useEffect(()=>{
    if(orgLocationsData) {
      setLocations(orgLocationsData);
    }

    if(orgDeviceData){
      setDeviceData(orgDeviceData);
    }
  },[ orgLocationsData, orgDeviceData]);

  useEffect(()=>{
    setLoading(true);
    if(!!orgDetails?.id && !!orgTasks){  
      // getAllOffices(orgDetails?.id);
      getOrganizationUsers();

      let transformedData ;
      // transform data into report data 
      if(isRoleSuperAdmin()) {
        transformedData = transformReportData(allTasks);
        setSenarios(findScenarios(allTasks?.taskPerformed))
      } else {
        transformedData = transformReportData(orgTasks);
        setSenarios(findScenarios(orgTasks?.taskPerformed))
      }
      setTaskData(transformedData);
      setSenarios(findScenarios(orgTasks?.taskPerformed))
      setCsvData(csvContentGenerator(transformReportData(orgTasks), getSessionStorageData()?.role === 2 ? orgDetails?.name : searchParams.organization.name,'All', 'All', 'All', 'All', 'All'));
    }
    setLoading(false);
  },[orgDetails, orgTasks]);

  useEffect(() => {
    if (!searchParams.office.id) {
      // No need to filter if searchParams.office.id is falsy
      setLocations(orgLocationsData);
    } else {
      const locationsFilter = orgLocationsData.filter((location: ILocationResponse) => location.office_id === searchParams.office.id);
      setLocations(locationsFilter);
    }
  }, [searchParams.office.id]);


  useEffect(() => {
    if (!searchParams.location.id) {
      // No need to filter if searchParams.office.id is false
      const locationIds = locations.map((location:ILocationResponse) => location.id);
      const result: IDeviceResponse[] = locationIds.map((location:number ) => orgDeviceData.filter((device:IDeviceResponse) => location === device.location_id)).flat();
      setDeviceData(result);
    } else {
      const DeviceFilter = orgDeviceData.filter((device: IDeviceResponse) => device.location_id === searchParams.location.id);
      setDeviceData(DeviceFilter);
    }
  }, [searchParams.location, locations]);

  useEffect(() => {
    reportsDownload();
    setTypeOfDataDownloaded('Download')
  },[typeOfDataDownloaded])

  const searchHander = () => {

    if(isRoleSuperAdmin()){
      // filter by organization
      if(searchParams.organization.id){
        const orgFilterResult = transformReportData(filterTasksByOrgId(orgTasks, searchParams.organization.id));
        if(searchParams.scenario !== 'All'){
          const scenarioResult = transformReportData(filterByScenario(orgFilterResult, searchParams.scenario));

          if(scenarioResult.task.length <= 0) toast.error('Data not availabel'); 
  
          setCsvData(csvContentGenerator(transformReportData(scenarioResult), getSessionStorageData()?.role === 2 ? orgDetails?.name : searchParams.organization.name,searchParams.office.name, searchParams.location.name, searchParams.device.name, searchParams.user.email, searchParams.scenario));
          setTaskData(scenarioResult);
          return
        }
        if(orgFilterResult.task.length <= 0) toast.error('Data not availabel'); 
        setCsvData(csvContentGenerator(transformReportData(orgFilterResult), getSessionStorageData()?.role === 2 ? orgDetails?.name : searchParams.organization.name ,searchParams.office.name, searchParams.location.name, searchParams.device.name, searchParams.user.email, searchParams.scenario));
        setTaskData(orgFilterResult);
        return
      }else{
        const orgFilterResult = transformReportData(orgTasks);
        if(searchParams.scenario !== 'All'){
          const scenarioResult = transformReportData(filterByScenario(orgFilterResult, searchParams.scenario));

          if(scenarioResult.task.length <= 0) toast.error('Data not availabel'); 
  
          setCsvData(csvContentGenerator(transformReportData(scenarioResult), getSessionStorageData()?.role === 2 ? orgDetails?.name : searchParams.organization.name,searchParams.office.name, searchParams.location.name, searchParams.device.name, searchParams.user.email, searchParams.scenario));
          setTaskData(scenarioResult);
          return
        }
        if(orgFilterResult.task.length <= 0) toast.error('Data not availabel'); 
        setCsvData(csvContentGenerator(transformReportData(orgFilterResult), orgDetails?.name ? orgDetails?.name : '',searchParams.office.name, searchParams.location.name, searchParams.device.name, searchParams.user.email, searchParams.scenario));
        setTaskData(orgFilterResult);
        return
      }
    }

    if(searchParams.office.id){
        const officeResult = transformReportData(filterOnlyByOfficeId(orgTasks, searchParams.office, locations, deviceData));

        if(searchParams.location.id){
          const locationResult = transformReportData(filterOnlyByLocationId(officeResult, searchParams.location, deviceData));

          if(searchParams.device.id){
            const deviceResult = transformReportData(filterByDeviceId(locationResult, searchParams.device));
            
            if(searchParams.user.id){
              const userResult = transformReportData(filterByUserId(deviceResult, searchParams.user));

              if(searchParams.scenario !== 'All'){
                const scenarioResult = transformReportData(filterByScenario(userResult, searchParams.scenario));

                if(scenarioResult.task.length <= 0) toast.error('Data not availabel'); 
        
                setCsvData(csvContentGenerator(transformReportData(scenarioResult), orgDetails?.name ? orgDetails?.name : '',searchParams.office.name, searchParams.location.name, searchParams.device.name, searchParams.user.email, searchParams.scenario));
                setTaskData(scenarioResult);
                return
              }
              
              if(userResult.task.length <= 0) toast.error('Data not availabel'); 
        
              setCsvData(csvContentGenerator(transformReportData(userResult), orgDetails?.name ? orgDetails?.name : '',searchParams.office.name,searchParams.location.name, searchParams.device.name,searchParams.user.email, searchParams.scenario));
              setTaskData(userResult);
              return

            }else if(searchParams.scenario !== 'All'){
              const scenarioResult = transformReportData(filterByScenario(deviceResult, searchParams.scenario));
    
              if(scenarioResult.task.length <= 0) toast.error('Data not availabel'); 
      
              setCsvData(csvContentGenerator(transformReportData(scenarioResult), orgDetails?.name ? orgDetails?.name : '',searchParams.office.name, 'All', 'All', "All", searchParams.scenario));
              setTaskData(scenarioResult);
              return
            }
            if(deviceResult.task.length <= 0) toast.error('Data not availabel'); 
        
            setCsvData(csvContentGenerator(transformReportData(deviceResult), orgDetails?.name ? orgDetails?.name : '',searchParams.office.name, searchParams.location.name, searchParams.device.name, "All", searchParams.scenario));
            setTaskData(deviceResult);
            return
          } else if(searchParams.user.id){
            const userResult = transformReportData(filterByUserId(locationResult, searchParams.user));
  
            if(searchParams.scenario !== 'All'){
              const scenarioResult = transformReportData(filterByScenario(userResult, searchParams.scenario));
  
              if(scenarioResult.task.length <= 0) toast.error('Data not availabel'); 
      
              setCsvData(csvContentGenerator(transformReportData(scenarioResult), orgDetails?.name ? orgDetails?.name : '','All', 'All', 'All', "All", searchParams.scenario));
              setTaskData(scenarioResult);
              return
            }
            
            if(userResult.task.length <= 0) toast.error('Data not availabel'); 
      
            setCsvData(csvContentGenerator(transformReportData(userResult), orgDetails?.name ? orgDetails?.name : '','All', 'All', 'All', "All", searchParams.scenario));
            setTaskData(userResult);
            return
  
          }else if(searchParams.scenario !== 'All'){
            const scenarioResult = transformReportData(filterByScenario(locationResult, searchParams.scenario));
  
            if(scenarioResult.task.length <= 0) toast.error('Data not availabel'); 
    
            setCsvData(csvContentGenerator(transformReportData(scenarioResult), orgDetails?.name ? orgDetails?.name : '','All', 'All', 'All', "All", searchParams.scenario));
            setTaskData(scenarioResult);
            return
          }

          if(locationResult.task.length <= 0) toast.error('Data not availabel'); 
        
          setCsvData(csvContentGenerator(transformReportData(locationResult), orgDetails?.name ? orgDetails?.name : '',searchParams.office.name, searchParams.location.name, 'All', "All", searchParams.scenario));
          setTaskData(locationResult);
          return
        }else if(searchParams.device.id){
            const deviceResult = transformReportData(filterByDeviceId(officeResult, searchParams.device));
            
            if(searchParams.user.id){
              const userResult = transformReportData(filterByUserId(deviceResult, searchParams.user));

              if(searchParams.scenario !== 'All'){
                const scenarioResult = transformReportData(filterByScenario(userResult, searchParams.scenario));

                if(scenarioResult.task.length <= 0) toast.error('Data not availabel'); 
        
                setCsvData(csvContentGenerator(transformReportData(scenarioResult), orgDetails?.name ? orgDetails?.name : '',searchParams.office.name, 'All', searchParams.device.name, searchParams.user.email, searchParams.scenario));
                setTaskData(scenarioResult);
                return
              }
              
              if(userResult.task.length <= 0) toast.error('Data not availabel'); 
        
              setCsvData(csvContentGenerator(transformReportData(userResult), orgDetails?.name ? orgDetails?.name : '',searchParams.office.name, 'All', searchParams.device.name, searchParams.user.email, 'All'));
              setTaskData(userResult);
              return

            }else if(searchParams.scenario !== 'All'){
              const scenarioResult = transformReportData(filterByScenario(deviceResult, searchParams.scenario));
    
              if(scenarioResult.task.length <= 0) toast.error('Data not availabel'); 
      
              setCsvData(csvContentGenerator(transformReportData(scenarioResult), orgDetails?.name ? orgDetails?.name : '',searchParams.office.name, 'All', searchParams.device.name, "All", searchParams.scenario));
              setTaskData(scenarioResult);
              return
            }
            if(deviceResult.task.length <= 0) toast.error('Data not availabel'); 
        
            setCsvData(csvContentGenerator(transformReportData(deviceResult), orgDetails?.name ? orgDetails?.name : '',searchParams.office.name, 'All', searchParams.device.name, "All", 'All'));
            setTaskData(deviceResult);
            return
        }else if(searchParams.user.id){
          const userResult = transformReportData(filterByUserId(officeResult, searchParams.user));

          if(searchParams.scenario !== 'All'){
            const scenarioResult = transformReportData(filterByScenario(userResult, searchParams.scenario));

            if(scenarioResult.task.length <= 0) toast.error('Data not availabel'); 
    
            setCsvData(csvContentGenerator(transformReportData(scenarioResult), orgDetails?.name ? orgDetails?.name : '',searchParams.office.name, 'All', 'All', searchParams.user.email, searchParams.scenario));
            setTaskData(scenarioResult);
            return
          }
          
          if(userResult.task.length <= 0) toast.error('Data not availabel'); 
    
          setCsvData(csvContentGenerator(transformReportData(userResult), orgDetails?.name ? orgDetails?.name : '',searchParams.office.name, 'All', 'All', searchParams.user.email, 'All'));
          setTaskData(userResult);
          return

        }else if(searchParams.scenario !== 'All'){
          const scenarioResult = transformReportData(filterByScenario(officeResult, searchParams.scenario));

          if(scenarioResult.task.length <= 0) toast.error('Data not availabel'); 
  
          setCsvData(csvContentGenerator(transformReportData(scenarioResult), orgDetails?.name ? orgDetails?.name : '',searchParams.office.name, 'All', 'All', "All", searchParams.scenario));
          setTaskData(scenarioResult);
          return
        }

        if(officeResult.task.length <= 0) toast.error('Data not availabel'); 
      
        setCsvData(csvContentGenerator(transformReportData(officeResult), orgDetails?.name ? orgDetails?.name : '',searchParams.office.name, 'All', 'All', "All", 'All'));
        setTaskData(officeResult);
        return
    }else{
      const filterData = transformReportData(filterTasksByOrgId(orgTasks, orgDetails?.id));

      if(searchParams.location.id){
        const locationResult = transformReportData(filterOnlyByLocationId(filterData, searchParams.location, deviceData));

          if(searchParams.device.id){
            const deviceResult = transformReportData(filterByDeviceId(locationResult, searchParams.device));
            
            if(searchParams.user.id){
              const userResult = transformReportData(filterByUserId(deviceResult, searchParams.user));

              if(searchParams.scenario !== 'All'){
                const scenarioResult = transformReportData(filterByScenario(userResult, searchParams.scenario));

                if(scenarioResult.task.length <= 0) toast.error('Data not availabel'); 
        
                setCsvData(csvContentGenerator(transformReportData(scenarioResult), orgDetails?.name ? orgDetails?.name : '','All', 'All', searchParams.device.name, searchParams.user.email, searchParams.scenario));
                setTaskData(scenarioResult);
                return
              }
              
              if(userResult.task.length <= 0) toast.error('Data not availabel'); 
        
              setCsvData(csvContentGenerator(transformReportData(userResult), orgDetails?.name ? orgDetails?.name : '','All', 'All', searchParams.device.name, searchParams.user.email, searchParams.scenario));
              setTaskData(userResult);
              return

            }else if(searchParams.scenario !== 'All'){
              const scenarioResult = transformReportData(filterByScenario(deviceResult, searchParams.scenario));
      
              if(scenarioResult.task.length <= 0) toast.error('Data not availabel'); 
      
              setCsvData(csvContentGenerator(transformReportData(scenarioResult), orgDetails?.name ? orgDetails?.name : '','All', 'All', searchParams.device.name, "All", searchParams.scenario));
              setTaskData(scenarioResult);
              return
            }
            if(deviceResult.task.length <= 0) toast.error('Data not availabel'); 
        
            setCsvData(csvContentGenerator(transformReportData(deviceResult), orgDetails?.name ? orgDetails?.name : '','All', 'All', searchParams.device.name, "All", 'All'));
            setTaskData(deviceResult);
            return
          }else if(searchParams.user.id){
            const userResult = transformReportData(filterByUserId(locationResult, searchParams.user));
    
              if(searchParams.scenario !== 'All'){
                const scenarioResult = transformReportData(filterByScenario(userResult, searchParams.scenario));
    
                if(scenarioResult.task.length <= 0) toast.error('Data not availabel'); 
        
                setCsvData(csvContentGenerator(transformReportData(scenarioResult), orgDetails?.name ? orgDetails?.name : '','All', searchParams.location.name, 'All', searchParams.user.email, searchParams.scenario));
                setTaskData(scenarioResult);
                return
              }

              if(userResult.task.length <= 0) toast.error('Data not availabel'); 
        
                setCsvData(csvContentGenerator(transformReportData(userResult), orgDetails?.name ? orgDetails?.name : '','All', searchParams.location.name, 'All', searchParams.user.email, 'All'));
                setTaskData(userResult);
                return
          }else if(searchParams.scenario !== 'All'){
            const scenarioResult = transformReportData(filterByScenario(locationResult, searchParams.scenario));
    
            if(scenarioResult.task.length <= 0) toast.error('Data not availabel'); 
    
            setCsvData(csvContentGenerator(transformReportData(scenarioResult), orgDetails?.name ? orgDetails?.name : '','All', searchParams.location.name, 'All', "All", searchParams.scenario));
            setTaskData(scenarioResult);
            return
          }

          if(locationResult.task.length <= 0) toast.error('Data not availabel'); 
        
          setCsvData(csvContentGenerator(transformReportData(locationResult), orgDetails?.name ? orgDetails?.name : '','All', searchParams.location.name, 'All', "All", 'All'));
          setTaskData(locationResult);
          return
      }else if(searchParams.device.id){
        const deviceResult = transformReportData(filterByDeviceId(filterData, searchParams.device));
            
        if(searchParams.user.id){
          const userResult = transformReportData(filterByUserId(deviceResult, searchParams.user));

          if(searchParams.scenario !== 'All'){
            const scenarioResult = transformReportData(filterByScenario(userResult, searchParams.scenario));

            if(scenarioResult.task.length <= 0) toast.error('Data not availabel'); 
    
            setCsvData(csvContentGenerator(transformReportData(scenarioResult), orgDetails?.name ? orgDetails?.name : '','All', 'All', 'All', "All", searchParams.scenario));
            setTaskData(scenarioResult);
            return
          }
          
          if(userResult.task.length <= 0) toast.error('Data not availabel'); 
    
          setCsvData(csvContentGenerator(transformReportData(userResult), orgDetails?.name ? orgDetails?.name : '','All', 'All', 'All', "All", searchParams.scenario));
          setTaskData(userResult);
          return

        }else if(searchParams.scenario !== 'All'){
          const scenarioResult = transformReportData(filterByScenario(deviceResult, searchParams.scenario));
  
          if(scenarioResult.task.length <= 0) toast.error('Data not availabel'); 
  
          setCsvData(csvContentGenerator(transformReportData(scenarioResult), orgDetails?.name ? orgDetails?.name : '','All', 'All', 'All', "All", searchParams.scenario));
          setTaskData(scenarioResult);
          return
        }
        if(deviceResult.task.length <= 0) toast.error('Data not availabel'); 
    
        setCsvData(csvContentGenerator(transformReportData(deviceResult), orgDetails?.name ? orgDetails?.name : '','All', 'All', 'All', "All", searchParams.scenario));
        setTaskData(deviceResult);
        return
      }else if(searchParams.user.id){
        const userResult = transformReportData(filterByUserId(filterData, searchParams.user));

          if(searchParams.scenario !== 'All'){
            const scenarioResult = transformReportData(filterByScenario(userResult, searchParams.scenario));

            if(scenarioResult.task.length <= 0) toast.error('Data not availabel'); 
    
            setCsvData(csvContentGenerator(transformReportData(scenarioResult), orgDetails?.name ? orgDetails?.name : '','All', 'All', 'All', searchParams.user.email, searchParams.scenario));
            setTaskData(scenarioResult);
            return
          }

          if(userResult.task.length <= 0) toast.error('Data not availabel'); 
    
            setCsvData(csvContentGenerator(transformReportData(userResult), orgDetails?.name ? orgDetails?.name : '','All', 'All', 'All', searchParams.user.email, 'All'));
            setTaskData(userResult);
      }else if(searchParams.scenario !== 'All'){
        const scenarioResult = transformReportData(filterByScenario(filterData, searchParams.scenario));

        if(scenarioResult.task.length <= 0) toast.error('Data not availabel'); 

        setCsvData(csvContentGenerator(transformReportData(scenarioResult), orgDetails?.name ? orgDetails?.name : '','All', 'All', 'All', "All", searchParams.scenario));
        setTaskData(scenarioResult);
        return
      }
      if(filterData.task.length <= 0) toast.error('Data not availabel'); 
      
      setCsvData(csvContentGenerator(transformReportData(filterData), orgDetails?.name ? orgDetails?.name : '','All', 'All', 'All', "All", searchParams.scenario));
      setTaskData(filterData);
      return
    }
  };

  const PdfDownloadHandler = () => {
    const pdf =  new jsPDF();
    var img = new Image();
    img.src = medisimLogo;

    const orgName = `Organization Name: ${getSessionStorageData()?.role === 2 ? orgDetails?.name : searchParams.organization.name}`;
    const officeName = `Office Name: ${searchParams.office.name}`;
    const locationName = `Location Name: ${searchParams.location.name}`;
    const deviceName = `Device Name: ${searchParams.device.name}`;
    const Scenario = `Scenario: ${searchParams.scenario}`;

      const reportContent = 
      `Usage Counter: ${taskData.taskPerformed.length}
       Completion Rate:${taskData.completionRate.toFixed(2)+' %'}
       Avarage Usage:${taskData.averageUsage}
      `

    const tableHeaders: CellConfig[] = [
      {  name:'Id', prompt:'Id',align:'center', width:15, padding:0 },
      {  name:'Day', prompt:'Day',align:'center', width:38,padding:0 },
      {  name:'StartTime', prompt:'StartTime',align:'center', width:35,padding:0 },
      {  name:'EndTime', prompt:'EndTime',align:'center', width:35,padding:0 },
      {  name:'UsageTime', prompt:'UsageTime',align:'center', width:30,padding:0 },
      {  name:'Module', prompt:'Module',align:'center', width:30,padding:0 },
      {  name:'Scenario', prompt:'Scenario',align:'center', width:35,padding:0 },
      {  name:'Completion', prompt:'Completion',align:'center', width:35,padding:0 },
    ];

    const tableData = taskData.taskPerformed.map((item: ITaskPerformed, index: number) => {
      return { 
        Id:(index+1).toString(), 
        Day:dateFormatter(item.start_time), 
        StartTime: item.start_time.split('T')[1].slice(0,8), 
        EndTime: item.end_time.split('T')[1].slice(0,8), 
        UsageTime:  timeIntoSecORMin(item.start_time, item.end_time), 
        Module: item.model_id.toString(),
        Scenario: ScenarioName(item.scenario),
        Completion: item.complete.toString()
      }
    })

    pdf.addImage(img, 'JPEG', 10, 5, 35, 10);
    pdf.setFontSize(18);
    pdf.text('Report',100, 10, {renderingMode:'fill'},); // Adjust positioning as needed

    pdf.setFontSize(12);
    pdf.text(orgName,10, 30, {maxWidth: 200}); // Adjust positioning as needed
    pdf.text(officeName,10, 40, {maxWidth: 200}); // Adjust positioning as needed
    pdf.text(locationName,100, 40, {maxWidth: 200}); // Adjust positioning as needed
    pdf.text(deviceName,10, 45, {maxWidth: 200}); // Adjust positioning as needed
    pdf.text(Scenario,100, 45, {maxWidth: 200}); // Adjust positioning as needed
    pdf.text(reportContent,10, 55); // Adjust positioning as needed
    // pdf.printHeaderRow(1,false)
    pdf.table(10, 80, tableData, tableHeaders, { autoSize:false, /* fontSize:10, */ headerBackgroundColor:'#d2dfec'/* ,css: { "font-size": 0.5} */});
    pdf.save('medisimReport.pdf'); // Download the PDF
  }

  const reportsDownload =()=>{
    if (typeOfDataDownloaded == 'pdf') {  
      PdfDownloadHandler();
      setAnchorEl(null);
    }
    else if (typeOfDataDownloaded == 'csv'){  
      csvRef.current.link.click();
      setAnchorEl(null);
    }
  }

  return (
    <Stack gap={2} className='report'>
     
        {isRoleSuperAdmin() ?  
          (
            <>
                  <Paper sx={{padding:2, position:'relative'}} >
                      <Grid container columnSpacing={2}>
                          <Grid item xs={orgDetails?.is_qr ? 2 : 2.5}>
                             <FormControl fullWidth>
                               <label><Typography variant='h6'>Organization Email </Typography></label>
                               <select value={searchParams.organization.spoc_email} onChange={(e: any)=>{
                                 let org = allOrganizations.find((organization: any) => organization.spoc_email === e.target.value);
                                 if(org){
                                   setSearchParams({...searchParams, organization: org});
                                 }else{
                                   const org = {id: 0,  name: 'All',  spoc_email: "", on_boarding_date: ""};
                                   setSearchParams({...searchParams, organization: org})
                                  }
                               }}>
                                 <Typography component={'option'} value=''>All</Typography>
                                 {allOrganizations?.map((option: any) => <Typography component={'option'} key={option.id} value={option.spoc_email}>{option.spoc_email}</Typography>)}
                               </select>
                             </FormControl>
                        </Grid>
                        <Grid item xs={orgDetails?.is_qr ? 2 : 2.5}>
                           <FormControl fullWidth>
                             <label><Typography variant='h6'>Office Name </Typography></label>
                             <select  value={searchParams.office.name} onChange={(e: any)=>{
                               let office = orgOfficeData.find((office: any) => office.name === e.target.value);
                               if(office){
                                 const location = {id: 0, name: "All", office_id: 0,  on_boarding_date: ""};
                                 setSearchParams({...searchParams, office: office, location:location});
                               }else{
                                 const office = {id: 0,  name: 'All',  address: "", organization_id: 0, on_boarding_date: ""};
                                 setSearchParams({...searchParams, office: office})
                                }
                             }}>
                               <Typography component={'option'} value=''>All</Typography>
                               {orgOfficeData?.map((option: any) => <Typography component={'option'} key={option.id} value={option.name}>{option.name}</Typography>)}
                             </select>
                           </FormControl>
                        </Grid>
                        <Grid item xs={orgDetails?.is_qr ? 2 : 2.5}>
                           <FormControl fullWidth>
                             <label><Typography variant='h6'>Location Name </Typography></label>
                             <select  value={searchParams.location.name} onChange={(e: any)=> {
                               let location = locations.find((location: any) => location.name === e.target.value);
                               if(location){
                                 const device = {id: 0,name: "All", descr: "",location_id: 0,on_boarding_date: ""}
                                 setSearchParams({...searchParams, location: location, device:device})
                               }else{
                                 const location = {id: 0, name: "All", office_id: 0,  on_boarding_date: ""};
                                 setSearchParams({...searchParams, location: location})
                                }
                               }}>
                                 <Typography component={'option'} value=''>All</Typography>
                                 { locations?.map((option: any) => <Typography component={'option'} key={option.id} value={option.name}>{option.name}</Typography>)}
                             </select>
                           </FormControl>
                        </Grid>
                        <Grid item xs={orgDetails?.is_qr ? 2 : 2.5}>
                           <FormControl fullWidth>
                           <label><Typography variant='h6'>Device Name </Typography></label>
                             <select value={searchParams.device.name} onChange={(e: any)=> {
                                let device = deviceData.find((device: any) => device.name === e.target.value);
                                if(device){
                                  setSearchParams({...searchParams, device: device})
                                }else{
                                 const device = {id: 0,name: "All", descr: "",location_id: 0,on_boarding_date: ""}
                                 setSearchParams({...searchParams, device: device})
                                }
                               }}>
                               <Typography component={'option'}>All</Typography>
                               {deviceData?.map((option: any) => <Typography component={'option'} key={option.id} value={option.name} >{option.name}</Typography>)}
                             </select>
                           </FormControl>
                        </Grid>
                        {orgDetails?.is_qr && 
                          (
                             <Grid item md={2}>
                                <FormControl fullWidth>
                                <label><Typography variant='h6'>User Email </Typography></label>
                                  <select  value={searchParams.user.email} onChange={(e: any)=> {
                                       let user = users.find((user: any) => user.email === e.target.value);
                                       if(user){
                                         setSearchParams({...searchParams, user: user})
                                       }else{
                                        const user = {
                                          id: 0,
                                          organization_id: 7,
                                          code: 0,
                                          on_boarding_date: "",
                                          email: "All",
                                          fname: '',
                                          lname: '',
                                          phone: ""
                                      }
                                        setSearchParams({...searchParams, user: user})
                                       }
                                    }}
                                    // displayEmpty
                                    >
                                  <Typography component={'option'} value={'all'}>All</Typography>
                                  {users?.map((option: any) =><Typography component={'option'} key={option.id} value={option.email}>{option.email}</Typography>)}
                                  </select>
                                </FormControl>
                             </Grid>
                          )
                        }
                        <Grid item xs={orgDetails?.is_qr ? 2 : 2.5}>
                           <FormControl fullWidth>
                           <label><Typography variant='h6'><Typography></Typography>Scenario Name </Typography></label>
                             <select  value={searchParams.scenario} onChange={(e: any)=> {
                                  setSearchParams({...searchParams, scenario: e.target.value})
                               }}
                               >
                             <Typography component={'option'} value={'All'}>All</Typography>
                             {scenariosList?.map((option: any) => <Typography component={'option'} key={option.value} value={option.value}>{option.label}</Typography>)}
                             </select>
                           </FormControl>
                        </Grid>
                        <Grid item xs={1} display='flex' justifyContent='center' alignItems='center' mt={2}>
                          <Button variant='contained' sx={{ 
                            borderRadius:'20px', 
                            paddingX:'30px', 
                            paddingY:'5px', 
                            boxShadow:'none',
                            background:'linear-gradient(90deg, rgba(60,154,551,1) 0%, rgba(106,13,173,1) 100%)'}
                            }
                            onClick={searchHander}
                            >Search</Button>
                        </Grid>
                      </Grid>
           </Paper>
          </>
          ):null
        }
         {/*   the below Grid used for csv data download we do not remove   */}
          <Grid item xs={1} display='none' justifyContent='center' alignItems='center' mt={2} >
                <CSVLink ref={csvRef} data={csvData} filename={"report.csv"} style={{ textDecoration:'none', color:'#fff'}}>
                  CSV
                </CSVLink>
          </Grid>
        {/*   the Above Grid used for csv data download we do not remove   */}

      <Paper sx={{padding:2}}>
        <Box sx={{paddingX:2, paddingTop: 2}}>
          <Grid container spacing={2}>           
            <Grid item md={12} display='flex' justifyContent={'space-between'} gap={2}>
              {isRoleSuperAdmin() ?(<> <Box display='flex' gap={1}>
                <Typography color='#3b3b3b' fontWeight={600}>Organization:</Typography>
                <Typography  color='#7C7C7C'>{getSessionStorageData()?.role === 2 ? orgDetails?.name : searchParams.organization.name}</Typography> 
              </Box> </>): <Box display='flex' gap={1}></Box>}
             
              <Box display='flex' gap={1}>
                 <div>
                    <Button
                      id="fade-button"
                      aria-controls={open ? 'fade-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? true : undefined}
                      onClick={handleClick}   
                      endIcon={open ?  <MdOutlineExpandLess/> :<MdOutlineExpandMore/> }   
                      sx={{background:'linear-gradient(90deg, rgba(60,154,551,1) 0%, rgba(106,13,173,1) 100%)', color:'#fff'}}             
                    >
                      Download Report
                    </Button>
                    <Menu
                      id="fade-menu"
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      TransitionComponent={Fade}
                    >
                      <MenuItem sx={{px:1.2}} onClick={()=>setTypeOfDataDownloaded('pdf')}>Download as PDF</MenuItem>
                      <MenuItem sx={{px:1.2}} onClick={()=>setTypeOfDataDownloaded('csv')}> Download as CSV</MenuItem>                      
                    </Menu>
                  </div>
              </Box>
            </Grid>
            {isRoleSuperAdmin() ? (<> <Grid item md={12}>
              <Box display='flex' gap={1}>
                <Typography color='#3b3b3b' fontWeight={600}>Office:</Typography>
                <Typography  color='#7C7C7C'>{searchParams.office?.name}</Typography>
              </Box>
            </Grid>
            <Grid item md={12}>
              <Box display='flex' gap={1}>
                <Typography color='#3b3b3b' fontWeight={600}>Location:</Typography>
                <Typography  color='#7C7C7C'>{searchParams.location?.name}</Typography> 
              </Box>
            </Grid>
            <Grid item md={12}>
              <Box display='flex' gap={1}>
                <Typography color='#3b3b3b' fontWeight={600}>Device:</Typography>
                <Typography  color='#7C7C7C'>{searchParams.device?.name}</Typography> 
              </Box>
            </Grid></>) : null}
           
          </Grid>
        </Box>
        <Box>
        <Table sx={{ mt:4 }} aria-label="custom pagination table">
          <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography color='#7C7C7C'>Usage Counter</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                  <Typography  color='#7C7C7C'>{taskData.taskPerformed.length}</Typography> 
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography color='#7C7C7C'>Completion Rate</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                <Typography  color='#7C7C7C'>{taskData.completionRate.toFixed(2)} %</Typography></TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  <Typography color='#7C7C7C'>Average Usage</Typography>
                </TableCell>
                <TableCell style={{ width: '80%' }} align="left">
                <Typography  color='#7C7C7C'>{taskData.averageUsage}</Typography> 
                </TableCell>
              </TableRow>
          </TableBody>
        </Table>
        </Box>
        <Box sx={GridStyling}>
        <DataGrid 
          getRowId={(row)=> row.id} 
          rows={taskData.taskPerformed.length!==0 ? taskData.taskPerformed : [{id: 1, task_id: 1, model_id: '', complete: '', start_time: '', end_time: '', serial_id: 0, scenario: '', version : 0}] } 
          columns={columns} /* hideFooterPagination={true} hideFooter={true} */ 
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }} 
          pageSizeOptions={[10, 15, 20]}
          checkboxSelection={false}
          rowSelection={false}
        />
        </Box>
      </Paper>
      <Backdrop
        sx={{ color: '#fff', zIndex: 1}}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Stack >
  )
}

export default Reports