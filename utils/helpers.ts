
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
const handleConfirmation = (option:{title:string,message:string,onConfirm:()=>void,onCancel:()=>void})=>{
    const ev = new CustomEvent('show-confirmation',{
        detail:option
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
export { formatDate, parseDate,handleConfirmation,formatFileSize };
