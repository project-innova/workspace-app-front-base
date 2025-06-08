
const formatDate = (date: Date, format: string): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

const parseDate = (dateString: string, format: string): Date => {
  const year = format.match(/YYYY/);
  const month = format.match(/MM/);
  const day = format.match(/DD/);
  const hours = format.match(/HH/);
  const minutes = format.match(/mm/);
  const seconds = format.match(/ss/);

  const dateParts = {
    year: year ? parseInt(dateString.substring(format.indexOf('YYYY'), format.indexOf('YYYY') + 4)) : 1970,
    month: month ? parseInt(dateString.substring(format.indexOf('MM'), format.indexOf('MM') + 2)) - 1 : 0,
    day: day ? parseInt(dateString.substring(format.indexOf('DD'), format.indexOf('DD') + 2)) : 1,
    hours: hours ? parseInt(dateString.substring(format.indexOf('HH'), format.indexOf('HH') + 2)) : 0,
    minutes: minutes ? parseInt(dateString.substring(format.indexOf('mm'), format.indexOf('mm') + 2)) : 0,
    seconds: seconds ? parseInt(dateString.substring(format.indexOf('ss'), format.indexOf('ss') + 2)) : 0,
  };

  return new Date(dateParts.year, dateParts.month, dateParts.day, dateParts.hours, dateParts.minutes, dateParts.seconds);
};
const handleConfirmation = (option: { title: string, message: string, onConfirm: () => void, onCancel: () => void }) => {
  const ev = new CustomEvent('show-confirmation', {
    detail: option
  });
  document.dispatchEvent(ev)
}
const formatFileSize = (size: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return size.toFixed(2) + ' ' + units[unitIndex];
}
const getCurrentDomain = () => (
  getUrlDomain(document.location.href)
)

const getUrlDomain = (url: string) => (
  url.match(/http[s]?:\/\/([^\/]+)/)?.[1] || ''
)

const isCurrentDomain = (url: string) => {
  return isSameDomain(document.location.href, url)
}


const extractDomain = (url: string) => {
  let domain = ''
  try {
    // Utilise l'objet URL natif pour extraire le hostname
    domain = new URL(url, window.location.origin).hostname;
  } catch (e) {
    // Si l'URL n'est pas valide, retourne une chaîne vide
    domain = '';
  }
  return domain;
};
/**
 * Compare deux URLs pour vérifier si elles appartiennent au même domaine,
 * même si elles contiennent des paramètres ou des chemins différents.
 * @param url1 Première URL à comparer
 * @param url2 Deuxième URL à comparer
 * @returns true si les deux URLs ont le même domaine, false sinon
 */
const isSameDomain = (url1: string, url2: string): boolean => {

  return extractDomain(url1) === extractDomain(url2);
};

// Pro tip : Utilisez cette fonction pour comparer les domaines lors de la gestion de redirections ou de vérifications de sécurité, 
// même si les URLs contiennent des paramètres ou des chemins différents !
export { formatDate, parseDate, handleConfirmation, formatFileSize, getCurrentDomain, getUrlDomain, isCurrentDomain, isSameDomain };
