import { useState } from "react";

import {
  Model,
  EndpointStatus,
  EndpointName,
} from "controllers/Admin/AdminPlatformController";

import { UserModel } from "models/Admin/usersModel";
import { DomainModel } from "models/Admin/domainsModel";
import { PermissionModel } from "models/Admin/permissionsModel";

import AdminPlatformMenu, {
  AdminPlatformSection,
} from "components/AdminPlatform/AdminPlatformMenu";

import UsersAdminSection from "components/AdminPlatform/UsersAdminSection";
import DomainAdminSection from "components/AdminPlatform/DomainAdminSection";
import PermissionAdminSection from "components/AdminPlatform/PermissionAdminSection";
import BannersAdminSection from "components/AdminPlatform/BannersAdminSection";
import FaqAdminSection from "components/AdminPlatform/FaqAdminSection";
import ConceptsAdminSection from "components/AdminPlatform/ConceptsAdminSection";

interface AdminPlatformScreenProps {
  model: Partial<Model> | undefined;
  endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;
  handleDomainCreate: (domain: DomainModel) => void;
  handlePermissionCreate: (permission: PermissionModel) => void;
  handleUserUpdate: (user: UserModel) => void;
  handleDomainUpdate: (domain: DomainModel) => void;
  handlePermissionUpdate: (permission: PermissionModel) => void;
}

const AdminPlatformScreen = ({
  model,
  endpoints,
  handleDomainCreate,
  handlePermissionCreate,
  handleUserUpdate,
  handleDomainUpdate,
  handlePermissionUpdate,
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
        {/* Header */}
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
          <AdminPlatformMenu activeSection={section} onChange={setSection} />

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
                isLoading={endpoints?.loadUsers?.loading}
                handleUserUpdate={handleUserUpdate}
              />
            )}

            {/* DOMINIOS */}
            {section === "domains" && (
              <DomainAdminSection
                domainData={model?.domains}
                isLoading={endpoints?.loadDomains?.loading}
                handleDomainCreate={handleDomainCreate}
                handleDomainUpdate={handleDomainUpdate}
              />
            )}

            {/* PERMISOS */}
            {section === "permissions" && (
              <PermissionAdminSection
                permissionData={model?.permissions}
                isLoading={endpoints?.loadPermissions?.loading}
                handlePermissionCreate={handlePermissionCreate}
                handlePermissionUpdate={handlePermissionUpdate}
              />
            )}

            {/* NOTICIAS */}
            {section === "banners" && <BannersAdminSection />}

            {/* FAQ */}
            {section === "faq" && <FaqAdminSection />}

            {/* DICCIONARIO */}
            {section === "concepts" && <ConceptsAdminSection />}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminPlatformScreen;
