
import type { AuthUser } from "../types";
import { HTTP } from "../utils/http";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface AuthToken {
    access_token: string,
    refresh_token: string,
    expires_in: number,
    token_type: string,
}

export const useAuthStore = defineStore('authStore', () => {
    const user = ref<AuthUser>();
    const roles = ref<any>();
    const permissions = ref<any>();
    //@ts-ignore
    const accessTokenSaved = ref<any>(window.$userToken);
    const accessToken = computed(() => {
        return window.$userToken ?? accessTokenSaved.value
    });
    const authTokenInfos = ref<AuthToken | null>();
    const isLoged = computed(() => accessToken.value && accessToken.value.length > 0);
    //@ts-ignore
    const logout = async () => {
        HTTP.post(window.$modulesUrls.ssoServerLogoutUrl).then(() => {
            accessTokenSaved.value = undefined;
            user.value = undefined;
            roles.value = undefined;
            permissions.value = undefined;
            // window.location.href = SSOServerLoginUrl;
        })
    }
    const tokenIsExpire = computed(() => {
        const now = Date.now() / 1000;
        if (authTokenInfos.value?.expires_in && now > authTokenInfos.value?.expires_in) {
            return false;
        }
        return true;
    })
    const loadUser = async () => {
        user.value = (await HTTP.get(window.$modulesUrls.ssoServerUserInfoUrl)).data.user;
    }
    const setAccessToken = (tokenData: any) => {
        accessTokenSaved.value = tokenData.access_token;
        authTokenInfos.value = tokenData;
    }
    const setUser = (userData: any) => {
        user.value = userData;
    }

    return {
        user,
        accessToken,
        isLoged,
        permissions,
        roles,
        logout,
        loadUser,
        setUser,
        setAccessToken,
        tokenIsExpire,
        authTokenInfos,
    }
}, {
    persist: {
        key: 'authStore',
        pick: ['accessTokenSaved', 'authTokenInfos', 'roles', 'permissions']
    }
})
