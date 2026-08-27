const Footer = () => {

  const currentYear = new Date().getFullYear();

  return (
    <footer className="p-4 bg-[--color-background] text-right text-xs text-[--color-text-muted]">
      <hr className="border-t-2 border-[--color-border]" />
      <h4 className="mt-4">&copy;
        {` ${currentYear}`} VIÑA CONCHA Y TORO - ANALYTICS HUB</h4>
      <h4 className="">IMPULSANDO DECISIONES BASADAS EN DATOS EN TODA LA ORGANIZACIÓN</h4>
    </footer>
  );
};

export default Footer;
