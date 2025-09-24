import styled from "styled-components";

export const ButtonPanel = styled.div`
  & button {
    color: rgba(255, 255, 255, 1);
    background: rgba(48, 159, 51, 1) !important;
    border: 1px solid rgba(48, 159, 51, 0.12);
  }
  & button:disabled {
    color: rgba(128, 130, 133, 1);
    background: rgba(241, 245, 249, 1) !important;
    border: 1px solid rgba(48, 159, 51, 0.12);
  }
`;

export const BoxBody = styled.div`
    width: 300px;
    border-radius: 8px;
    padding: 12px 24px 12px 24px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 10px 5px 5px #0F0F0F;
`;

export const BodyTitle = styled.div`
    font-family: Roboto;
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    text-align: left;
    color: #309F33;
    margin-bottom: 8px;
`;

export const BodyText = styled.div`
    font-family: Roboto;
    font-size: 16px;
    font-weight: 400;
    line-height: 25.6px;
    text-align: left;
    color: #0F0F0F;
`;
