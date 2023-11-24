import React, { ReactNode, useContext, useEffect, useState } from "react";
import { getAllDevice_api, getAllLocations_api, getAllModelsApi, 
  getAllOffice_api, getAllOrgs_api, getOrgDetails_api, 
  getSuperAdminDetails_api, getTaskByOrgId_api } from "../services/organizationApis";
import { filterDevices, filterLocation, filterOfficeByOrgId, filterTasksByOrgId, getSessionStorageData, isAuthenticated, isRoleSuperAdmin } from "../shared/helper";
import { IOfficeResponse } from "../interfaces/IOffice";
import { ILocationResponse } from "../interfaces/ILocation";
import { ModelsResponse } from "../interfaces/IModel";
import { UpdateQRContext } from "./OrgUpadateContext";

  type ContextProviderProps = {
    children: ReactNode;
  };

  interface IContext {
    orgDetails: any,
    allTasks: any,
    orgTasks: any,
    allOrganizations: any,
    allDevices: any,
    allOffices: any,
    allLocations: any,
    orgOfficeData: any,
    allModels: ModelsResponse[],
    orgLocationsData: any,
    orgDeviceData: any,
    getAllOrganization: ()=> void,
    getOrgDetails: ()=> void,
    getSuperAdminDetails: ()=> void,
    getAllTasks: ()=> void,
    getAllOffices: (orgId:number)=> void,
    getAllLocations: (officeData: IOfficeResponse[])=> void,
    getAllDevices: (locations: ILocationResponse[])=> void,
    signOut: ()=> void,
    callIsAuthorizedApis: ()=> void,
    getModels: () => void
  };
  
  const defaultValue = {} as IContext;

  export const MedisimContext = React.createContext(defaultValue);

  export function useOrganizationContext() {
    return useContext(MedisimContext);
  };

  function ContextProvider({ children }: ContextProviderProps) {
    const [orgDetails, setOrgDetails] = useState<any>(null);
    const [orgTasks, setOrgTasks] = useState<any>(null);
    const [allTasks, setAllTasks] = useState<any>(null);
    const [allOffices, setAllOffices] = useState<any>(null);
    const [allDevices, setAllDevices] = useState<any>(null);
    const [allModels, setModels] = useState<ModelsResponse[]>([]);
    const [allLocations, setAllLocations] = useState<any>(null);
    const [allOrganizations, setAllOrganizations] = useState<any>(null);
    const [orgOfficeData, setOfficeData] = useState<any>([]);
    const [orgLocationsData, setOrgLocationsData] = useState<any>([]);
    const [orgDeviceData, setOrgDeviceData] = useState<any>([]);
    const {update} = useContext(UpdateQRContext);

    useEffect(()=>{      
      if(isAuthenticated()){
        callIsAuthorizedApis();       
      }
    },[update]);


    useEffect(()=>{
      if(isAuthenticated() && isRoleSuperAdmin() && allOffices?.length > 0){
        getAllLocations(allOffices);
      }else if(isAuthenticated()) {
        getAllLocations(orgOfficeData);
      }
    },[orgOfficeData, allOffices]);

    useEffect(()=>{
      if(isAuthenticated() && isRoleSuperAdmin() && allLocations?.length > 0){
        getAllDevices(allLocations);
      }else if(isAuthenticated()) {
        getAllDevices(orgLocationsData);
      }
    },[orgLocationsData, allLocations]);

    const callIsAuthorizedApis = () => {
      getAllOrganization();
      getAllTasks();
      getModels();
      if(isRoleSuperAdmin()){
        getSuperAdminDetails();
      }else{
        getOrgDetails();
      }
      getAllOffices(getSessionStorageData()?.id);
    }

    // orgDetails API call
    async function getOrgDetails(){
      try {
        
        const response = await getOrgDetails_api(getSessionStorageData()?.id);
        if (response.data.success) {
          setOrgDetails(response.data.message[0])
        }
      } catch (error) {
        console.log(error);
      }
    };

    // orgDetails API call
    async function getSuperAdminDetails(){
      try {
        
        const response = await getSuperAdminDetails_api(getSessionStorageData()?.id);
        if (response.data.success) {
          setOrgDetails(response.data.message[0])
        }
      } catch (error) {
        console.log(error);
      }
    };

    // orgDetails API call
    async function getAllOrganization(){  
      try {
        const response = await getAllOrgs_api(getSessionStorageData()?.id);
        if (response.data.success) {
          // console.log(response.data.message);
          
          setAllOrganizations(response.data.message)
        }
      } catch (error) {
        console.log(error);
      }
    };

    // get all tasks and filter organization wise
    async function getAllTasks (){
      try {
          const response = await getTaskByOrgId_api(getSessionStorageData()?.id);
          if (response.data.success) {     
            let  organizationTasks;   
            setAllTasks(response.data.message);
            if(isRoleSuperAdmin()){
              organizationTasks = response.data.message;
            }else{
              organizationTasks = filterTasksByOrgId(response.data.message, getSessionStorageData()?.id);
            }
            
            setOrgTasks(organizationTasks);
          }
        } catch (error) {
          console.log(error);
        }
    };

    // get offices
    async function getAllOffices(orgId: number) {
      
      try {
        const response = await getAllOffice_api();
        if (response.data.success) {
          setAllOffices(response.data.message);
          let orgOffices; 
          if(isRoleSuperAdmin()){
            orgOffices = response.data.message;
          }else{
            orgOffices = filterOfficeByOrgId(response.data.message, orgId);
          }
          setOfficeData(orgOffices);
        }
      } catch (error) {
        console.log(error);
      }
    }

    // get locations
    async function getAllLocations(officeData: IOfficeResponse[]) {
      try {
        const response = await getAllLocations_api();
        if (response.data.success) {
          setAllLocations(response.data.message);
          const orgOffices = filterLocation(officeData, response.data.message);
          setOrgLocationsData(orgOffices);
          
          // setOfficeData(orgOffices);
        }
      } catch (error) {
        console.log(error);
      }
    }

    // get locations
    async function getAllDevices(locations: ILocationResponse[]) {
      try {
        const response = await getAllDevice_api();
        if (response.data.success) {
          setAllDevices(response.data.message)
          const orgDevices = filterDevices(locations, response.data.message);
          setOrgDeviceData(orgDevices);
        }
      } catch (error) {
        console.log(error);
      }
    }

    const getModels = async () => {
      try {
        const response = await getAllModelsApi();
        if(response.data.success){
          setModels(response.data.message)
        }
      } catch (error) {
        console.log(error);
      }
    }

    function cleanupData(){
      setOrgDetails(null);
      setOrgTasks(null);
      setOfficeData([]);
      setOrgLocationsData([]);
      setOrgDeviceData([]);
    }

    function signOut(){
      cleanupData();
      sessionStorage.clear();
    }

    const contextValues = {
      orgDetails,
      allTasks,
      allOrganizations,
      allDevices,
      allOffices,
      allLocations,
      orgTasks,
      orgOfficeData,
      orgLocationsData,
      orgDeviceData,
      allModels,
      getAllOrganization,
      getOrgDetails,
      getAllTasks,
      getAllOffices,
      getAllLocations,
      getAllDevices,
      signOut,
      callIsAuthorizedApis: callIsAuthorizedApis,
      getSuperAdminDetails,
      getModels
    }

    return (
        <MedisimContext.Provider value={contextValues}>
            {children}
        </MedisimContext.Provider>
    )
  };

  export { ContextProvider };