import { SCENARIOS } from "../data/constants";
import {  IDeviceResponse } from "../interfaces/IDevice";
import { ILocationResponse } from "../interfaces/ILocation";
import { ModelsResponse } from "../interfaces/IModel";
import { IOfficeResponse } from "../interfaces/IOffice";
import { IOrganizationResponse } from "../interfaces/IOrgnization";
import { ICompletedInCompleted, ITask, ITaskPerformed, ITaskResponse, IUniqueMonths } from "../interfaces/ITaskDetails";
import { IUser, IUserResponse } from "../interfaces/IUser";

export const isAuthenticated = () => {
  const userDetails: any = JSON.parse(sessionStorage.getItem('userdetails')!);
  if(userDetails?.id) return true;
  else return false
}

export const getSessionStorageData = () => {
  const userDetails: any = JSON.parse(sessionStorage.getItem('userdetails')!);
  return userDetails;
}

// function for get time differrence between task start time and task end time
export const getTimeDifference = (date1: string, date2: string): number => {
  const timestamp1: any = new Date(date1);
  const timestamp2: any = new Date(date2);

  const timeDifferenceInSeconds = (timestamp2 - timestamp1) / 1000;
  const timeDifferenceInMinutes = timeDifferenceInSeconds / 60;
  return timeDifferenceInMinutes;
}

export const timeIntoSecORMin = (date1: string, date2: string): string => {
  
  const timestamp1: any = new Date(date1);
  const timestamp2: any = new Date(date2);

  let time = '';
  const timeDifferenceInSeconds = (timestamp2 - timestamp1) / 1000;
  
  if(timeDifferenceInSeconds < 60){
    time = timeDifferenceInSeconds + ' sec';
  }else {
    time = (Math.floor(timeDifferenceInSeconds / 60)) +'.'+(timeDifferenceInSeconds % 60) + ' min';
  }
  return time;
}

export const getAverageUsage = (date1: string, date2: string) => {
  const timestamp1: any = new Date(date1);
  const timestamp2: any = new Date(date2);

  const timeDifferenceInSeconds = (timestamp2 - timestamp1) / 1000;
   return timeDifferenceInSeconds
}

export const dateFormatter = (_date: string) => {
  if(!!_date){
    return _date.slice(0,10);
  }else return '';
  
}

// get completed and incompleted count of tasks function
export const getCompletedIncompletedCount = (data: ITaskPerformed[]): ICompletedInCompleted => {
  const counts = data?.reduce((total: {completed: number, incompleted: number}, task: ITaskPerformed) => {
      if(task.complete){
          total.completed += 1;
      } else {
          total.incompleted += 1;
      }
      return total;
  }, {completed: 0, incompleted: 0});

  return {completedCount: counts?.completed, incompletedCount: counts?.incompleted}
}

// get monthwise task data function
export const getMonthDetails = (orgTasks: ITaskResponse): IUniqueMonths => {
  const uniqueMonths: IUniqueMonths = {};

  orgTasks.taskPerformed?.forEach((task: ITaskPerformed) => {
    const newDate = new Date(task.start_time);
    const month = newDate.toLocaleString('default', { month: 'short' }); // get month from date
  
    if (!uniqueMonths[month]) {
      uniqueMonths[month] = {
        newdate: 0,
        completeCount: 0,
        incompleteCount: 0,
      };
    }
  
    uniqueMonths[month].newdate++;
    if (task.complete) {
      uniqueMonths[month].completeCount++;
    } else {
      uniqueMonths[month].incompleteCount++;
    }
  });
  
  return uniqueMonths;
};


// filter data based on task performed on date ( total usage and completions)
export const getDateWiseDetails = (data: any) => {
const dateCounts: IUniqueMonths = {};

data.forEach((task: any) => {
  const totalUsage_byDate = dateFormatter(task.start_time);
  if (!dateCounts[totalUsage_byDate]) {
    dateCounts[totalUsage_byDate] = {
      totalUsage_byDate: 0,
      completeCount: 0,
    };
  }

  dateCounts[totalUsage_byDate].totalUsage_byDate++;
  if (task.complete) {
    dateCounts[totalUsage_byDate].completeCount++;
  }
});

return dateCounts;
};


// report data
export const transformReportData = (taskData: ITaskResponse) => {
if (!taskData?.task?.length || !taskData?.taskPerformed.length) {
  return {
    task: [],
    taskPerformed: [],
    completedTask: 0,
    incompletedTask: 0,
    completionRate: 0,
    averageUsage: 0,
    dateWiseReportdata: [{ date: '', count: '', completed: '', id: 0 }],
  };
}

const { completedCount, incompletedCount } = getCompletedIncompletedCount(taskData.taskPerformed);
const completionRate = (100 * completedCount) / taskData.taskPerformed.length;

const totalUsage = taskData.taskPerformed.reduce((total: number, task: any) => {
  return total + getAverageUsage(task.start_time, task.end_time);
}, 0);

const averageUsage = totalUsage / taskData.taskPerformed.length;
let time = '';
if(Math.round(averageUsage) < 60){
  time = Math.round(averageUsage) + ' sec';
}else {
  time = (Math.floor(Math.round(averageUsage) / 60)) +'.'+(Math.round(averageUsage) % 60) + ' min';
}

const dateWiseReportData = getDateWiseDetails(taskData.taskPerformed);
const dateArr = Object.keys(dateWiseReportData).map((key, index) => {
  return { date: key, count: dateWiseReportData[key].totalUsage_byDate, completed: dateWiseReportData[key].completeCount, id: index + 1 };
});

return {
  ...taskData,
  completedTask: completedCount,
  incompletedTask: incompletedCount,
  completionRate,
  averageUsage: time,
  dateWiseReportdata: dateArr,
};
};


export const ScenarioName = (value: string | null) => {
  if(value === SCENARIOS.CPR_BLS_Garden){
    return 'CPR Garden'
  }else if(value === SCENARIOS.CPR_BLS_Garden_AED){
    return 'CPR AED Garden'
  }else if(value === SCENARIOS.CPR_BLS_AED){
    return 'CPR AED Office'
  }else if(value === SCENARIOS.CPR_BasicLifeSupport){
    return 'CPR Office'
  }
  return value
}


export const csvContentGenerator = (data: any, orgnization: string, office:string, location:string, device:string, user: string, scenario: any) => {
  let orgDetails = {orgnization: orgnization,
     office:office , 
     location: location , 
     device:device, 
     user: user,
     scenario ,
     TotalUsage: data.taskPerformed.length, 
     CompletionRate: data.completionRate + '%', 
     AvarageUsage: data.averageUsage};
    
  const csvContent = [
    `Organization Details`,
    `Organization Name,${orgDetails.orgnization.toString().replace(/,/g, '-')}`,
    `Office Name,${orgDetails.office.toString().replace(/,/g, '-')}`,
    `Location Name,${orgDetails.location.toString().replace(/,/g, '-')}`,
    `Device Name,${orgDetails.device.toString().replace(/,/g, '-')}`,
    `User Name,${orgDetails.user}`,
    `Scenario Name,${scenario}`,
    '',
    'Over-all Report',
    `Total Usage Count,${orgDetails.TotalUsage}`,
    `Completion Rate,${orgDetails.CompletionRate}`,
    `Average Usage in min,${orgDetails.AvarageUsage}`,
    '',
    'Task details',
    'Sr No,Day, Start Time, End Time, Usage Time,Module,Scenario,Completion',
    ...data.taskPerformed.map((item: ITaskPerformed, index: number) => `${index+1},${dateFormatter(item.start_time)},${item.start_time ? item.start_time.split('T')[1].slice(0,8) : ''},${item.end_time ? item.end_time.split('T')[1].slice(0,8) : ''},${timeIntoSecORMin(item.start_time, item.end_time)},${item.model_id},${ScenarioName(item.scenario)},${item.complete}`)].join('\n');

 return csvContent;
};

// filter tasks by orgnization completed
export const filterTasksByOrgId = (tasksObj: ITaskResponse, orgId: number): any => {
  
  if (!orgId) return { tasks: [], taskPerformed: [] };

  const returnTask = Array.isArray(tasksObj?.task) ? tasksObj.task.filter((task: any) => task.organization_id === orgId) : [];

  const returnTaskPerformed = Array.isArray(tasksObj?.taskPerformed)
    ? returnTask.flatMap((task: any) => tasksObj.taskPerformed.filter((taskPerformed: any) => taskPerformed.task_id === task.id))
    : [];
    
    
    function sortByStartTimeDescending(arr:any) {
      return arr.slice().sort((a:any, b:any) => {
        const startTimeA = new Date(a.start_time).getTime();
        const startTimeB = new Date(b.start_time).getTime();
    
        if (startTimeA < startTimeB) {
          return 1;
        }
        if (startTimeA > startTimeB) {
          return -1;
        }
        return 0;
      });
    }
    const sortedData = sortByStartTimeDescending(returnTaskPerformed);

  return { task: returnTask, taskPerformed: sortedData };
  };

  // filter offices by orgI
  export const filterOfficeByOrgId = (officeData:IOfficeResponse[], orgId: number): IOfficeResponse[] => {
    const result = officeData.filter((office: IOfficeResponse) => office.organization_id === orgId);
    return result
  }


// find by Scenario completed
export const findScenarios = (taskPerformed: ITaskPerformed[]) => {
  const uniqueScenarios = new Set();
  
  taskPerformed?.forEach((task: ITaskPerformed) => {
    if (task.scenario) {
      uniqueScenarios.add(task.scenario);
    }
  });
  
  return Array.from(uniqueScenarios) as String[];
};


// filter by Scenario completed
export const filterByScenario = (tasksObje: ITaskResponse, scenario: string) => {
  const filteredTasksPerformed = tasksObje.taskPerformed.filter((task: any) => task.scenario === scenario);
  const filteredTaskIds = filteredTasksPerformed.map((task: any) => task.task_id);

  const filteredTasks = tasksObje.task.filter((task: any) => filteredTaskIds.includes(task.id));

  return transformReportData({ task: filteredTasks, taskPerformed: filteredTasksPerformed });
};

// filter devices under org
export const filterDevices = (locations: ILocationResponse[], devices:IDeviceResponse[]) => {
  if(locations.length === 0 || devices.length === 0) return [];
  
  const filteredDevices = locations.map((location: ILocationResponse) => devices.filter((device:IDeviceResponse) => device.location_id === location.id)).flat();
  return filteredDevices
}

// filter by device ID completed
export const filterByDeviceId = (tasksObj: ITaskResponse, device: IDeviceResponse) => {
if (!tasksObj?.task || !tasksObj?.taskPerformed) {
  return {
    task: [],
    taskPerformed: [],
    completedTask: 0,
    incompletedTask: 0,
    completionRate: 0,
    averageUasage: 0,
    dateWiseReportdata: []
  };
}

const filteredTasks = tasksObj.task.filter((task: any) => task.device_id === device.id);

const filteredTaskIds = filteredTasks.map((task: any) => task.id);
const filteredTaskPerformed = tasksObj.taskPerformed.filter((task: any) => filteredTaskIds.includes(task.task_id));

return transformReportData({ task: filteredTasks, taskPerformed: filteredTaskPerformed });
};

// filter locations under org
export const filterLocation = (offices: IOfficeResponse[], locations: ILocationResponse[]) => {
  if(locations.length === 0 || offices.length === 0) return [];
  
  const filteredLocations = offices.map((office: IOfficeResponse) => locations.filter((location:ILocationResponse) => location.office_id === office.id)).flat();
  return filteredLocations
}

// filter by location ID completed
export const filterByLocationId = (tasksObj: ITaskResponse, location: ILocationResponse, device: IDeviceResponse) => {
if (!device || device.location_id !== location.id || !tasksObj?.task || !tasksObj?.taskPerformed) {
  return {
    task: [],
    taskPerformed: [],
    completedTask: 0,
    incompletedTask: 0,
    completionRate: 0,
    averageUasage: 0,
    dateWiseReportdata: []
  };
}

const filteredTasks = tasksObj.task.filter((task: any) => task.device_id === device.id);

const filteredTaskIds = filteredTasks.map((task: any) => task.id);
const filteredTaskPerformed = tasksObj.taskPerformed.filter((task: any) => filteredTaskIds.includes(task.task_id));

return transformReportData({ task: filteredTasks, taskPerformed: filteredTaskPerformed });
};

// filter task by only location
export const filterOnlyByLocationId = (tasksObj: ITaskResponse, location: ILocationResponse, devices: IDeviceResponse[]) => {

  const filteredDevicesIdFromTask = tasksObj.task.map((task:ITask) => task.device_id);
  const uniqueDeviceIds = Array.from(new Set(filteredDevicesIdFromTask)) as number[];
  
  const filteredDevices = uniqueDeviceIds.map((uniqueDevice:number) => devices.filter((device: IDeviceResponse) => device.id === uniqueDevice)).flat();

  const filteredTaskResult = filteredDevices.map((device:IDeviceResponse) => tasksObj.task.filter((task:ITask) =>  task.device_id === device.id)).flat();
  
  const filteredTaskPerformedResult =  filteredTaskResult.map((task:ITask) => tasksObj.taskPerformed.filter((taskPerformed:ITaskPerformed) => taskPerformed.task_id === task.id)).flat();

  return {task: filteredTaskResult, taskPerformed: filteredTaskPerformedResult}

  };

  // filter task by only location
export const filterOnlyByOfficeId = (tasksObj: ITaskResponse, office: IOfficeResponse, locations:ILocationResponse[], devices:IDeviceResponse[]) => {

  const filteredDevicesIdFromTask = Array.from(new Set(tasksObj.task.map((task:ITask) => task.device_id))) as number[];

  const filteredDevices = filteredDevicesIdFromTask.map((uniqueDevice:number) => devices.filter((device: IDeviceResponse) => device.id === uniqueDevice)).flat();

  const filteredDeviceByLocation = locations.map((location:ILocationResponse) => filteredDevices.filter((device:IDeviceResponse) => device.location_id === location.id)).flat();
  
  const filteredTaskResult = filteredDeviceByLocation.map((device:IDeviceResponse) => tasksObj.task.filter((task:ITask) =>  task.device_id === device.id)).flat();
  
  const filteredTaskPerformedResult =  filteredTaskResult.map((task:ITask) => tasksObj.taskPerformed.filter((taskPerformed:ITaskPerformed) => taskPerformed.task_id === task.id)).flat();

  return {task: filteredTaskResult, taskPerformed: filteredTaskPerformedResult}

  };


// filter by office ID completed
export const filterByOfficeId = (tasksObj: ITaskResponse, office: IOfficeResponse, orgDetails: any, location?: ILocationResponse, device?: IDeviceResponse) => {
if (orgDetails?.id !== office.organization_id || (location && office.id !== location.office_id) || (device && location?.id !== device.location_id)) {
  return {
    task: [],
    taskPerformed: [],
    completedTask: 0,
    incompletedTask: 0,
    completionRate: 0,
    averageUasage: 0,
    dateWiseReportdata: []
  };
}

if (orgDetails.id) {
  return tasksObj;
}

const filteredTasks = tasksObj.task.filter((task: any) => task.device_id === device?.id);

const filteredTaskIds = filteredTasks.map((task: any) => task.id);
const filteredTaskPerformed = tasksObj.taskPerformed.filter((task: any) => filteredTaskIds.includes(task.task_id));

return transformReportData({ task: filteredTasks, taskPerformed: filteredTaskPerformed });
};

// filter by user Id function
export const filterByUserId = (tasksObj: ITaskResponse, user: IUser) => {
  if(!tasksObj?.task || !tasksObj?.taskPerformed || !user.id){
    return {
      task: [],
      taskPerformed: [],
      completedTask: 0,
      incompletedTask: 0,
      completionRate: 0,
      averageUasage: 0,
      dateWiseReportdata: []
    }
  }

  const filteredTasks = tasksObj.task.filter((task: any) => task.user_id === user.id);

  const filteredTaskIds = filteredTasks.map((task: any) => task.id);
  const filteredTaskPerformed = tasksObj.taskPerformed.filter((task: any) => filteredTaskIds.includes(task.task_id));

  return transformReportData({ task: filteredTasks, taskPerformed: filteredTaskPerformed });

}

// get locations tasks and filter completed
export const filterDeviceFromTaskPreformed = (orgTasks: ITaskResponse, devices: IDeviceResponse[], locations: ILocationResponse[]) => {
  const result: IUniqueMonths = {};

  orgTasks.task?.forEach((task: ITask) => {
    const device = devices?.find((device: IDeviceResponse) => device.id === task.device_id);
    
    if (device) {
      const taskPerformed = orgTasks.taskPerformed.filter((_task: ITaskPerformed) => _task.task_id === task.id).flat();

      taskPerformed.map((task: ITaskPerformed) => {
        const location = locations.find((location: ILocationResponse) => location.id === device.location_id);
  
        const name: string | undefined = location?.name;
        if(name){
          if (result[name]) {
            result[name].push(task);
          } else {
            result[name] = [task];
          }
        }
      })
      
    }
  });

return result;
};

// Check user Session
export const fineModelById = (id: number, models:ModelsResponse[]) => {
      const modelName = models.find((model: ModelsResponse) => model.id === id)?.name;
      if(modelName) return modelName
      else return ''
}

// check login role
export const isRoleSuperAdmin = () => {
  const role = getSessionStorageData()?.role;
  if(role === 1) return true
  else return false
} 

export const isRoleAdmin = () => {
  const role = getSessionStorageData()?.role;
  if(role === 2) return true
  else return false
} 

// get entitlement name by Id

export const getEntitlementNameById = (id:number, models: ModelsResponse[]) =>{
  const model: any = models.find((_model:ModelsResponse) => _model.id === id)?.name;
  return model ? model : '-'
}

//get office name by id

export const getOfficeNameById = (id:number, offices: IOfficeResponse[]) => {
  const Office : string | undefined = offices?.find((_office:IOfficeResponse)=> _office.id === id)?.name;
  return Office ? Office : id
}

//get location name by location id

export const getLocationNameById = (id:number, locations: ILocationResponse[]) => {
  const location : string | undefined = locations?.find((_location:ILocationResponse)=> _location.id == id)?.name;
  return location ? location : id
}

export const getOrganizationNameById = (id:number, organizations: IOrganizationResponse[]) => {
  const location : string | undefined = organizations?.find((organization:IOrganizationResponse)=> organization.id == id)?.name;
  return location ? location : id
}

export const  sliceStrings = (array:any) => {
  // loop through the array elements
  for (let i = 0; i < array.length; i++) {
    // check if the element is a string
    if (typeof array[i] === "string") {
      // slice the string for the first 15 characters
      array[i] = array[i].slice(0, 15);
    }
  }
  // return the modified array
  return array;
}
