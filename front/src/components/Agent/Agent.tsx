import { useState } from "react";

import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Fab from "@mui/material/Fab";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";

import { useAppSelector } from "store/hooks/redux-hooks";
import { checkPermission } from "modules/tokenPermission/utils/user-token.util";

import { ReactComponent as AgentIcon } from "../Global/Icons/agent_icon.svg";

const AGENT_FRONTEND_URL = process.env.REACT_APP_AGENT_DOCS_FRONTEND_URL;

const Agent = () => {
  const { user } = useAppSelector((state) => state.UserPermissions);

  const userPermissions = user.permissions;

  const [open, setOpen] = useState(false);

  /*
   * ANTES:
   *
   * const handleClick = () => {
   *   if (!AGENT_FRONTEND_URL) return;
   *
   *   window.open(
   *     AGENT_FRONTEND_URL,
   *     "_blank",
   *     "noopener,noreferrer",
   *   );
   * };
   */

  /*
   * AHORA:
   * El botón abre el chatbot dentro de la misma página.
   */
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const hasPermission = checkPermission(userPermissions, "reader");

  if (!hasPermission) {
    return null;
  }

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <Box>
        <Tooltip
          title={
            <Box>
              <Box
                component="p"
                sx={{
                  m: 0,
                  fontWeight: 600,
                }}
              >
                Hola 👋, soy tu asistente IA.
              </Box>

              <Box
                component="p"
                sx={{
                  m: 0,
                  mt: 0.3,
                }}
              >
                ¿En qué puedo ayudarte?
              </Box>
            </Box>
          }
          placement="left"
          arrow
          slotProps={{
            tooltip: {
              sx: {
                backgroundColor: "#FFFFFF",

                color: "var(--color-text-primary)",

                border: "1px solid var(--color-border)",

                boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.10)",

                maxWidth: {
                  xs: 170,
                  sm: 190,
                  md: 220,
                  xl: 260,
                },

                px: {
                  xs: 1.5,
                  md: 2,
                  xl: 2.5,
                },

                py: {
                  xs: 1,
                  md: 1.3,
                  xl: 1.5,
                },

                fontSize: {
                  xs: "11px",
                  sm: "12px",
                  md: "13px",
                  lg: "14px",
                  xl: "15px",
                },

                lineHeight: 1.4,

                borderRadius: "10px",
              },
            },

            arrow: {
              sx: {
                color: "#FFFFFF",

                "&::before": {
                  border: "1px solid var(--color-border)",
                },
              },
            },
          }}
        >
          <Fab
            aria-label="Abrir asistente IA"
            onClick={handleClick}
            sx={{
              backgroundColor: "var(--color-accent)",

              "&:hover": {
                backgroundColor: "var(--color-accent)",
              },

              position: "fixed",

              bottom: {
                xs: 12,
                sm: 14,
                md: 16,
                xl: 24,
              },

              right: {
                xs: 12,
                sm: 14,
                md: 16,
                xl: 24,
              },

              width: {
                xs: 48,
                sm: 50,
                md: 56,
                lg: 58,
                xl: 64,
              },

              height: {
                xs: 48,
                sm: 50,
                md: 56,
                lg: 58,
                xl: 64,
              },

              minHeight: 0,

              zIndex: 1200,
            }}
          >
            <AgentIcon
              style={{
                width: "52%",
                height: "52%",
              }}
            />
          </Fab>
        </Tooltip>
      </Box>

      {/* MODAL CHATBOT */}
      <Modal
        open={open}
        onClose={handleClose}
        keepMounted
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.18)",
            },
          },
        }}
      >
        <Box
          sx={{
            position: "fixed",

            right: {
              xs: 8,
              sm: 16,
              md: 24,
            },

            bottom: {
              xs: 70,
              sm: 78,
              md: 88,
            },

            width: {
              xs: "calc(100vw - 16px)",
              sm: 420,
              md: 460,
              lg: 500,
              xl: 540,
            },

            height: {
              xs: "calc(100vh - 90px)",
              sm: 600,
              md: 650,
              lg: 680,
              xl: 720,
            },

            maxHeight: "calc(100vh - 100px)",

            backgroundColor: "#FFFFFF",

            border: "1px solid var(--color-border)",

            borderRadius: {
              xs: "14px",
              sm: "16px",
            },

            boxShadow: "0px 12px 40px rgba(0, 0, 0, 0.22)",

            overflow: "hidden",

            outline: "none",

            display: "flex",

            flexDirection: "column",
          }}
        >
          {/* HEADER DEL CHAT */}
          <Box
            sx={{
              minHeight: 56,

              px: 2,

              display: "flex",

              alignItems: "center",

              justifyContent: "space-between",

              gap: 2,

              flexShrink: 0,

              backgroundColor: "#FFFFFF",

              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                minWidth: 0,
              }}
            >
              {/* ICONO */}
              <Box
                sx={{
                  width: 34,
                  height: 34,

                  borderRadius: "50%",

                  backgroundColor: "#5B36E8",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  flexShrink: 0,
                }}
              >
                <AgentIcon
                  style={{
                    width: "55%",
                    height: "55%",
                  }}
                />
              </Box>

              {/* TITULO */}
              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <Box
                  component="p"
                  sx={{
                    m: 0,

                    fontSize: "14px",

                    fontWeight: 700,

                    color: "var(--color-text-primary)",
                  }}
                >
                  Asistente IA
                </Box>

                <Box
                  component="p"
                  sx={{
                    m: 0,

                    mt: 0.1,

                    fontSize: "11px",

                    color: "var(--color-text-muted)",
                  }}
                >
                  Asistente de datos CyT
                </Box>
              </Box>
            </Box>

            {/* CERRAR */}
            <IconButton
              type="button"
              aria-label="Cerrar asistente"
              onClick={handleClose}
              size="small"
              sx={{
                color: "var(--color-text-secondary)",

                "&:hover": {
                  backgroundColor: "var(--color-background)",

                  color: "var(--color-text-primary)",
                },
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </IconButton>
          </Box>

          {/* CONTENIDO DEL CHAT */}
          <Box
            sx={{
              flex: 1,

              minHeight: 0,

              width: "100%",

              position: "relative",

              overflow: "hidden",

              backgroundColor: "#FFFFFF",
            }}
          >
            {AGENT_FRONTEND_URL ? (
              <iframe
                src={AGENT_FRONTEND_URL}
                title="Asistente IA CyT"
                width="100%"
                height="100%"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  display: "block",
                }}
                sandbox="
                  allow-scripts
                  allow-forms
                  allow-same-origin
                  allow-popups
                  allow-downloads
                "
                allow="clipboard-read; clipboard-write"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",

                  display: "flex",

                  flexDirection: "column",

                  alignItems: "center",

                  justifyContent: "center",

                  px: 4,

                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    borderRadius: "50%",

                    backgroundColor: "var(--color-background)",

                    mb: 2,
                  }}
                >
                  <AgentIcon
                    style={{
                      width: 26,
                      height: 26,
                    }}
                  />
                </Box>

                <Box
                  component="p"
                  sx={{
                    m: 0,

                    fontWeight: 700,

                    color: "var(--color-text-primary)",
                  }}
                >
                  No se pudo cargar el asistente
                </Box>

                <Box
                  component="p"
                  sx={{
                    m: 0,

                    mt: 1,

                    maxWidth: 320,

                    fontSize: "13px",

                    lineHeight: 1.5,

                    color: "var(--color-text-secondary)",
                  }}
                >
                  La variable REACT_APP_AGENT_DOCS_FRONTEND_URL no está configurada.
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Agent;
