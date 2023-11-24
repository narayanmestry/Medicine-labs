import React, { Suspense, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AddEditOffice from '../components/AddEditOffice/AddEditOffice';
import AddEditLocation from '../components/AddEditLocation/AddEditLocation';
import AddEditDevice from '../components/AddEditDevice/AddEditDevice';
import MapDevice from '../components/MapDevice/MapDevice';

import LoginSignUp from '../pages/auth/LoginSignUp'
import PermanentDrawer from '../pages/layout/PermenantDrawer'
import Dashboard from '../pages/dashboard/Dashboard'
import Profile from '../pages/profile/Profile'
import Masters from '../pages/masters/Masters'
import Reports from '../pages/reports/Reports'
import PrivateRoute from '../components/private/PrivateRoute';
import SendCodeForm from '../pages/sendCodeForm/SendCodeForm';
import MasterList from '../pages/master-list/MasterList';
import EditOrganization from '../components/EditPanels/EditOrganization';
import EditOffice from '../components/EditPanels/EditOffice';
import EditLocation from '../components/EditPanels/EditLocation';
import EditDevice from '../components/EditPanels/EditDevice';
import EditModule from '../components/EditPanels/EditModule';
import DeviceTable from '../components/MasterList/DeviceTable';
import ModuleTable from '../components/MasterList/ModuleTable';
import OrganizationTable from '../components/MasterList/OrganizationTable';
import OfficeTable from '../components/MasterList/OfficeTable';
import LocationTable from '../components/MasterList/LocationTable';
import SuccessPage from '../pages/sendCodeForm/SuccessPage';


// const LoginSignUp = React.lazy(()=>import('../pages/auth/LoginSignUp'));
// const PermanentDrawer = React.lazy(()=>import('../pages/layout/PermenantDrawer'));
// const Dashboard = React.lazy(()=>import('../pages/dashboard/Dashboard'));
// const Profile = React.lazy(()=>import('../pages/profile/Profile'));
// const Masters = React.lazy(()=>import('../pages/masters/Masters'));
// const Reports = React.lazy(()=>import('../pages/reports/Reports'));

const AllRoutes = () => {
  return (
    // <Suspense fallback={<div>Loading...</div>} >
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path='medisimlabs' element={<PermanentDrawer />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='profile' element={<Profile />} />
          <Route path='masters' element={<Masters />}>
            <Route path='add-edit-office' element={<AddEditOffice />} />
            <Route path='add-edit-location' element={<AddEditLocation />} />
            <Route path='add-edit-device' element={<AddEditDevice />} />
            <Route path='map-device' element={<MapDevice />} />
          </Route>
          <Route path='reports' element={<Reports />} />
          <Route path='edit-organization' element={<EditOrganization />} />
          <Route path='edit-office' element={<EditOffice />} />
          <Route path='edit-location' element={<EditLocation />} />
          <Route path='edit-device' element={<EditDevice />} />
          <Route path='edit-module' element={<EditModule />} />
          <Route path='masters-list' element={<MasterList />}>
            <Route path='org-table' element={<OrganizationTable />} />
            <Route path='office-table' element={<OfficeTable />} />
            <Route path='location-table' element={<LocationTable />} />
            <Route path='device-table' element={<DeviceTable />} />
            <Route path='module-table' element={<ModuleTable />} />
          </Route>
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>
      <Route path='/' element={<LoginSignUp />} />
      <Route path='/send-code/:orgId' element={<SendCodeForm />} />
      <Route path='/success' element={<SuccessPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    // </Suspense>
  )
}

export default AllRoutes