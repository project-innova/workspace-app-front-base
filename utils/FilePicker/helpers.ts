import { DriveModuleUrl } from "@/env";

const formatFileSize = (size: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return size.toFixed(2) + ' ' + units[unitIndex];
}

const url = (path: string) => {
    return DriveModuleUrl + '/' + path.replace(/^\/+/, '');
}

class SoundService {
    private sounds: Map<string, HTMLAudioElement> = new Map();

    constructor() {
        // Précharger les sons au démarrage
        this.preloadSounds();
    }

    private preloadSounds() {
        // Ajouter tous vos sons ici
        this.loadSound('notification', '/assets/sounds/notif-1.wav');
        this.loadSound('message', '/assets/sounds/notif-2.wav');
        // Ajouter d'autres sons si nécessaire
    }

    private loadSound(name: string, path: string) {
        const audio = document.getElementById('notification-sound') as HTMLAudioElement;
        audio.src = path;
        audio?.load(); // Précharge le son
        this.sounds.set(name, audio);
    }

    public play(name: string) {
        const sound = this.sounds.get(name);
        if (sound) {
            // Créer une nouvelle instance pour permettre plusieurs lectures simultanées
            const clone = sound.cloneNode() as HTMLAudioElement;
            clone.volume = 1;
            clone.play().catch(error => {
                console.warn('Erreur lors de la lecture du son:', error);
            });
        } else {
            console.warn(`Son "${name}" non trouvé`);
        }
    }
}
const generateId = () => {
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
}
function simulateSlowRequest<T>(data: T, delayMs: number = 2): Promise<T> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(data);
      }, delayMs*1000);
    });
  }
const getFolderSizeInfo = (folder:any) =>folder.meta.children_count + ' fichier'+(folder.meta.children_count > 1? 's' : '');
//const soundService = new SoundService();
export { formatFileSize, url,getFolderSizeInfo,generateId,simulateSlowRequest };
