
import { isRoleSuperAdmin } from "../shared/helper";
import { usersRoute, locationRoute, loginRoute, officeRoute, organizationRoute, taskRoute, deviceRoute, createUserRoute, superAdminLoginRoute, modelRoute, superAdminRoute } from "../utils/api.routes";
import apis from "./api";

export const login_api = async(data: any) => {
    try {
        const response = await apis.loginInstance.post(`${loginRoute}`, JSON.stringify(data));
        return response;
    } catch (error) {
        throw error;
    }
};

export const superAdminLogin_api = async(data: any) => {
    try {
        const response = await apis.publicInstance.post(`${superAdminLoginRoute}`, JSON.stringify(data));
        return response;
    } catch (error) {
        throw error;
    }
};

export const logout_api = async(data: any) => {
    try {
        const response = await apis.privateInstance.post(`/api/logout`, JSON.stringify(data));
        return response;
    } catch (error) {
        throw error;
    }
};

export const resetToken_api = async(data: any) => {
    try {
        const response = await apis.loginInstance.post(`reset-token`, JSON.stringify(data));
        return response;
    } catch (error) {
        throw error;
    }
};

export const addOrganization_api = async(data: any) => {
  try {
    const response = await apis.privateInstance.post(`${organizationRoute}/`, JSON.stringify(data));
    return response;
  } catch (error) {
      throw error;
  }
}

export const deleteOrganizationById_api = async(id: number) => {
  try {
    const response = await apis.privateInstance.delete(`${organizationRoute}/${id}`);
    return response;
  } catch (error) {
      throw error;
  }
}

export const getOrgDetails_api = async(orgId: number) => {
  try {
    const response = await apis.privateInstance.get(`${organizationRoute}/${orgId}`);
    return response;
  } catch (error) {
      throw error;
  }
}

export const getSuperAdminDetails_api = async(id: number) => {
  try {
    const response = await apis.privateInstance.get(`/admin${superAdminRoute}?id=${id}`);
    return response;
  } catch (error) {
      throw error;
  }
}

// get all locations
export const getAllLocations_api = async() => {
    try {
      const response = await apis.privateInstance.get(`${locationRoute}`);
        return response;
    } catch (error) {
      throw error
    }
  };

  // get all offices
export const getAllOffice_api = async() => {
  try {
    const response = await apis.privateInstance.get(`${officeRoute}`);
    return response;
  } catch (error) {
    throw error
  }
};

// get all devices
export const getAllDevice_api = async() => {
    try {
      const response = await apis.privateInstance.get(`${deviceRoute}`);
      return response
    } catch (error) {
        throw error
    }
  };

  // get all org tasks
export const getTaskByOrgId_api = async(super_admin_id:string) => {
    try {
      let filter = "";
      // if(isRoleSuperAdmin()){
      //   filter = `?allTask=true&super_admin_id=${super_admin_id}`
      // }
        const response = await apis.privateInstance.get(`${taskRoute}${filter}`,);
        return response
      // }
    } catch (error) {
      throw error
    }
}


// get all organizations details
export const getAllOrgs_api = async(query: string) => {
    try {
      // ?super_admin_id=${query} for filter using super_admin_id
      const response = await apis.privateInstance.get(`${organizationRoute}`);
      return response
    } catch (error) {
        throw error
    }
  }

  // add office
export const addOffice_api = async(data: any) => {
    try {
      const response = await apis.privateInstance.post(`${officeRoute}`, JSON.stringify(data));
      return response;
    } catch (error) {
      throw error;
    }
}

export const editOffice_api = async(data: any, params: number) => {
  try {
    const response = await apis.privateInstance.put(`${officeRoute}/${params}`, JSON.stringify(data));
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteOfficeById_api = async(id: number) => {
  try {
    const response = await apis.privateInstance.delete(`${officeRoute}/${id}`);
    return response;
  } catch (error) {
      throw error;
  }
}

  // add location
export const addLocation_api = async(data: any) => {
    try {
      const response = await apis.privateInstance.post(`${locationRoute}`, JSON.stringify(data));
      return response;
    } catch (error) {
      throw error;
    }
}

export const editLocation_api = async(data: any, params: any) => {
  try {
    const response = await apis.privateInstance.put(`${locationRoute}/${params}`, JSON.stringify(data));
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteLocationById_api = async(id: number) => {
  try {
    const response = await apis.privateInstance.delete(`${locationRoute}/${id}`);
    return response;
  } catch (error) {
      throw error;
  }
}

  // add location
export const addDevice_api = async(data: any) => {
    try {
      const response = await apis.privateInstance.post(`${deviceRoute}`, JSON.stringify(data));
      return response;
    } catch (error) {
      throw error;
    }
}

export const editDevice_api = async(data: any, params: any) => {
  try {
    const response = await apis.privateInstance.put(`${deviceRoute}/${params}`, JSON.stringify(data));
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteDeviceById_api = async(id: number) => {
  try {
    const response = await apis.privateInstance.delete(`${deviceRoute}/${id}`);
    return response;
  } catch (error) {
      throw error;
  }
}

export const editModule_api = async(data: any, params: any) => {
  try {
    const response = await apis.privateInstance.put(`/admin/${modelRoute}/${params}`, JSON.stringify(data));
    return response;
  } catch (error) {
    throw error;
  }
}

export const verifyEmail_api = async(data: any) => {
  try {
    const response = await apis.loginInstance.post(`${createUserRoute}`, JSON.stringify(data));
    return response;
  } catch (error) {
    throw error;
  }
}

export const generateQrCode_api = async(data: any) => {
  try {
    const response = await apis.privateInstance.post(`${deviceRoute}/${organizationRoute}`, JSON.stringify(data));
    return response;
  } catch (error) {
    throw error;
  }
}

export const updateOrganization = async(data: any, orgId: number) => {
  try {
    const response = await apis.privateInstance.put(`${organizationRoute}/${orgId}`, JSON.stringify(data));
    return response;
  } catch (error) {
    throw error;
  }
}

export const getOrgUsersApi = async(orgId: number = 0) => {
  try {
    const filter = `orgId=${orgId}`;
    const response = await apis.privateInstance.get(`${organizationRoute}/${usersRoute}?${filter}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export const addModelApi =async (data:any) => {
  try {
    const response = await apis.privateInstance.post(`/admin/${modelRoute}`, JSON.stringify(data));
    return response;
  } catch (error) {
    throw error;
  }
}

export const getAllModelsApi = async() => {
  try {
    const response = await apis.privateInstance.get(`/admin/${modelRoute}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteModuleById_api = async(id: number) => {
  try {
    const response = await apis.privateInstance.delete(`/admin/${modelRoute}/${id}`);
    return response;
  } catch (error) {
      throw error;
  }
}

