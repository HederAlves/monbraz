import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import BrowserAccessories from './components/accessories/BrowserAccessories';
import BrowserEmployees from './components/employees/BrowserEmployees';
import Layout from './components/layout/Layout';
import BrowserMaterials from './components/materials/BrowserMaterials';
import BrowserRawMaterials from './components/rawMaterials/BrowserRawMaterials';
import BrowserWorkOrders from './components/work-orders/BrowserWorkOrders';
import BrowserWorkTools from './components/work-tools/BrowserWorkTools';
import BrowserRegistrations from './components/registrations/BrowserRegistrations';
import ManageAccessories from './components/accessories/ManageAccessories';
import ManageEmployees from './components/employees/ManageEmployees';
import ManageMaterials from './components/materials/ManageMaterials';
import CreateWorkOrder from './components/work-orders/CreateWorkOrder';
import ManageRawMaterials from './components/rawMaterials/ManageRawMaterials';
import { theme } from './assets/styles/theme';
import ManageWorkTools from './components/work-tools/ManageWorkTools';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<CreateWorkOrder />} />
            <Route path="/accessories" element={<BrowserAccessories />} />
            <Route path="/employees" element={<BrowserEmployees />} />
            <Route path="/materials" element={<BrowserMaterials />} />
            <Route path="/rawMaterials" element={<BrowserRawMaterials />} />
            <Route path="/workOrders" element={<BrowserWorkOrders />} />
            <Route path="/workTools" element={<BrowserWorkTools />} />
            <Route path="/registrations" element={<BrowserRegistrations />} />
            <Route path="/manageAcessories" element={<ManageAccessories />} />
            <Route path="/manageEmployees" element={<ManageEmployees />} />
            <Route path="/manageMaterials" element={<ManageMaterials />} />
            <Route path="/manageRawMaterials" element={<ManageRawMaterials />} />
            <Route path="/createWorkOrder" element={<CreateWorkOrder />} />
            <Route path="/manageWorkTools" element={<ManageWorkTools />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
