import { useAdminStore, useUserStore } from '@/stores/user'
import { getAdminToken } from '@/apis/getAdminToken'
import { baseConfig } from '@/utils/config'
import { useChatStore } from '@/stores/chat'
import type { NewFriend } from '@/types'
import { useChatListStore } from '@/stores/chatList'

export interface AdminStorage {
    application: string
    time: number
    token: string
}

export const init = {
    async initAdmin() {
        const adminStore = useAdminStore()
        const adminToken = localStorage.getItem('adminToken')
        if (!adminToken) {
            const result = await getAdminToken({
                grant_type: 'client_credentials',
                client_id: baseConfig.clientID,
                client_secret: baseConfig.clientSecret,
                ttl: 0,
            })

            adminStore.setToken(result.access_token)
            adminStore.setApplication(result.application)
            adminStore.setTime(result.expires_in)
            localStorage.setItem(
                'adminToken',
                JSON.stringify({
                    application: result.application,
                    time: result.expires_in,
                    token: result.access_token,
                })
            )
            return
        }
        const adminInfo: AdminStorage = JSON.parse(adminToken)
        adminStore.setToken(adminInfo.token)
        adminStore.setApplication(adminInfo.application)
        adminStore.setTime(adminInfo.time)
    },
    initUser() {
        const userStore = useUserStore()
        const chatStore = useChatStore()
        const router = useRouter()
        const userToken = localStorage.getItem('userToken')
        if (!userToken) {
            router.replace('/begin')
            return
        }
        const userId = localStorage.getItem('userId')
        userStore.setToken(userToken)
        userStore.setUserID(userId || '')
        chatStore.setUserId(userId || '')
    },
    initNewFriend() {
        const newFriend = localStorage.getItem('newFriend')

        if (newFriend) {
            const newList: NewFriend[] = JSON.parse(newFriend)

            const chatListStore = useChatListStore()
            chatListStore.newFriends = newList
        }
    },
}
