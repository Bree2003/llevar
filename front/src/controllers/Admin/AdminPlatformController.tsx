import { useEffect, useState } from "react";
import {
  UserModel,
  UserDataToModel,
  UsersDataToModel,
} from "models/Admin/usersModel";
import {
  DomainModel,
  DomainDataToModel,
  DomainsDataToModel,
} from "models/Admin/domainsModel";
import {
  PermissionModel,
  PermissionDataToModel,
  PermissionsDataToModel,
} from "models/Admin/permissionsModel";
import loadUsersData from "services/Admin/get-users-data";
import loadDomainsData from "services/Admin/get-domains-data";
import loadPermissionsData from "services/Admin/get-permissions-data";
import createDomainData from "services/Admin/create-domains-data";
import createPermissionData from "services/Admin/create-permissions-data";
import updateUserData from "services/Admin/update-users-data";
import updateDomainData from "services/Admin/update-domains-data";
import updatePermissionData from "services/Admin/update-permissions-data";
import AdminPlatformScreen from "screens/Admin/AdminPlatformScreen";


export interface EndpointStatus {
  loading?: boolean;
  error?: boolean;
};

export type EndpointName = "loadUsers" | "updateUser" | "loadDomains" | "updateDomain" | "loadPermissions" | "updatePermission" | "createDomain" | "createPermission";

export interface Model {
  users: UserModel[] | undefined;
  domains: DomainModel[] | undefined;
  permissions: PermissionModel[] | undefined;
  lastUpdate: Date | undefined;
};

const AdminPlatformController = () => {
  const [model, setModel] = useState<Partial<Model>>();
  const [endpoints, setEndpoints] = useState<Partial<Record<EndpointName, EndpointStatus>>>();

  useEffect(() => {
    loadUsers();
    loadDomains();
    loadPermissions();
  }, []);

  const updateModel = (
    partialModel:
      | Partial<Model>
      | ((model: Partial<Model> | undefined) => Partial<Model>)
  ) => {
    setModel((prev) => {
      const newModel =
        typeof partialModel === "function" ? partialModel(prev) : partialModel;
      return {
        ...prev,
        lastUpdate: new Date(),
        ...newModel,
      };
    });
  };

  const setEndpointStatus = (
    endpoint: EndpointName,
    status: Partial<EndpointStatus>
  ) => {
    setEndpoints((prev) => ({
      ...prev,
      [endpoint]: { ...prev?.[endpoint], ...status },
    }));
  };

  const buildStatusEndpoint = (name: EndpointName) => ({
    loading() { setEndpointStatus(name, { loading: true, error: false }); },
    error() { setEndpointStatus(name, { loading: false, error: true }); },
    done() { setEndpointStatus(name, { loading: false }); },
  });

  const loadUsers = async () => {
    const statusEndpoint = buildStatusEndpoint("loadUsers");
    try {
      statusEndpoint.loading();
      const response = await loadUsersData();
      const users = UsersDataToModel(response);
      updateModel({ users });
    } catch (e) {
      console.error("Error al cargar usuarios:", e);
      statusEndpoint.error();
      updateModel({ users: [] });
    } finally {
      statusEndpoint.done();
    }
  };

  const loadDomains = async () => {
    const statusEndpoint = buildStatusEndpoint("loadDomains");
    try {
      statusEndpoint.loading();
      const response = await loadDomainsData();
      const domains = DomainsDataToModel(response);
      updateModel({ domains });
    } catch (e) {
      console.error("Error al cargar dominios:", e);
      statusEndpoint.error();
      updateModel({ domains: [] });
    } finally {
      statusEndpoint.done();
    }
  };

  const loadPermissions = async () => {
    const statusEndpoint = buildStatusEndpoint("loadPermissions");
    try {
      statusEndpoint.loading();
      const response = await loadPermissionsData();
      const permissions = PermissionsDataToModel(response);
      updateModel({ permissions });
    } catch (e) {
      console.error("Error al cargar permisos:", e);
      statusEndpoint.error();
      updateModel({ permissions: [] });
    } finally {
      statusEndpoint.done();
    }
  };

  const updateUser = async (user: UserModel) => {
    const statusEndpoint = buildStatusEndpoint("updateUser");
    try {
      statusEndpoint.loading();
      const response = await updateUserData(user);
      const updatedUser = UserDataToModel(response);
      if (updatedUser) {
        const newUsers = model?.users?.map((u) => (u.oid === updatedUser.oid ? updatedUser : u));
        updateModel({ users: newUsers });
      }
    } catch (e) {
      console.error("Error al actualizar usuario:", e);
      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  const createDomain = async (domain: DomainModel) => {
    const statusEndpoint = buildStatusEndpoint("createDomain");
    try {
      statusEndpoint.loading();
      const response = await createDomainData(domain);
      const newDomain = DomainDataToModel(response);
      if (newDomain) {
        const newDomains = [...(model?.domains || []), newDomain];
        updateModel({ domains: newDomains });
      }
    } catch (e) {
      console.error("Error al crear dominio:", e);
      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  const createPermission = async (permission: PermissionModel) => {
    const statusEndpoint = buildStatusEndpoint("createPermission");
    try {
      statusEndpoint.loading();
      const response = await createPermissionData(permission);
      const newPermission = PermissionDataToModel(response);
      if (newPermission) {
        const newPermissions = [...(model?.permissions || []), newPermission];
        updateModel({ permissions: newPermissions });
      }
    } catch (e) {
      console.error("Error al crear permiso:", e);
      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  const updateDomain = async (domain: DomainModel) => {
    const statusEndpoint = buildStatusEndpoint("updateDomain");
    try {
      statusEndpoint.loading();
      const response = await updateDomainData(domain);
      const updatedDomain = DomainDataToModel(response);
      if (updatedDomain) {
        const newDomains = model?.domains?.map((d) => (d.id === updatedDomain.id ? updatedDomain : d));
        updateModel({ domains: newDomains });
      }
    } catch (e) {
      console.error("Error al actualizar dominio:", e);
      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  const updatePermission = async (permission: PermissionModel) => {
    const statusEndpoint = buildStatusEndpoint("updatePermission");
    try {
      statusEndpoint.loading();
      const response = await updatePermissionData(permission);
      const updatedPermission = PermissionDataToModel(response);
      if (updatedPermission) {
        const newPermissions = model?.permissions?.map((p) => (p.id === updatedPermission.id ? updatedPermission : p));
        updateModel({ permissions: newPermissions });
      }
    } catch (e) {
      console.error("Error al actualizar permiso:", e);
      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  return (
    <AdminPlatformScreen
      model={model}
      endpoints={endpoints}
      handleDomainCreate={createDomain}
      handlePermissionCreate={createPermission}
      handleUserUpdate={updateUser}
      handleDomainUpdate={updateDomain}
      handlePermissionUpdate={updatePermission}
    />
  );
};

export default AdminPlatformController;
