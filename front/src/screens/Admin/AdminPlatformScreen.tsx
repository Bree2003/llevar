import AdminPlatformMenu, {
  AdminPlatformSection,
} from "components/AdminPlatform/AdminPlatformMenu";
import BannersAdminSection from "components/AdminPlatform/BannersAdminSection";
import ConceptsAdminSection from "components/AdminPlatform/ConceptsAdminSection";
import FaqAdminSection from "components/AdminPlatform/FaqAdminSection";
import UsersAdminSection from "components/AdminPlatform/UsersAdminSection";
import { useState } from "react";

const AdminPlatformScreen = () => {
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

        <header className="mb-7 text-left">
          <h1 className="text-3xl font-bold text-[--color-accent] md:text-4xl xl:text-5xl">
            Configuración de plataforma
          </h1>
          <p className="mt-4 max-w-4xl text-base font-medium text-[--color-text-secondary] md:mt-6 md:text-lg">
            Administra accesos, permisos y contenido transversal de la
            plataforma.
          </p>
        </header>

        {/* ADMIN CONSOLE */}
        <div
          className="
            flex
            flex-col

            lg:flex-row

            gap-5
            lg:gap-6

            items-start
          "
        >
          <AdminPlatformMenu activeSection={section} onChange={setSection} />

          <div
            className="
              flex-1
              min-w-0

              w-full
            "
          >
            {section === "users" && <UsersAdminSection />}

            {section === "banners" && <BannersAdminSection />}

            {section === "faq" && <FaqAdminSection />}

            {section === "concepts" && <ConceptsAdminSection />}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminPlatformScreen;
