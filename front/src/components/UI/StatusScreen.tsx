import { ReactNode } from "react";

interface StatusScreenProps {
  icon: ReactNode;
  eyebrow?: string;
  title: string;
  message: ReactNode;
  actionLabel: string;
  onAction: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

const StatusScreen = ({
  icon,
  eyebrow,
  title,
  message,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: StatusScreenProps) => {
  return (
    <main
      className="
        w-full
        min-h-screen
        bg-[--color-background]
        flex
        items-center
        justify-center
        px-4
        py-8
      "
    >
      <div
        className="
          w-full
          max-w-[620px]
          bg-white
          border
          border-[--color-border]
          rounded-2xl
          shadow-sm
          px-6
          py-10
          md:px-10
          md:py-12
          text-center
        "
      >
        {/* Icono */}
        <div
          className="
            w-16
            h-16
            md:w-20
            md:h-20
            mx-auto
            rounded-full
            bg-[--color-accent-light]
            flex
            items-center
            justify-center
            text-[--color-accent]
          "
        >
          {icon}
        </div>

        {/* Eyebrow */}
        {eyebrow && (
          <p
            className="
              mt-6
              text-xs
              md:text-sm
              uppercase
              tracking-[0.14em]
              font-semibold
              text-[--color-text-muted]
            "
          >
            {eyebrow}
          </p>
        )}

        {/* Título */}
        <h1
          className="
            mt-3
            text-3xl
            md:text-4xl
            font-bold
            text-[--color-accent]
          "
        >
          {title}
        </h1>

        {/* Mensaje */}
        <div
          className="
            mt-4
            text-sm
            md:text-base
            leading-relaxed
            text-[--color-text-secondary]
            max-w-[480px]
            mx-auto
          "
        >
          {message}
        </div>

        {/* Acciones */}
        <div
          className="
            mt-8
            flex
            flex-col
            sm:flex-row
            justify-center
            gap-3
          "
        >
          {secondaryActionLabel && onSecondaryAction && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="
                w-full
                sm:w-auto
                px-5
                py-2.5
                rounded-[10px]
                border
                border-[--color-border]
                bg-white
                text-[--color-text-secondary]
                font-semibold
                hover:bg-[--color-background]
                transition-colors
              "
            >
              {secondaryActionLabel}
            </button>
          )}

          <button
            type="button"
            onClick={onAction}
            className="
              w-full
              sm:w-auto
              px-5
              py-2.5
              rounded-[10px]
              bg-[--color-accent]
              text-white
              font-semibold
              hover:opacity-90
              transition-opacity
            "
          >
            {actionLabel}
          </button>
        </div>

        {/* Footer visual */}
        <div
          className="
            mt-10
            pt-5
            border-t
            border-[--color-border]
          "
        >
          <p
            className="
              text-[10px]
              md:text-xs
              uppercase
              tracking-wide
              text-[--color-text-muted]
            "
          >
            Plataforma Inteligente de Datos
          </p>
        </div>
      </div>
    </main>
  );
};

export default StatusScreen;
