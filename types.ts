interface DgiwsFrontPlugin {
    appUrl: string,
    modulesUrls: DgiwsModules
}
interface DgiwsModules {
    dashboard: string;
    drive: string;
    chat: string;
    meet: string;
    team: string;
    contact: string;
    calendar: string;
    mail: string;
    whiteboard?: string;
    webSocket: string;
    ai: string;
    main: string;
    ssoServerUrl: string;
    ssoServerUserInfoUrl: string;
    ssoServerLogoutUrl: string;
}

interface Notification {
    id: string,
    title: string,
    message: string,
    date: string,
    action_status: boolean | null,
    url: string | null,
    item_id: string | null,
    type: string,
}

interface Profile {
    matricule: string
    first_name: string
    last_name: string
    full_name: string
    birthday: string | null
    avatar: string
    role: string
}

interface AuthUser {
    id: string
    email: string
    phone: string
    email_verified_at: boolean
    profile: Profile
}
interface TableColumn {
    label: string;
    key: string;
    type?: string;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
}

interface SelectOptionValueColor {
    textColor: string,
    bgColor: string,
    value: any
}

interface PaginatedCollection<T> {
    items: T[],
    pagination: {
        page: number,
        last_page: number,
        perpage: number,
        total_page: number,
        total_items: number,
        from: number|null,
        to: number|null,
        next_page: number | null,
        prev_page: number | null
    }
}

interface TableColumn {
    label: string;
    key: string;
    type?: string;
    colspan?: number;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
}
export type {
    DgiwsModules, DgiwsFrontPlugin, AuthUser, Notification, PaginatedCollection, SelectOptionValueColor, TableColumn
}
