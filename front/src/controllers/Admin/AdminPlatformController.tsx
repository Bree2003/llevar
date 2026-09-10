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
  DictionariesDataToModel,
} from "models/Global/dictionaryModel";

import {
  BannerModel,
  BannerDataToModel,
  BannersDataToModel,
} from "models/Global/bannerModel";

import { LinksModel, LinksDataToModel } from "models/Global/linksModel";

import loadUsersData from "services/Admin/get-users-data";
import loadDomainsData from "services/Global/get-domains-data";
import loadFaqData from "services/Global/get-faq-data";
import loadDictionaryData from "services/Global/get-dictionary-data";
import loadPermissionsData from "services/Admin/get-permissions-data";
import loadBannerData from "services/Global/get-banner-data";
import loadLinksData from "services/Global/get-links-data";

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
import updateLinksData from "services/Admin/update-links-data";

import deleteUsersData from "services/Admin/delete-users-data";
import deleteFaqData from "services/Admin/delete-faqs-data";
import deleteDictionariesData from "services/Admin/delete-dictionaries-data";
import deleteBannerData from "services/Admin/delete-banners-data";

import AdminPlatformScreen from "screens/Admin/AdminPlatformScreen";

export interface EndpointStatus {
  loading?: boolean;
  error?: boolean;
}

export type EndpointName =
  | "loadUsers"
  | "loadDomains"
  | "loadPermissions"
  | "loadFaq"
  | "loadDictionary"
  | "loadBanner"
  | "loadLinks"
  | "createDomain"
  | "createPermission"
  | "createFaq"
  | "createDictionary"
  | "createBanner"
  | "updateUser"
  | "updateDomain"
  | "updatePermission"
  | "updateFaq"
  | "updateDictionary"
  | "updateBanner"
  | "updateLinks"
  | "deleteUser"
  | "deleteFaq"
  | "deleteDictionary"
  | "deleteBanner";

export interface Model {
  users: UserModel[] | undefined;
  domains: DomainModel[] | undefined;
  permissions: PermissionModel[] | undefined;
  faqs: FaqModel[] | undefined;
  dictionaries: DictionaryModel[] | undefined;
  banners: BannerModel[] | undefined;

  links: LinksModel | undefined;

  lastUpdate: Date | undefined;
}

const AdminPlatformController = () => {
  const [model, setModel] = useState<Partial<Model>>();

  const [endpoints, setEndpoints] =
    useState<Partial<Record<EndpointName, EndpointStatus>>>();

  useEffect(() => {
    loadUsers();
    loadDomains();
    loadPermissions();
    loadFaqs();
    loadDictionaries();
    loadBanners();
    loadLinks();
  }, []);

  const updateModel = (
    partialModel:
      | Partial<Model>
      | ((model: Partial<Model> | undefined) => Partial<Model>),
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
    status: Partial<EndpointStatus>,
  ) => {
    setEndpoints((prev) => ({
      ...prev,

      [endpoint]: {
        ...prev?.[endpoint],
        ...status,
      },
    }));
  };

  const buildStatusEndpoint = (name: EndpointName) => ({
    loading() {
      setEndpointStatus(name, {
        loading: true,
        error: false,
      });
    },

    error() {
      setEndpointStatus(name, {
        loading: false,
        error: true,
      });
    },

    done() {
      setEndpointStatus(name, {
        loading: false,
      });
    },
  });

  /* ==========================================
     LOAD
  ========================================== */

  const loadUsers = async () => {
    const statusEndpoint = buildStatusEndpoint("loadUsers");

    try {
      statusEndpoint.loading();

      const response = await loadUsersData();

      const users = UsersDataToModel(response);

      updateModel({
        users,
      });
    } catch (e) {
      console.error("Error al cargar usuarios:", e);

      statusEndpoint.error();

      updateModel({
        users: [],
      });
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

      updateModel({
        domains,
      });
    } catch (e) {
      console.error("Error al cargar dominios:", e);

      statusEndpoint.error();

      updateModel({
        domains: [],
      });
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

      updateModel({
        permissions,
      });
    } catch (e) {
      console.error("Error al cargar permisos:", e);

      statusEndpoint.error();

      updateModel({
        permissions: [],
      });
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

      updateModel({
        faqs,
      });
    } catch (e) {
      console.error("Error al cargar faqs:", e);

      statusEndpoint.error();

      updateModel({
        faqs: [],
      });
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

      updateModel({
        dictionaries,
      });
    } catch (e) {
      console.error("Error al cargar diccionarios:", e);

      statusEndpoint.error();

      updateModel({
        dictionaries: [],
      });
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

      updateModel({
        banners,
      });
    } catch (e) {
      console.error("Error al cargar banners:", e);

      statusEndpoint.error();

      updateModel({
        banners: [],
      });
    } finally {
      statusEndpoint.done();
    }
  };

  const loadLinks = async () => {
    const statusEndpoint = buildStatusEndpoint("loadLinks");

    try {
      statusEndpoint.loading();

      const response = await loadLinksData();

      const links = LinksDataToModel(response);

      updateModel({
        links: links ?? undefined,
      });
    } catch (e) {
      console.error("Error al cargar enlaces:", e);

      statusEndpoint.error();

      updateModel({
        links: undefined,
      });
    } finally {
      statusEndpoint.done();
    }
  };

  /* ==========================================
     CREATE
  ========================================== */

  const createDomain = async (domain: DomainModel) => {
    const statusEndpoint = buildStatusEndpoint("createDomain");

    try {
      statusEndpoint.loading();

      const response = await createDomainData(domain);

      const newDomain = DomainDataToModel(response);

      if (newDomain) {
        updateModel((currentModel) => ({
          domains: [...(currentModel?.domains || []), newDomain],
        }));
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
        updateModel((currentModel) => ({
          permissions: [...(currentModel?.permissions || []), newPermission],
        }));
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
        updateModel((currentModel) => ({
          faqs: [...(currentModel?.faqs || []), newFaq],
        }));
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
        updateModel((currentModel) => ({
          dictionaries: [...(currentModel?.dictionaries || []), newDictionary],
        }));
      }
    } catch (e) {
      console.error("Error al crear diccionario:", e);

      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  const createBanner = async (
    banner: BannerModel,
    file: File,
    onProgress: (percent: number) => void,
  ) => {
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

      if (newBanner) {
        updateModel((currentModel) => ({
          banners: [...(currentModel?.banners || []), newBanner],
        }));
      }
    } catch (e) {
      console.error("Error al crear banner:", e);

      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  /* ==========================================
     UPDATE
  ========================================== */

  const updateUser = async (user: UserModel) => {
    const statusEndpoint = buildStatusEndpoint("updateUser");

    try {
      statusEndpoint.loading();

      const response = await updateUserData(user);

      const updatedUser = UserDataToModel(response);

      if (updatedUser) {
        updateModel((currentModel) => ({
          users:
            currentModel?.users?.map((currentUser) =>
              currentUser.oid === updatedUser.oid ? updatedUser : currentUser,
            ) || [],
        }));
      }
    } catch (e) {
      console.error("Error al actualizar usuario:", e);

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
        updateModel((currentModel) => ({
          domains:
            currentModel?.domains?.map((currentDomain) =>
              currentDomain.id === updatedDomain.id
                ? updatedDomain
                : currentDomain,
            ) || [],
        }));
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
        updateModel((currentModel) => ({
          permissions:
            currentModel?.permissions?.map((currentPermission) =>
              currentPermission.id === updatedPermission.id
                ? updatedPermission
                : currentPermission,
            ) || [],
        }));
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
        updateModel((currentModel) => ({
          faqs:
            currentModel?.faqs?.map((currentFaq) =>
              currentFaq.id === updatedFaq.id ? updatedFaq : currentFaq,
            ) || [],
        }));
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
        updateModel((currentModel) => ({
          dictionaries:
            currentModel?.dictionaries?.map((currentDictionary) =>
              currentDictionary.id === updatedDictionary.id
                ? updatedDictionary
                : currentDictionary,
            ) || [],
        }));
      }
    } catch (e) {
      console.error("Error al actualizar diccionario:", e);

      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  const updateBanner = async (
    banner: BannerModel,
    file: File,
    onProgress: (percent: number) => void,
  ) => {
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

      if (updatedBanner) {
        updateModel((currentModel) => ({
          banners:
            currentModel?.banners?.map((currentBanner) =>
              currentBanner.id === updatedBanner.id
                ? updatedBanner
                : currentBanner,
            ) || [],
        }));
      }
    } catch (e) {
      console.error("Error al actualizar banner:", e);

      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  /*
   * LINKS
   *
   * No existe createLinks separado.
   * PUT /api/links/ hace upsert:
   *
   * - si no existe, lo crea
   * - si existe, lo actualiza
   */
  const updateLinks = async (links: LinksModel) => {
    const statusEndpoint = buildStatusEndpoint("updateLinks");

    try {
      statusEndpoint.loading();

      const response = await updateLinksData(links);

      const updatedLinks = LinksDataToModel(response);

      if (updatedLinks) {
        updateModel({
          links: updatedLinks,
        });
      }
    } catch (e) {
      console.error("Error al actualizar enlaces:", e);

      statusEndpoint.error();
    } finally {
      statusEndpoint.done();
    }
  };

  /* ==========================================
     DELETE
  ========================================== */

  const deleteUser = async (user: UserModel) => {
    const statusEndpoint = buildStatusEndpoint("deleteUser");

    try {
      statusEndpoint.loading();

      const response = await deleteUsersData(user);

      if (response) {
        updateModel((currentModel) => ({
          users:
            currentModel?.users?.filter(
              (currentUser) => currentUser.oid !== user.oid,
            ) || [],
        }));
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
        updateModel((currentModel) => ({
          faqs:
            currentModel?.faqs?.filter(
              (currentFaq) => currentFaq.id !== faq.id,
            ) || [],
        }));
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
        updateModel((currentModel) => ({
          dictionaries:
            currentModel?.dictionaries?.filter(
              (currentDictionary) => currentDictionary.id !== dictionary.id,
            ) || [],
        }));
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
        updateModel((currentModel) => ({
          banners:
            currentModel?.banners?.filter(
              (currentBanner) => currentBanner.id !== banner.id,
            ) || [],
        }));
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
      handleLinksUpdate={updateLinks}
      handleUserDelete={deleteUser}
      handleFaqDelete={deleteFaq}
      handleDictionaryDelete={deleteDictionary}
      handleBannerDelete={deleteBanner}
    />
  );
};

export default AdminPlatformController;
