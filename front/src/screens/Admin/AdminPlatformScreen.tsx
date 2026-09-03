import { useState } from 'react';
import {
  Model,
  EndpointStatus,
  EndpointName
} from 'controllers/Admin/AdminPlatformController';
import { UserModel } from "models/Admin/usersModel";
import { DomainModel } from "models/Admin/domainsModel";
import { PermissionModel } from "models/Admin/permissionsModel";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import UserAdminTable from 'components/Tables/UserAdminTable';
import DomainAdminTable from 'components/Tables/DomainAdminTable';
import PermissionAdminTable from 'components/Tables/PermissionAdminTable';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      tabIndex={0}
      id={`platform-tabpanel-${index}`}
      aria-labelledby={`platform-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

function tabProps(index: number) {
  return {
    id: `platform-tab-${index}`,
    'aria-controls': `platform-tabpanel-${index}`,
  };
};

const AdminPlatformScreen = ({
  model,
  endpoints,
  handleUserUpdate,
  handleDomainUpdate,
  handlePermissionUpdate
}: {
  model: Partial<Model> | undefined;
  endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;
  handleUserUpdate: (user: UserModel) => void;
  handleDomainUpdate: (domain: DomainModel) => void;
  handlePermissionUpdate: (permission: PermissionModel) => void;
}) => {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <main className="flex flex-col items-start w-full min-h-full bg-gray-50 text-left py-6 md:py-8">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <section className="w-full">
          <h1
            className="
            text-3xl
            md:text-4xl
            xl:text-5xl
            font-bold
            text-[--color-accent]
          "
          >
            Gestión de Plataforma
          </h1>

          {/* Descripción */}
          <div
            className="
            mt-4
            md:mt-6
            flex
            flex-col
            lg:flex-row
            lg:items-end
            lg:justify-between
            gap-5
            lg:gap-8
          "
          >
            <p
              className="
              text-base
              md:text-lg
              font-medium
              max-w-4xl
              text-[--color-text-secondary]
            "
            >
              Aquí puedes agregar, editar y deshabilitar dominios, permisos y usuarios.
            </p>
          </div>
        </section>

        {/* Tabla */}
        <section className="w-full mt-6 md:mt-8">
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="platform admin tabs">
                <Tab label="Usuarios" {...tabProps(0)} />
                <Tab label="Dominios" {...tabProps(1)} />
                <Tab label="Permisos" {...tabProps(2)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <UserAdminTable
                userData={model?.users}
                isLoading={endpoints?.loadUsers?.loading}
                handleUserUpdate={handleUserUpdate}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <DomainAdminTable
                domainData={model?.domains}
                isLoading={endpoints?.loadDomains?.loading}
                handleDomainUpdate={handleDomainUpdate}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <PermissionAdminTable
                permissionData={model?.permissions}
                isLoading={endpoints?.loadPermissions?.loading}
                handlePermissionUpdate={handlePermissionUpdate}
              />
            </TabPanel>
          </Box>
        </section>
      </div>
    </main>
  )
};

export default AdminPlatformScreen;
