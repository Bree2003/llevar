export const getValidSapModuleLabel = (bucketName: string): string | null => {
  if (!bucketName) return null;

  const regex = /^raw-dev-ddo-([a-z]{2})-bucket$/;
  const match = bucketName.match(regex);

  if (match && match[1]) {
    return `Módulo ${match[1].toUpperCase()}`;
  }

  // Si es "manual", "mts" (como bucket), o cualquier otra cosa rara, devuelve null
  return null; 
};

export const formatProductName = (productName: string): string => {
  if (!productName) return "";
  
  // Lista de palabras que no deberían capitalizarse (opcional)
  const connectors = ['de', 'del', 'el', 'la', 'en', 'y'];

  return productName
    .replace(/-/g, ' ')      // Guiones a espacios
    .replace(/_/g, ' ')      // Guiones bajos a espacios
    .split(' ')
    .map((word, index) => {
        // Capitalizar siempre la primera, el resto depende si es conector
        if (index > 0 && connectors.includes(word.toLowerCase())) {
            return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};