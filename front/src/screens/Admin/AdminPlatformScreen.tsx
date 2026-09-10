import { useState } from "react";

import type {
  Model,
  EndpointStatus,
  EndpointName,
} from "controllers/Admin/AdminPlatformController";

import { UserModel } from "models/Admin/usersModel";
import { DomainModel } from "models/Global/domainsModel";
import { PermissionModel } from "models/Admin/permissionsModel";
import { FaqModel } from "models/Global/faqModel";
import { DictionaryModel } from "models/Global/dictionaryModel";
import { BannerModel } from "models/Global/bannerModel";
import { LinksModel } from "models/Global/linksModel";

import AdminPlatformMenu, {
  AdminPlatformSection,
} from "components/AdminPlatform/AdminPlatformMenu";

import UsersAdminSection from "components/AdminPlatform/UsersAdminSection";
import DomainAdminSection from "components/AdminPlatform/DomainAdminSection";
import PermissionAdminSection from "components/AdminPlatform/PermissionAdminSection";
import BannersAdminSection from "components/AdminPlatform/BannersAdminSection";
import FaqAdminSection from "components/AdminPlatform/FaqAdminSection";
import ConceptsAdminSection from "components/AdminPlatform/ConceptsAdminSection";
import LinksAdminSection from "components/AdminPlatform/LinksAdminSection";

interface AdminPlatformScreenProps {
  model: Partial<Model> | undefined;

  endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;

  handleDomainCreate: (domain: DomainModel) => void;

  handlePermissionCreate: (permission: PermissionModel) => void;

  handleFaqCreate: (faq: FaqModel) => void;

  handleDictionaryCreate: (dictionary: DictionaryModel) => void;

  handleBannerCreate: (
    banner: BannerModel,
    file: File,
    onProgress: (percent: number) => void,
  ) => void;

  handleUserUpdate: (user: UserModel) => void;

  handleDomainUpdate: (domain: DomainModel) => void;

  handlePermissionUpdate: (permission: PermissionModel) => void;

  handleFaqUpdate: (faq: FaqModel) => void;

  handleDictionaryUpdate: (dictionary: DictionaryModel) => void;

  handleBannerUpdate: (
    banner: BannerModel,
    file: File,
    onProgress: (percent: number) => void,
  ) => void;

  handleLinksUpdate: (links: LinksModel) => void;

  handleUserDelete: (user: UserModel) => void;

  handleFaqDelete: (faq: FaqModel) => void;

  handleDictionaryDelete: (dictionary: DictionaryModel) => void;

  handleBannerDelete: (banner: BannerModel) => void;
}

const AdminPlatformScreen = ({
  model,
  endpoints,
  handleDomainCreate,
  handlePermissionCreate,
  handleFaqCreate,
  handleDictionaryCreate,
  handleBannerCreate,
  handleUserUpdate,
  handleDomainUpdate,
  handlePermissionUpdate,
  handleFaqUpdate,
  handleDictionaryUpdate,
  handleBannerUpdate,
  handleLinksUpdate,
  handleUserDelete,
  handleFaqDelete,
  handleDictionaryDelete,
  handleBannerDelete,
}: AdminPlatformScreenProps) => {
  const [section, setSection] = useState<AdminPlatformSection>("users");

  return (
    <main
      className="
        w-full
        min-h-full

        bg-[--color-background]

        px-4
        py-6

        md:px-6
        md:py-8

        lg:px-8
      "
    >
      <div
        className="
          w-full
          max-w-[1600px]

          mx-auto
        "
      >
        {/* HEADER */}
        <section className="w-full text-left mb-7">
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
              Administra la configuración general de la plataforma, sus
              usuarios, dominios, permisos, contenido informativo y enlaces de
              acceso.
            </p>
          </div>
        </section>

        {/* ADMIN CONSOLE */}
        <div
          className="
            flex
            flex-col

            lg:flex-row

            items-start

            gap-5
            lg:gap-6
          "
        >
          {/* MENU */}
          <div
            className="
              w-full
              lg:w-auto
              lg:flex-shrink-0

              lg:sticky
              lg:top-6
              lg:self-start
            "
          >
            <AdminPlatformMenu activeSection={section} onChange={setSection} />
          </div>

          {/* CONTENT */}
          <div
            className="
              w-full
              flex-1
              min-w-0
            "
          >
            {/* USUARIOS */}
            {section === "users" && (
              <UsersAdminSection
                userData={model?.users}
                domains={model?.domains}
                permissions={model?.permissions}
                isBusy={
                  (endpoints?.updateUser?.loading ||
                    endpoints?.deleteUser?.loading) ??
                  false
                }
                isLoading={endpoints?.loadUsers?.loading ?? false}
                handleUserUpdate={handleUserUpdate}
                handleUserDelete={handleUserDelete}
              />
            )}

            {/* DOMINIOS */}
            {section === "domains" && (
              <DomainAdminSection
                domainData={model?.domains}
                isBusy={
                  (endpoints?.createDomain?.loading ||
                    endpoints?.updateDomain?.loading) ??
                  false
                }
                isLoading={endpoints?.loadDomains?.loading ?? false}
                handleDomainCreate={handleDomainCreate}
                handleDomainUpdate={handleDomainUpdate}
              />
            )}

            {/* PERMISOS */}
            {section === "permissions" && (
              <PermissionAdminSection
                permissionData={model?.permissions}
                isBusy={
                  (endpoints?.createPermission?.loading ||
                    endpoints?.updatePermission?.loading) ??
                  false
                }
                isLoading={endpoints?.loadPermissions?.loading ?? false}
                handlePermissionCreate={handlePermissionCreate}
                handlePermissionUpdate={handlePermissionUpdate}
              />
            )}

            {/* NOTICIAS */}
            {section === "banners" && (
              <BannersAdminSection
                bannerData={model?.banners}
                isBusy={
                  (endpoints?.createBanner?.loading ||
                    endpoints?.updateBanner?.loading ||
                    endpoints?.deleteBanner?.loading) ??
                  false
                }
                isLoading={endpoints?.loadBanner?.loading ?? false}
                handleBannerCreate={handleBannerCreate}
                handleBannerUpdate={handleBannerUpdate}
                handleBannerDelete={handleBannerDelete}
              />
            )}

            {/* FAQ */}
            {section === "faq" && (
              <FaqAdminSection
                faqData={model?.faqs}
                isBusy={
                  (endpoints?.createFaq?.loading ||
                    endpoints?.updateFaq?.loading ||
                    endpoints?.deleteFaq?.loading) ??
                  false
                }
                isLoading={endpoints?.loadFaq?.loading ?? false}
                handleFaqCreate={handleFaqCreate}
                handleFaqUpdate={handleFaqUpdate}
                handleFaqDelete={handleFaqDelete}
              />
            )}

            {/* DICCIONARIO */}
            {section === "concepts" && (
              <ConceptsAdminSection
                dictionaryData={model?.dictionaries}
                isBusy={
                  (endpoints?.createDictionary?.loading ||
                    endpoints?.updateDictionary?.loading ||
                    endpoints?.deleteDictionary?.loading) ??
                  false
                }
                isLoading={endpoints?.loadDictionary?.loading ?? false}
                handleDictionaryCreate={handleDictionaryCreate}
                handleDictionaryUpdate={handleDictionaryUpdate}
                handleDictionaryDelete={handleDictionaryDelete}
              />
            )}

            {/* ENLACES */}
            {section === "links" && (
              <LinksAdminSection
                linksData={model?.links}
                isBusy={endpoints?.updateLinks?.loading ?? false}
                isLoading={endpoints?.loadLinks?.loading ?? false}
                handleLinksUpdate={handleLinksUpdate}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminPlatformScreen;
