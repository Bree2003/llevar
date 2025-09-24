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
  color: #309F33;
  border: 1px solid #309F33;
  border-radius: 30px;
  background: #FFFFFF;
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
`;

export const Message = styled.h4`
  text-align: center;
  font-family: Helvetica;
  text-transform: none;
  font-size: 18px;
  font-weight: 400;
`;

export const LinkSmallMessage = styled.h4`
  text-align: center;
  font-family: Helvetica;
  text-transform: none;
  font-size: 18px;
  font-weight: 400;
  color: #309F33;
  border-bottom: 1px solid #309F33;
`;

export const LinkMessage = styled.h4`
  text-align: center;
  font-family: Helvetica;
  text-transform: none;
  font-size: 24px;
  font-weight: 500;
  color: #309F33;
  border-bottom: 1px solid #309F33;
`;
