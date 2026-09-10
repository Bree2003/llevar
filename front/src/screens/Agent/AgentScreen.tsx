import { useRef } from "react";

const AgentScreen = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const CHILD_APP_URL = process.env.REACT_APP_AGENT_FRONTEND_URL;

  return (
    <main
      className="
        w-full
        h-full
      "
    >
      <iframe
        ref={iframeRef}
        src={CHILD_APP_URL}
        title="Documental Agent CyT"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        sandbox="allow-scripts allow-forms allow-same-origin"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </main>
  );
};

export default AgentScreen;
