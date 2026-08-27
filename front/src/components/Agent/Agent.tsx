import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import { ReactComponent as AgentIcon } from '../Global/Icons/agent_icon.svg';

const AGENT_FRONTEND_URL = process.env.REACT_APP_AGENT_FRONTEND_URL;

const Agent = () => {
    const agent_text = "Hola 👋, soy tu asistente IA. ¿En qué puedo ayudarte?";

    const handleClick = () => {
        window.open(AGENT_FRONTEND_URL, '_blank');
    };

    return (
        <Box>
            <Tooltip
                title={agent_text}
                placement="left"
                slotProps={{
                    tooltip: {
                        sx: {
                            maxWidth: 170,
                        }
                    }
                }}
            >
                <Fab
                    aria-label="agent-redirect"
                    onClick={handleClick}
                    sx={{
                        backgroundColor: '#5B36E8',
                        '&:hover': { 
                            backgroundColor: '#7C3AED'
                        },
                        position: 'fixed',
                        bottom: 16,
                        right: 16
                    }}
                    >
                    <AgentIcon
                        width="28px"
                        height="28px"
                    />
                </Fab>
            </Tooltip>
        </Box>
    )
}

export default Agent;
