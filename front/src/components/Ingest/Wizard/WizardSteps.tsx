import { useState } from "react";
import {
  AnalysisStep1Data,
  AnalysisStep2Data,
  AnalysisStep3Data,
} from "models/Ingest/analysis-model";
import { ReactComponent as Danger } from "components/Global/Icons/danger.svg";
import { ReactComponent as Warning } from "components/Global/Icons/warning.svg";
import AlertMessage from "components/UI/AlertMessage";

const DetailRow = ({ label, value }: { label: string; value: any }) => (
  <div
    className="
      py-4

      border-b
      last:border-b-0
      border-[--color-border]

      grid
      grid-cols-1
      sm:grid-cols-[160px_minmax(0,1fr)]

      gap-1
      sm:gap-5
    "
  >
    <span
      className="
        text-xs
        sm:text-sm

        font-semibold

        text-[--color-text-secondary]
      "
    >
      {label}
    </span>

    <span
      className="
        text-sm
        sm:text-base

        font-semibold

        text-[--color-text-primary]

        break-words
      "
    >
      {value || "-"}
    </span>
  </div>
);

export const Step1Confirmation = ({ data }: { data: AnalysisStep1Data }) => {
  if (!data) {
    return (
      <div
        className="
          py-12
          text-center
          text-[--color-text-secondary]
        "
      >
        No fue posible cargar la información del archivo.
      </div>
    );
  }

  return (
    <section
      className="
        w-full

        bg-white

        border
        border-[--color-border]

        rounded-2xl

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
        <h3
          className="
            text-lg
            md:text-xl

            font-bold

            text-[--color-text-primary]
          "
        >
          Resumen del archivo
        </h3>

        <p
          className="
            mt-1

            text-sm

            text-[--color-text-secondary]
          "
        >
          Confirma que la información del archivo seleccionado sea correcta
          antes de continuar.
        </p>
      </div>

      <div className="px-5 md:px-6">
        <DetailRow label="Nombre" value={data.nombre_archivo} />

        <DetailRow label="Tamaño" value={data.tamano} />

        <DetailRow label="Tipo" value={data.tipo_archivo} />

        <DetailRow label="Fecha de carga" value={data.fecha_de_carga} />

        <DetailRow label="Hora de carga" value={data.hora_de_carga} />
      </div>
    </section>
  );
};

export const Step2Structure = ({ data }: { data: AnalysisStep2Data }) => {
  const [tab, setTab] = useState<"columns" | "preview">("columns");

  if (!data) {
    return (
      <div className="py-12 text-center text-[--color-text-secondary]">
        Cargando estructura...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* MÉTRICAS */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          gap-4
        "
      >
        <div
          className="
            bg-white

            border
            border-[--color-border]

            rounded-2xl

            p-5
            md:p-6
          "
        >
          <span
            className="
              text-xs
              md:text-sm

              font-semibold
              uppercase
              tracking-wide

              text-[--color-text-secondary]
            "
          >
            Columnas detectadas
          </span>

          <p
            className="
              mt-2

              text-3xl
              md:text-4xl

              font-bold

              text-[--color-accent]
            "
          >
            {data.numero_columnas}
          </p>
        </div>

        <div
          className="
            bg-white

            border
            border-[--color-border]

            rounded-2xl

            p-5
            md:p-6
          "
        >
          <span
            className="
              text-xs
              md:text-sm

              font-semibold
              uppercase
              tracking-wide

              text-[--color-text-secondary]
            "
          >
            Registros detectados
          </span>

          <p
            className="
              mt-2

              text-3xl
              md:text-4xl

              font-bold

              text-[--color-accent]
            "
          >
            {data.numero_registros}
          </p>
        </div>
      </div>

      {/* ESTRUCTURA */}
      <section
        className="
          bg-white

          border
          border-[--color-border]

          rounded-2xl

          overflow-hidden
        "
      >
        {/* Tabs */}
        <div
          className="
            px-4
            sm:px-5

            border-b
            border-[--color-border]

            flex
            overflow-x-auto
          "
        >
          <button
            type="button"
            onClick={() => setTab("columns")}
            className={`
              px-3
              sm:px-4
              py-4

              text-sm
              font-semibold

              whitespace-nowrap

              border-b-2

              transition-colors

              ${
                tab === "columns"
                  ? "border-[--color-accent] text-[--color-accent]"
                  : "border-transparent text-[--color-text-secondary] hover:text-[--color-text-primary]"
              }
            `}
          >
            Columnas
          </button>

          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`
              px-3
              sm:px-4
              py-4

              text-sm
              font-semibold

              whitespace-nowrap

              border-b-2

              transition-colors

              ${
                tab === "preview"
                  ? "border-[--color-accent] text-[--color-accent]"
                  : "border-transparent text-[--color-text-secondary] hover:text-[--color-text-primary]"
              }
            `}
          >
            Vista previa
          </button>
        </div>

        {tab === "columns" ? (
          <div
            className="
              p-4
              md:p-5

              max-h-[350px]
              overflow-y-auto
            "
          >
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2

                gap-3
              "
            >
              {data.columnas_encontradas.map((column, index) => (
                <div
                  key={index}
                  className="
                      flex
                      items-center
                      justify-between
                      gap-3

                      p-3

                      rounded-xl

                      bg-[--color-background]

                      border
                      border-[--color-border]
                    "
                >
                  <span
                    className="
                        min-w-0

                        text-sm
                        font-semibold

                        text-[--color-text-primary]

                        truncate
                      "
                  >
                    {column.nombre}
                  </span>

                  <span
                    className="
                        flex-shrink-0

                        px-2
                        py-1

                        rounded-md

                        bg-white

                        border
                        border-[--color-border]

                        text-xs
                        font-mono

                        text-[--color-text-secondary]
                      "
                  >
                    {column.tipo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table
              className="
                w-full
                min-w-[700px]

                text-xs
                md:text-sm

                text-left
              "
            >
              <thead
                className="
                  bg-[--color-background]

                  border-b
                  border-[--color-border]
                "
              >
                <tr>
                  {data.columnas_encontradas.map((column) => (
                    <th
                      key={column.nombre}
                      className="
                          px-4
                          py-3

                          font-semibold

                          text-[--color-text-secondary]

                          whitespace-nowrap
                        "
                    >
                      {column.nombre}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data.vista_previa.map((row, index) => (
                  <tr
                    key={index}
                    className="
                        border-b
                        last:border-b-0
                        border-[--color-border]

                        hover:bg-[--color-background]
                      "
                  >
                    {data.columnas_encontradas.map((column) => (
                      <td
                        key={column.nombre}
                        className="
                              px-4
                              py-3

                              max-w-[220px]

                              truncate

                              text-[--color-text-secondary]
                            "
                      >
                        {row[column.nombre]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <AlertMessage variant="compact">
        <span>
          Hemos ajustado los nombres de las columnas eliminando símbolos y
          caracteres especiales (ñ, -, $, etc.). Esto garantiza que tus datos se
          procesen correctamente.
        </span>
      </AlertMessage>
    </div>
  );
};

const parseValidationMessage = (message: string) => {
  // 1. Caso: Columnas que sobran (Están en el archivo pero no en BQ)
  if (message.includes("columnas que no existen en BigQuery")) {
    const parts = message.split(":");
    const columnsStr = parts[1] || "";
    return {
      type: "EXTRA_COLUMNS",
      title: "Columnas inesperadas",
      description:
        "Estas columnas están en tu archivo pero NO existen en la tabla de BigQuery.",
      columns: columnsStr
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    };
  }

  // 2. Caso: Columnas que faltan (Están en BQ pero no en el archivo)
  if (message.includes("Faltan columnas requeridas")) {
    const parts = message.split(":");
    const columnsStr = parts[1] || "";
    return {
      type: "MISSING_COLUMNS",
      title: "Columnas faltantes",
      description:
        "Estas columnas son OBLIGATORIAS en BigQuery y no vienen en tu archivo.",
      columns: columnsStr
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    };
  }

  // 3. Caso: Cualquier otro error genérico
  return { type: "GENERIC", message };
};

export const Step3Validation = ({ data }: { data: any }) => {
  if (!data) {
    return (
      <div className="py-12 text-center text-[--color-text-secondary]">
        Cargando validaciones...
      </div>
    );
  }

  const errores = data.bloqueantes || [];

  const alertas = data.alertas || [];

  const isValid = errores.length === 0 && alertas.length === 0;

  const parsedErrors = errores.map(parseValidationMessage);

  return (
    <div
      className="
        w-full
        flex
        flex-col
        gap-6
      "
    >
      {/* SUCCESS */}
      {isValid && (
        <div
          className="
            w-full

            bg-white

            border
            border-green-200

            rounded-2xl

            p-6
            md:p-8

            text-center
          "
        >
          <div
            className="
              w-14
              h-14

              mx-auto

              flex
              items-center
              justify-center

              rounded-full

              bg-green-100
              text-green-600

              text-2xl
            "
          >
            ✓
          </div>

          <h3
            className="
              mt-4

              text-lg
              md:text-xl

              font-bold

              text-[--color-text-primary]
            "
          >
            Validación exitosa
          </h3>

          <p
            className="
              mt-2

              text-sm
              md:text-base

              text-[--color-text-secondary]
            "
          >
            El archivo cumple con los requisitos necesarios para realizar la
            ingesta.
          </p>
        </div>
      )}

      {/* ERRORES */}
      {errores.length > 0 && (
        <section>
          <div
            className="
              flex
              items-center
              gap-3

              mb-4
            "
          >
            <h3
              className="
                text-sm

                font-bold

                uppercase
                tracking-wide

                text-red-700

                whitespace-nowrap
              "
            >
              Errores bloqueantes
            </h3>

            <div className="h-px flex-1 bg-red-200" />
          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2

              gap-4
            "
          >
            {parsedErrors.map((error: any, index: number) => {
              if (error.type === "GENERIC") {
                return (
                  <div
                    key={index}
                    className="
                        md:col-span-2

                        p-4

                        rounded-xl

                        bg-red-50

                        border
                        border-red-200

                        text-sm
                        text-red-700
                      "
                  >
                    {error.message}
                  </div>
                );
              }

              const isMissing = error.type === "MISSING_COLUMNS";

              return (
                <div
                  key={index}
                  className={`
                      overflow-hidden

                      rounded-2xl

                      border

                      bg-white

                      ${isMissing ? "border-red-200" : "border-amber-200"}
                    `}
                >
                  <div
                    className={`
                        p-4

                        border-b

                        ${
                          isMissing
                            ? "bg-red-50 border-red-200"
                            : "bg-amber-50 border-amber-200"
                        }
                      `}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`
                            w-8
                            h-8

                            rounded-full

                            flex
                            items-center
                            justify-center

                            flex-shrink-0

                            ${
                              isMissing
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }
                          `}
                      >
                        {isMissing ? "!" : "⚠"}
                      </div>

                      <h4
                        className="
                            text-sm
                            font-bold
                            text-[--color-text-primary]
                          "
                      >
                        {error.title}
                      </h4>
                    </div>

                    <p
                      className="
                          mt-2

                          text-xs
                          md:text-sm

                          text-[--color-text-secondary]
                        "
                    >
                      {error.description}
                    </p>
                  </div>

                  <div className="p-4">
                    <div
                      className="
                          flex
                          flex-wrap
                          gap-2
                        "
                    >
                      {error.columns.map(
                        (column: string, columnIndex: number) => (
                          <span
                            key={columnIndex}
                            className={`
                                px-2.5
                                py-1.5

                                rounded-lg

                                border

                                text-xs
                                font-mono
                                font-medium

                                ${
                                  isMissing
                                    ? "bg-red-50 border-red-100 text-red-700"
                                    : "bg-amber-50 border-amber-100 text-amber-700"
                                }
                              `}
                          >
                            {column}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* WARNINGS */}
      {alertas.length > 0 && (
        <section>
          <div
            className="
              flex
              items-center
              gap-3

              mb-4
            "
          >
            <h3
              className="
                text-sm

                font-bold

                uppercase
                tracking-wide

                text-amber-700

                whitespace-nowrap
              "
            >
              Advertencias
            </h3>

            <div className="h-px flex-1 bg-amber-200" />
          </div>

          <div className="flex flex-col gap-3">
            {alertas.map((warning: string, index: number) => (
              <div
                key={index}
                className="
                    flex
                    items-start
                    gap-3

                    p-4

                    rounded-xl

                    bg-amber-50

                    border
                    border-amber-200
                  "
              >
                <span
                  className="
                      flex-shrink-0

                      text-amber-600
                      font-bold
                    "
                >
                  !
                </span>

                <p
                  className="
                      text-sm
                      text-amber-800
                    "
                >
                  {warning}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
export const Step3NewTableDescription = ({
  columns,
  metadata,
  onTableDescChange,
  onColumnDescChange,
}: {
  columns: any[];
  metadata: any;
  onTableDescChange: (value: string) => void;
  onColumnDescChange: (column: string, value: string) => void;
}) => {
  return (
    <div
      className="
        w-full

        flex
        flex-col

        gap-6

        text-left
      "
    >
      {/* DESCRIPCIÓN GENERAL */}
      <section
        className="
          bg-white

          border
          border-[--color-border]

          rounded-2xl

          p-5
          md:p-6
        "
      >
        <div
          className="
            flex
            flex-col
            sm:flex-row

            sm:items-start
            sm:justify-between

            gap-2
          "
        >
          <div>
            <label
              htmlFor="table-description"
              className="
                block

                text-base
                md:text-lg

                font-bold

                text-[--color-text-primary]
              "
            >
              Descripción de la tabla
              <span className="text-red-500 ml-1">*</span>
            </label>

            <p
              className="
                mt-1

                text-sm

                text-[--color-text-secondary]
              "
            >
              Describe brevemente el propósito y contenido de esta tabla en
              BigQuery.
            </p>
          </div>

          <span
            className="
              text-xs

              text-[--color-text-muted]

              whitespace-nowrap
            "
          >
            Campo obligatorio
          </span>
        </div>

        <textarea
          id="table-description"
          required
          value={metadata.tableDescription || ""}
          onChange={(event) => onTableDescChange(event.target.value)}
          placeholder="Ej: Tabla maestra de clientes sincronizada mensualmente desde el CRM..."
          className="
            w-full

            min-h-[110px]

            mt-4

            p-3

            rounded-[10px]

            bg-white

            border
            border-[--color-border]

            text-sm
            text-[--color-text-primary]

            resize-y

            outline-none

            focus:border-[--color-accent]
            focus:ring-2
            focus:ring-[--color-accent-light]

            transition-all
          "
        />

        {!metadata.tableDescription && (
          <p
            className="
              mt-2
              text-xs
              text-red-500
            "
          >
            Este campo es obligatorio.
          </p>
        )}
      </section>

      {/* DICCIONARIO */}
      <section
        className="
          bg-white

          border
          border-[--color-border]

          rounded-2xl

          overflow-hidden
        "
      >
        <div
          className="
            p-5
            md:p-6

            border-b
            border-[--color-border]

            flex
            flex-col
            sm:flex-row

            sm:items-end
            sm:justify-between

            gap-2
          "
        >
          <div>
            <h3
              className="
                text-base
                md:text-lg

                font-bold

                text-[--color-text-primary]
              "
            >
              Diccionario de datos
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-[--color-text-secondary]
              "
            >
              Define el significado de cada columna antes de crear la tabla.
            </p>
          </div>

          <span
            className="
              text-xs
              text-[--color-text-muted]
            "
          >
            <span className="text-red-500">*</span> Todos los campos son
            requeridos
          </span>
        </div>

        {/* DESKTOP / TABLET */}
        <div className="hidden md:block overflow-x-auto">
          <table
            className="
              w-full
              min-w-[700px]

              text-left
            "
          >
            <thead
              className="
                bg-[--color-background]

                border-b
                border-[--color-border]
              "
            >
              <tr>
                <th
                  className="
                    w-[28%]

                    px-5
                    py-3

                    text-xs
                    font-semibold
                    uppercase

                    text-[--color-text-secondary]
                  "
                >
                  Columna
                </th>

                <th
                  className="
                    w-[18%]

                    px-5
                    py-3

                    text-xs
                    font-semibold
                    uppercase

                    text-[--color-text-secondary]
                  "
                >
                  Tipo
                </th>

                <th
                  className="
                    px-5
                    py-3

                    text-xs
                    font-semibold
                    uppercase

                    text-[--color-text-secondary]
                  "
                >
                  Descripción / definición
                  <span className="text-red-500 ml-1">*</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {columns.map((column, index) => (
                <tr
                  key={index}
                  className="
                      border-b
                      last:border-b-0
                      border-[--color-border]

                      hover:bg-[--color-background]

                      transition-colors
                    "
                >
                  <td
                    className="
                        px-5
                        py-4

                        text-sm
                        font-semibold

                        text-[--color-text-primary]
                      "
                  >
                    {column.nombre}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className="
                          px-2.5
                          py-1

                          rounded-md

                          bg-[--color-background]

                          text-xs
                          font-mono

                          text-[--color-text-secondary]
                        "
                    >
                      {column.tipo}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <input
                      type="text"
                      value={metadata.columnDescriptions[column.nombre] || ""}
                      onChange={(event) =>
                        onColumnDescChange(column.nombre, event.target.value)
                      }
                      placeholder={`Define ${column.nombre}...`}
                      className="
                          w-full

                          px-3
                          py-2.5

                          rounded-[10px]

                          border
                          border-[--color-border]

                          bg-white

                          text-sm

                          outline-none

                          focus:border-[--color-accent]
                          focus:ring-2
                          focus:ring-[--color-accent-light]

                          transition-all
                        "
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CELULAR */}
        <div
          className="
            md:hidden

            p-4

            flex
            flex-col
            gap-4
          "
        >
          {columns.map((column, index) => (
            <div
              key={index}
              className="
                  p-4

                  rounded-xl

                  bg-[--color-background]

                  border
                  border-[--color-border]
                "
            >
              <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
              >
                <p
                  className="
                      min-w-0

                      text-sm
                      font-bold

                      text-[--color-text-primary]

                      break-words
                    "
                >
                  {column.nombre}
                </p>

                <span
                  className="
                      flex-shrink-0

                      px-2
                      py-1

                      rounded-md

                      bg-white

                      border
                      border-[--color-border]

                      text-xs
                      font-mono

                      text-[--color-text-secondary]
                    "
                >
                  {column.tipo}
                </span>
              </div>

              <label
                className="
                    block

                    mt-4
                    mb-2

                    text-xs
                    font-semibold

                    text-[--color-text-secondary]
                  "
              >
                Descripción
                <span className="text-red-500 ml-1">*</span>
              </label>

              <input
                type="text"
                value={metadata.columnDescriptions[column.nombre] || ""}
                onChange={(event) =>
                  onColumnDescChange(column.nombre, event.target.value)
                }
                placeholder="Define esta columna..."
                className="
                    w-full

                    px-3
                    py-2.5

                    rounded-[10px]

                    border
                    border-[--color-border]

                    bg-white

                    text-sm

                    outline-none

                    focus:border-[--color-accent]
                    focus:ring-2
                    focus:ring-[--color-accent-light]
                  "
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
