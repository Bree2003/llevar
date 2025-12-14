import styled from "styled-components";

// Definimos el color naranja exacto que usamos en el Wizard
const BRAND_ORANGE = "#F46546";

export const CenteredBox = styled.div`
  width: 100%;
  max-width: 600px; /* Limitamos el ancho para que se vea elegante */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 40px; /* Más espacio interno */
  box-sizing: border-box;
  gap: 24px;
  margin: 40px auto; /* Centrado vertical y horizontal */

  /* --- ESTÉTICA DATA PRODUCT (Igual al Wizard) --- */
  background: #ffffff;
  border: 1px solid #e5e7eb; /* Gris suave (gray-200) */
  border-radius: 16px; /* rounded-xl */

  /* Sombra suave estilo shadow-xl */
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
`;

export const Row = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const Title = styled.h1`
  /* Cambiado a H1 para mejor semántica */
  font-style: normal;
  font-weight: 800;
  font-size: 32px;
  line-height: 1.2;
  text-align: center;
  margin: 0;

  /* Color Naranja Corporativo */
  color: var(--color-naranjo, ${BRAND_ORANGE});
`;

export const Message = styled.p`
  text-align: center;
  font-family: sans-serif; /* Fuente estándar */
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: #6b7280; /* Gris texto (gray-500) para mejor lectura */
  margin: 0;
  max-width: 80%;
`;

// Botón estilo "Enlace" pero con presencia
export const LinkMessage = styled.span`
  text-align: center;
  font-family: sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  /* Color Naranja */
  color: var(--color-naranjo, ${BRAND_ORANGE});
  border-bottom: 2px solid transparent;

  &:hover {
    color: #d95436; /* Un naranja un poco más oscuro al hover */
    border-bottom: 2px solid #d95436;
  }
`;
