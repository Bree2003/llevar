import { ChangeEvent, useState } from "react";
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { BannerModel } from "models/Global/bannerModel";


export type ActionKind = "Create" | "Update" | "Delete";

interface Props {
  banner: BannerModel;
  onClose: () => void;
  onSave: (
    banner: BannerModel,
    file: File,
    onProgress: (percent: number) => void,
    kind: ActionKind,
  ) => void;
};

function LinearProgressWithLabelAndValue(
  props: LinearProgressProps & { value: number },
) {
  return (
    <div>
      {props.value >= 100 ? (
        <Typography id='file-upload-progress' variant="body2" color="text.secondary">
          Imagen Subida Correctamente
        </Typography>
      ) : (
        <Typography id='file-upload-progress' variant="body2" color="text.secondary">
          Subiendo imagen...
        </Typography>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            variant="determinate"
            aria-labelledby='file-upload-progress'
            {...props}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

const BannerModal = ({ banner, onClose, onSave }: Props) => {
  const [form, setForm] = useState<BannerModel>(banner);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleClose = () => {
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    setFile(null);
    setProgress(null);
    setLocalPreview(null);

    onClose();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    setFile(file);
  };

  const handleOnChange = (bannerData: BannerModel, fileData: File | null) => {
    if (!fileData) {
      return;
    }

    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    onSave(bannerData, fileData, (pct) => setProgress(pct), banner.id ? "Update" : "Create");
  };

  const isValid = form.name.trim() !== "" && file !== null;

  return (
    <div
      className="
        fixed
        inset-0

        z-[100]

        bg-black/60

        flex
        items-center
        justify-center

        p-4
      "
    >
      <div
        className="
          w-full
          max-w-2xl

          max-h-[calc(100dvh-2rem)]

          bg-white

          rounded-xl

          shadow-2xl

          flex
          flex-col

          overflow-hidden
        "
      >
        {/* HEADER */}
        <div
          className="
            px-5
            py-4

            flex
            items-center
            justify-between

            border-b
            border-[--color-border]
          "
        >
          <div>
            <h2
              className="
                text-lg
                font-bold

                text-[--color-text-primary]
              "
            >
              {banner.id ? "Reemplazar banner" : "Subir banner"}
            </h2>

            <p
              className="
                mt-1

                text-sm

                text-[--color-text-secondary]
              "
            >
              Selecciona la imagen que será mostrada en la sección de noticias.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="
              w-9
              h-9

              rounded-lg

              text-xl

              text-[--color-text-secondary]

              hover:bg-[--color-background]
            "
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div
          className="
            flex-1
            min-h-0

            overflow-y-auto

            p-5

            space-y-5
          "
        >
          {/* PREVIEW */}
          <div>
            <p
              className="
                mb-2

                text-sm
                font-semibold

                text-[--color-text-primary]
              "
            >
              Vista previa
            </p>

            <div
              className="
                relative

                aspect-[16/6]

                bg-[--color-background]

                border
                border-[--color-border]

                rounded-xl

                overflow-hidden
              "
            >
              {localPreview ? (
                <img
                  src={localPreview}
                  alt="Vista previa del banner"
                  className="
                    absolute
                    inset-0

                    w-full
                    h-full

                    object-cover
                  "
                />
              ) : form.src ? (
                <img
                  src={form.src}
                  alt="Vista previa del banner"
                  className="
                    absolute
                    inset-0

                    w-full
                    h-full

                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    absolute
                    inset-0

                    flex
                    flex-col
                    items-center
                    justify-center

                    gap-2

                    text-[--color-text-muted]
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="
                      w-10
                      h-10
                    "
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />

                    <circle cx="8.5" cy="8.5" r="1.5" />

                    <path d="m21 15-5-5L5 21" />
                  </svg>

                  <span className="text-sm">
                    Aún no has seleccionado una imagen
                  </span>
                </div>
              )}
            </div>
          </div>
          <div>
            <Field label="Nombre del Banner">
              <input
                value={form.name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    name: event.target.value,
                  })
                }
                placeholder="Ej: Banner de GPS"
                className={inputStyle}
              />
            </Field>
          </div>
          {/* FILE */}
          <div>
            <label
              className="
                block

                mb-1.5

                text-sm
                font-semibold

                text-[--color-text-primary]
              "
            >
              Imagen
            </label>

            <label
              className="
                flex
                items-center
                justify-center

                w-full

                px-4
                py-4

                border
                border-dashed
                border-[--color-border]

                rounded-lg

                text-sm
                font-semibold

                text-[--color-accent]

                cursor-pointer

                hover:bg-[--color-accent-light]

                transition-colors
              "
            >
              {progress !== null ? "Subiendo imagen..." : form.src ? "Seleccionar otra imagen" : "Seleccionar imagen"}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                className="hidden"
                disabled={progress !== null}
              />
            </label>

            <p
              className="
                mt-2

                text-xs

                text-[--color-text-muted]
              "
            >
              Formatos recomendados: PNG, JPG o WEBP.
            </p>
          </div>
        </div>

        {/* LINEAR BAR */}
        {progress !== null ? (
          <div
            className="
            px-10
            py-4

            border-t
            border-[--color-border]
          "
          >
            <LinearProgressWithLabelAndValue value={progress} />
          </div>
        ) : null}

        {/* FOOTER */}
        <div
          className="
            px-5
            py-4

            border-t
            border-[--color-border]

            flex
            justify-end
            gap-3
          "
        >
          <button
            type="button"
            onClick={handleClose}
            className="
              px-4
              py-2.5

              rounded-lg

              border
              border-[--color-border]

              text-sm
              font-semibold

              text-[--color-text-secondary]

              hover:bg-[--color-background]
            "
          >
            Cancelar
          </button>

          {progress !== null && progress >= 100 ? (
            <button
              type="button"
              onClick={handleClose}
              className="
              px-4
              py-2.5

              rounded-lg

              bg-[--color-accent]

              text-white
              text-sm
              font-semibold

              hover:opacity-90

              disabled:opacity-40
              disabled:cursor-not-allowed
            "
            >
              Cerrar
            </button>
          ) : (
            <button
              type="button"
              disabled={!isValid || progress !== null}
              onClick={() => handleOnChange(form, file)}
              className="
              px-4
              py-2.5

              rounded-lg

              bg-[--color-accent]

              text-white
              text-sm
              font-semibold

              hover:opacity-90

              disabled:opacity-40
              disabled:cursor-not-allowed
            "
            >
              {banner.id ? "Guardar cambios" : "Subir banner"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label
      className="
        block

        mb-1.5

        text-sm
        font-semibold

        text-[--color-text-primary]
      "
    >
      {label}
    </label>

    {children}
  </div>
);

const inputStyle = `
  w-full

  px-3
  py-2.5

  bg-white

  border
  border-[--color-border]

  rounded-lg

  text-sm

  outline-none

  focus:border-[--color-accent]
`;

export default BannerModal;
