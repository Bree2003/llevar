import React from 'react';
import { IconType } from 'react-icons';
import {
    IoInformationCircleOutline,
    IoWarningOutline,
    IoCloseCircleOutline
} from 'react-icons/io5';

type AlertType = 'info' | 'warning' | 'error';
type AlertVariant = 'box' | 'compact';

interface AlertMessageProps {
    type?: AlertType;
    variant?: AlertVariant;
    children: React.ReactNode;
    className?: string;
}

type AlertConfig = {
    [key in AlertType]: {
        icon: IconType;
        styles: {
            container: string;
            icon: string;
        };
    };
};

type VariantStyles = {
    [key in AlertVariant]: string;
};

// Configuración de estilos e iconos para cada tipo de alerta
const alertConfig: AlertConfig = {
    info: {
        icon: IoInformationCircleOutline,
        styles: {
            container: 'bg-blue-50 border-blue-500 text-blue-800',
            icon: 'text-blue-500',
        },
    },
    warning: {
        icon: IoWarningOutline,
        styles: {
            container: 'bg-yellow-50 border-orange-500 text-yellow-800',
            icon: 'text-orange-500',
        },
    },
    error: {
        icon: IoCloseCircleOutline,
        styles: {
            container: 'bg-red-50 border-red-500 text-red-800',
            icon: 'text-red-500',
        },
    },
};

// Definición de las variantes de estilo
const variantStyles: VariantStyles = {
    box: 'p-4 border-l-4 rounded-r-md', // Estilo banner, con borde a la izquierda
    compact: 'p-2 border rounded-md', // Estilo más pequeño y sutil
};

const AlertMessage = ({
    type = 'info',
    variant = 'box',
    children,
    className = '',
}: AlertMessageProps) => {
    // 1. Obtenemos la configuración correcta
    const config = alertConfig[type];
    const baseVariantStyles = variantStyles[variant];

    if (!config) {
        return null;
    }

    const { icon: IconComponent, styles } = config;

    return (
        <div 
            className={`flex items-center gap-3 ${baseVariantStyles} ${styles.container} ${className}`}
            role='alert'
        >
            <div className="flex-shrink-0">
                <IconComponent aria-hidden="true" className={`h-5 w-5 ${styles.icon}`} />
            </div>
            <div className="flex-grow text-sm text-start">
                {children}
            </div>
        </div>
    );
};

export default AlertMessage;