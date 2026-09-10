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
} from "models/Global/domainsModel";
import {
  PermissionModel,
  PermissionDataToModel,
  PermissionsDataToModel,
} from "models/Admin/permissionsModel";
import {
  FaqModel,
  FaqDataToModel,
  FaqsDataToModel,
} from "models/Global/faqModel";
import {
  DictionaryModel,
  DictionaryDataToModel,
  DictionariesDataToModel
} from "models/Global/dictionaryModel";
import {
  BannerModel,
  BannerDataToModel,
  BannersDataToModel
} from "models/Global/bannerModel";
import loadUsersData from "services/Admin/get-users-data";
import loadDomainsData from "services/Global/get-domains-data";
import loadFaqData from "services/Global/get-faq-data";
import loadDictionaryData from "services/Global/get-dictionary-data";
import loadPermissionsData from "services/Admin/get-permissions-data";
import loadBannerData from "services/Global/get-banner-data";
import createDomainData from "services/Admin/create-domains-data";
import createPermissionData from "services/Admin/create-permissions-data";
import createFaqData from "services/Admin/create-faqs-data";
import createDictionaryData from "services/Admin/create-dictionaries-data";
import createBannerData from "services/Admin/create-banners-data";
import updateUserData from "services/Admin/update-users-data";
import updateDomainData from "services/Admin/update-domains-data";
import updateFaqData from "services/Admin/update-faqs-data";
import updateDictionaryData from "services/Admin/update-dictionaries-data";
import updatePermissionData from "services/Admin/update-permissions-data";
import updateBannerData from "services/Admin/update-banners-data";
import deleteUsersData from "services/Admin/delete-users-data";
import deleteFaqData from "services/Admin/delete-faqs-data";
import deleteDictionariesData from "services/Admin/delete-dictionaries-data";
import deleteBannerData from "services/Admin/delete-banners-data";
import AdminPlatformScreen from "screens/Admin/AdminPlatformScreen";


export interface EndpointStatus {
  loading?: boolean;
  error?: boolean;
};

export type EndpointName = 
  "loadUsers" |
  "loadDomains" |
  "loadPermissions" |
  "loadFaq" |
  "loadDictionary" |
  "loadBanner" |
  "createDomain" |
  "createPermission" |
  "createFaq" |
  "createDictionary" |
  "createBanner" |
  "updateUser" |
  "updateDomain" |
  "updatePermission" |
  "updateFaq" |
  "updateDictionary" |
  "updateBanner" |
  "deleteUser" |
  "deleteFaq" |
  "deleteDictionary" |
  "deleteBanner";

export interface Model {
  users: UserModel[] | undefined;
  domains: DomainModel[] | undefined;
  permissions: PermissionModel[] | undefined;
  faqs: FaqModel[] | undefined;
  dictionaries: DictionaryModel[] | undefined;
  banners: BannerModel[] | undefined;
  lastUpdate: Date | undefined;
};

const AdminPlatformController = () => {
  const [model, setModel] = useState<Partial<Model>>();
  const [endpoints, setEndpoints] = useState<Partial<Record<EndpointName, EndpointStatus>>>();

  useEffect(() => {
    loadUsers();
    loadDomains();
    loadPermissions();
    loadFaqs();
    loadDictionaries();
    loadBanners();
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

  const loadFaqs = async () => {
    const statusEndpoint = buildStatusEndpoint("loadFaq");
    try {
      statusEndpoint.loading();
      const response = await loadFaqData();
      const faqs = FaqsDataToModel(response);
      updateModel({ faqs });
    } catch (e) {
      console.error("Error al cargar faqs:", e);
      statusEndpoint.error();
      updateModel({ faqs: [] });
    } finally {
      statusEndpoint.done();
    }
  };

  const loadDictionaries = async () => {
    const statusEndpoint = buildStatusEndpoint("loadDictionary");
    try {
      statusEndpoint.loading();
      const response = await loadDictionaryData();
      const dictionaries = DictionariesDataToModel(response);
      updateModel({ dictionaries });
    } catch (e) {
      console.error("Error al cargar diccionarios:", e);
      statusEndpoint.error();
      updateModel({ dictionaries: [] });
    } finally {
      statusEndpoint.done();
    }
  };

  const loadBanners = async () => {
    const statusEndpoint = buildStatusEndpoint("loadBanner");
    try {
      statusEndpoint.loading();
      const response = await loadBannerData();
      const banners = BannersDataToModel(response);
      updateModel({ banners });
    } catch (e) {
      console.error("Error al cargar banners:", e);
      statusEndpoint.error();
      updateModel({ banners: [] });
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

  const createFaq = async (faq: FaqModel) => {
    const statusEndpoint = buildStatusEndpoint("createFaq");
    try {
      statusEndpoint.loading();
      const response = await createFaqData(faq);
      const newFaq = FaqDataToModel(response);
      if (newFaq) {
        const newFaqs = [...(model?.faqs || []), newFaq];
        updateModel({ faqs: newFaqs });
      }
    } catch (e) {
      console.error("Error al crear faq:", e);
      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  const createDictionary = async (dictionary: DictionaryModel) => {
    const statusEndpoint = buildStatusEndpoint("createDictionary");
    try {
      statusEndpoint.loading();
      const response = await createDictionaryData(dictionary);
      const newDictionary = DictionaryDataToModel(response);
      if (newDictionary) {
        const newDictionaries = [...(model?.dictionaries || []), newDictionary];
        updateModel({ dictionaries: newDictionaries });
      }
    } catch (e) {
      console.error("Error al crear diccionario:", e);
      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  const createBanner = async (banner: BannerModel, file: File, onProgress: (percent: number) => void) => {
    const statusEndpoint = buildStatusEndpoint("createBanner");
    try {
      statusEndpoint.loading();
      const response = await createBannerData(banner, file, onProgress);

      if (!response || response.status !== 201) {
        console.error("Error al crear banner:", response);
        statusEndpoint.error();
        return;
      }

      const success = response.data;
      const newBanner = BannerDataToModel(success);
      if(newBanner) {
        const newBanners = [...(model?.banners || []), newBanner];
        updateModel({ banners: newBanners });
        return;
      }
    } catch (e) {
      console.error("Error al crear diccionario:", e);
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

  const updateFaq = async (faq: FaqModel) => {
    const statusEndpoint = buildStatusEndpoint("updateFaq");
    try {
      statusEndpoint.loading();
      const response = await updateFaqData(faq);
      const updatedFaq = FaqDataToModel(response);
      if (updatedFaq) {
        const newFaqs = model?.faqs?.map((p) => (p.id === updatedFaq.id ? updatedFaq : p));
        updateModel({ faqs: newFaqs });
      }
    } catch (e) {
      console.error("Error al actualizar faq:", e);
      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  const updateDictionary = async (dictionary: DictionaryModel) => {
    const statusEndpoint = buildStatusEndpoint("updateDictionary");
    try {
      statusEndpoint.loading();
      const response = await updateDictionaryData(dictionary);
      const updatedDictionary = DictionaryDataToModel(response);
      if (updatedDictionary) {
        const newDictionaries = model?.dictionaries?.map((p) => (p.id === updatedDictionary.id ? updatedDictionary : p));
        updateModel({ dictionaries: newDictionaries });
      }
    } catch (e) {
      console.error("Error al actualizar diccionario:", e);
      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  const updateBanner = async (banner: BannerModel, file: File, onProgress: (percent: number) => void) => {
    const statusEndpoint = buildStatusEndpoint("updateBanner");
    try {
      statusEndpoint.loading();
      const response = await updateBannerData(banner, file, onProgress);

      if (!response || response.status !== 200) {
        console.error("Error al actualizar banner:", response);
        statusEndpoint.error();
        return;
      }

      const success = response.data;
      const updatedBanner = BannerDataToModel(success);
      if(updatedBanner) {
        const newBanners = model?.banners?.map((p) => (p.id === updatedBanner.id ? updatedBanner : p));
        updateModel({ banners: newBanners });
        return;
      }
    } catch (e) {
      console.error("Error al crear diccionario:", e);
      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  const deleteUser = async (user: UserModel) => {
    const statusEndpoint = buildStatusEndpoint("deleteUser");
    try {
      statusEndpoint.loading();
      const response = await deleteUsersData(user);
      if (response) {
        const newUsers = model?.users?.filter((p) => p.oid !== user.oid);
        updateModel({ users: newUsers });
      }
    } catch (e) {
      console.error("Error al eliminar usuario:", e);
      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  const deleteFaq = async (faq: FaqModel) => {
    const statusEndpoint = buildStatusEndpoint("deleteFaq");
    try {
      statusEndpoint.loading();
      const response = await deleteFaqData(faq);
      if (response) {
        const newFaqs = model?.faqs?.filter((f) => f.id !== faq.id);
        updateModel({ faqs: newFaqs });
      }
    } catch (e) {
      console.error("Error al eliminar faq:", e);
      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  const deleteDictionary = async (dictionary: DictionaryModel) => {
    const statusEndpoint = buildStatusEndpoint("deleteDictionary");
    try {
      statusEndpoint.loading();
      const response = await deleteDictionariesData(dictionary);
      if (response) {
        const newDictionaries = model?.dictionaries?.filter((p) => p.id !== dictionary.id);
        updateModel({ dictionaries: newDictionaries });
      }
    } catch (e) {
      console.error("Error al eliminar diccionario:", e);
      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  const deleteBanner = async (banner: BannerModel) => {
    const statusEndpoint = buildStatusEndpoint("deleteBanner");
    try {
      statusEndpoint.loading();
      const response = await deleteBannerData(banner);
      if (response) {
        const newBanners = model?.banners?.filter((b) => b.id !== banner.id);
        updateModel({ banners: newBanners });
      }
    } catch (e) {
      console.error("Error al eliminar banner:", e);
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
      handleFaqCreate={createFaq}
      handleDictionaryCreate={createDictionary}
      handleBannerCreate={createBanner}
      handleUserUpdate={updateUser}
      handleDomainUpdate={updateDomain}
      handlePermissionUpdate={updatePermission}
      handleFaqUpdate={updateFaq}
      handleDictionaryUpdate={updateDictionary}
      handleBannerUpdate={updateBanner}
      handleUserDelete={deleteUser}
      handleFaqDelete={deleteFaq}
      handleDictionaryDelete={deleteDictionary}
      handleBannerDelete={deleteBanner}
    />
  );
};

export default AdminPlatformController;
