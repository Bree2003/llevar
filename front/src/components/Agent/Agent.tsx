import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Fab from "@mui/material/Fab";

import { ReactComponent as AgentIcon } from "../Global/Icons/agent_icon.svg";

const AGENT_FRONTEND_URL = process.env.REACT_APP_AGENT_FRONTEND_URL;

const Agent = () => {
  const handleClick = () => {
    if (!AGENT_FRONTEND_URL) return;

    window.open(AGENT_FRONTEND_URL, "_blank", "noopener,noreferrer");
  };

  return (
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
            backgroundColor: "#5B36E8",

            "&:hover": {
              backgroundColor: "#7C3AED",
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
  );
};

export default Agent;
