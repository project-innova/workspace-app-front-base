
import type { AuthUser } from "../plugin/types";
import { HTTP } from "../utils/http";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAuthStore = defineStore('authStore', () => {
    const user = ref<AuthUser>();
    const roles = ref<any>();
    const permissions = ref<any>();
    const accessToken = ref<string>();
    const isLoged = computed(() => accessToken.value && accessToken.value.length > 0);

    const logout = async () => {
        HTTP.post(window.$modulesUrls.ssoServerLogoutUrl).then(() => {
            accessToken.value = undefined;
            user.value = undefined;
            roles.value = undefined;
            permissions.value = undefined;

            // window.location.href = SSOServerLoginUrl;
        })
    }
    const loadUser = async () => {
        user.value = (await HTTP.get(window.$modulesUrls.ssoServerUserInfoUrl)).data.user;
    }

    return {
        user,
        accessToken,
        isLoged,
        permissions,
        roles,
        logout,
        loadUser,
    }
}, {
    persist: {
        key: 'authStore',
        pick: ['accessToken', 'user', 'roles', 'permissions']
    }
})
