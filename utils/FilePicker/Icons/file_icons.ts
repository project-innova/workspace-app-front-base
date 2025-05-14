import PDF from "./PDF.vue";
import Video from "./Video.vue";
import Audio from "./Audio.vue";
import Archive from "./Archive.vue";
import { FileIcon, ImageIcon } from "lucide-vue-next";
import MsWord from "./MsWord.vue";
import Powerpoint from "./Powerpoint.vue";
import TXT from "./TXT.vue";
import FolderIcon from "./FolderIcon.vue";

const icons = <{ [k: string]: any }>{
    image: ImageIcon,
    archive: Archive,
    folder: FolderIcon,
    parent: FolderIcon,
    audio: Audio,
    pdf: PDF,
    video: Video,
    word: MsWord,
    ppt: TXT,
    text: Powerpoint,
    other: FileIcon,
}

const _icons: Record<string, string> = {
    pdf: ('/assets/ic/PDF.svg'),
    doc: ('/assets/ic/DOC.svg'),
    docx: ('/assets/ic/DOCX.svg'),
    exe: ('/assets/ic/EXE.svg'),
    png: ('/assets/ic/PNG.svg'),
    zip: ('/assets/ic/ZIP.svg'),
    archive: ('/assets/ic/ZIP.svg'),
    xls: ('/assets/ic/XSL.svg'),
    xlsx: ('/assets/ic/XSL.svg'),
    excel: ('/assets/ic/XSL.svg'),
    ppt: ('/assets/ic/PPT.svg'),
    pptx: ('/assets/ic/PPTX.svg'),
    mp3: ('/assets/ic/MP3.svg'),
    mpeg: ('/assets/ic/MPEG.svg'),
    video: ('/assets/ic/MPEG.svg'),
    mov: ('/assets/ic/MOV.svg'),
    txt: ('/assets/ic/TXT.svg'),
    bmp: ('/assets/ic/BMP.svg'),
    ai: ('/assets/ic/AI.svg'),
    eps: ('/assets/ic/EPS.svg'),
    psd: ('/assets/ic/PSD.svg'),
    rar: ('/assets/ic/RAR.svg'),
    jpg: ('/assets/ic/JPG.svg'),
    pub: ('/assets/ic/PUB.svg'),
    jpeg: ('/assets/ic/JPG.svg'),
    svg: ('/assets/ic/SVG.svg'),
    gif: ('/assets/ic/GIF.svg'),
    mp4: ('/assets/ic/MP4.svg'),
    folder: ('/assets/ic/FOLDER.svg'),
    default: ('/assets/ic/FILE.svg'),
}
export const getIcon = (type: string) => {
    return _icons[type] || _icons.default;
}
export default icons;
