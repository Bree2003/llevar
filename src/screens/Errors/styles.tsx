import styled from "styled-components";

export const CenteredBox = styled.div`
  height: 400px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 200px;
  box-sizing: border-box;
  border-radius: 2px;
  gap: 20px;

  /* --- CAMBIOS --- */
  /* Usamos la variable CSS para el borde de acento */
  border: 1px solid var(--color-naranjo);
  border-radius: 30px;
  background: #FFFFFF; /* Mantenemos el fondo blanco para mayor claridad */
`;

export const Row = styled.div`
  display: flex;
`;

export const Title = styled.h4`
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 137.99%;
  text-align: center;

  /* --- CAMBIOS --- */
  /* El título lleva el color de acento principal */
  color: var(--color-naranjo);
`;

export const Message = styled.h4`
  text-align: center;
  font-family: Helvetica;
  text-transform: none;
  font-size: 18px;
  font-weight: 400;

  /* --- CAMBIOS --- */
  /* Usamos un color más oscuro y neutro para el mensaje, para mejor legibilidad */
  color: var(--color-gris-oscuro);
`;

export const LinkSmallMessage = styled.h4`
  text-align: center;
  font-family: Helvetica;
  text-transform: none;
  font-size: 18px;
  font-weight: 400;

  /* --- CAMBIOS --- */
  /* El enlace siempre debe tener el color de acento */
  color: var(--color-naranjo);
  border-bottom: 1px solid var(--color-naranjo);
`;

export const LinkMessage = styled.h4`
  text-align: center;
  font-family: Helvetica;
  text-transform: none;
  font-size: 24px;
  font-weight: 500;
  
  /* --- CAMBIOS --- */
  /* El enlace siempre debe tener el color de acento */
  color: var(--color-naranjo);
  border-bottom: 1px solid var(--color-naranjo);
`;