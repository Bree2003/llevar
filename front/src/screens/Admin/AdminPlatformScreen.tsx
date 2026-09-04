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

import UserAdminTable from "components/Tables/UserAdminTable";
import DomainAdminTable from "components/Tables/DomainAdminTable";
import PermissionAdminTable from "components/Tables/PermissionAdminTable";
import BannersAdminSection from "components/AdminPlatform/BannersAdminSection";
import FaqAdminSection from "components/AdminPlatform/FaqAdminSection";
import ConceptsAdminSection from "components/AdminPlatform/ConceptsAdminSection";

interface AdminPlatformScreenProps {
  model: Partial<Model> | undefined;

  endpoints: Partial<Record<EndpointName, EndpointStatus>> | undefined;

  handleUserUpdate: (user: UserModel) => void;

  handleDomainUpdate: (domain: DomainModel) => void;

  handlePermissionUpdate: (permission: PermissionModel) => void;
}

const AdminPlatformScreen = ({
  model,
  endpoints,
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
        {/* HEADER */}
        <header className="mb-7">
          <p
            className="
              mb-1

              text-sm
              font-semibold

              text-[--color-accent]
            "
          >
            Administración
          </p>

          <h1
            className="
              text-2xl
              md:text-3xl

              font-bold

              text-[--color-text-primary]
            "
          >
            Configuración de plataforma
          </h1>

          <p
            className="
              mt-2

              text-sm
              md:text-base

              text-[--color-text-secondary]
            "
          >
            Administra usuarios, dominios, permisos y contenido transversal de
            la plataforma.
          </p>
        </header>

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
              <AdminSectionContainer
                title="Usuarios"
                description="Administra los usuarios y sus accesos dentro de la plataforma."
              >
                <UserAdminTable
                  userData={model?.users}
                  isLoading={endpoints?.loadUsers?.loading}
                  handleUserUpdate={handleUserUpdate}
                />
              </AdminSectionContainer>
            )}

            {/* DOMINIOS */}
            {section === "domains" && (
              <AdminSectionContainer
                title="Dominios"
                description="Administra los dominios disponibles dentro de la plataforma."
              >
                <DomainAdminTable
                  domainData={model?.domains}
                  isLoading={endpoints?.loadDomains?.loading}
                  handleDomainUpdate={handleDomainUpdate}
                />
              </AdminSectionContainer>
            )}

            {/* PERMISOS */}
            {section === "permissions" && (
              <AdminSectionContainer
                title="Permisos"
                description="Administra los permisos disponibles para los usuarios de la plataforma."
              >
                <PermissionAdminTable
                  permissionData={model?.permissions}
                  isLoading={endpoints?.loadPermissions?.loading}
                  handlePermissionUpdate={handlePermissionUpdate}
                />
              </AdminSectionContainer>
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

interface AdminSectionContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const AdminSectionContainer = ({
  title,
  description,
  children,
}: AdminSectionContainerProps) => {
  return (
    <section
      className="
        w-full

        bg-white

        border
        border-[--color-border]

        rounded-xl

        overflow-hidden
      "
    >
      <div
        className="
          p-5
          md:p-6

          border-b
          border-[--color-border]
        "
      >
        <h2
          className="
            text-xl
            font-bold

            text-[--color-text-primary]
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1

            text-sm

            text-[--color-text-secondary]
          "
        >
          {description}
        </p>
      </div>

      <div className="p-4 md:p-5">{children}</div>
    </section>
  );
};

export default AdminPlatformScreen;
