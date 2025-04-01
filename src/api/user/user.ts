import { supabase, supabaseAdmin } from '../../lib/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../providers/AuthProvider'

export const useUsers = () => {

    const { profile } = useAuth()
    const roles = profile === 'Admin'
        ? ['Guide', 'Announcer', 'RSW']
        : ['Guide']

    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const { data: user } = await supabaseAdmin.listUsers()
            const { data: profile } = await supabase
                .from('profiles')
                .select('id, full_name, group')
                .in('group', roles)

            const userTab = profile?.map((p) => {
                const u = user.users.find((x) => x.id === p.id)
                return ({
                    id: u?.id,
                    email: u?.email,
                    full_name: p.full_name,
                    group: p.group
                })
            })

            return userTab
        }
    })
}

export const useAnnouncers = () => {

    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const { data: user } = await supabaseAdmin.listUsers()
            const { data: profile } = await supabase
                .from('profiles')
                .select('id, full_name, group')
                .eq('group', 'Announcer')

            const userTab = profile?.map((p) => {
                const u = user.users.find((x) => x.id === p.id)
                return ({
                    id: u?.id,
                    email: u?.email,
                    full_name: p?.full_name || '',
                    group: p.group
                })
            })

            return userTab
        }
    })
}

export const useGuides = () => {

    const endTime = (start: string, time: number) => {
        const startTime = start.split(':').map((num) => Number(num))
        let h = startTime[0]
        let m = startTime[1]
        m = m + time
        h = h + Math.floor(m / 60)
        m = m % 60
        return h + ':' + m.toString().padStart(2, '0')
    }

    return useQuery({
        queryKey: ['guides'],
        queryFn: async () => {
            const { data } = await supabase
                .from('profiles')
                .select(`
                id, full_name,
                track(poczatek, czas,
                lab_list(),
                laboratory(ID_wydarzenia))
                `)
                .eq('group', 'Guide')

            return data?.map((guide) => {
                const labs = guide.track.filter((l) => l.laboratory.length > 0 && l.laboratory.some((el) => el.ID_wydarzenia === 1))
                const res = labs.map((lab => ({ poczatek: lab.poczatek, koniec: endTime(lab.poczatek, lab.czas) })))
                return { id: guide.id, name: guide.full_name, list: res }
            })

        }
    })
}

export const useUserById = (id: string) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            const { data } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', id)
                .single()

            return data
        }
    })
}

type UserType = {
    email: string,
    password: string,
    name: string,
    group: string
}

export const useCreateUser = () => {

    const quertClient = useQueryClient()

    return useMutation({
        async mutationFn(data: UserType) {
            const res = await supabaseAdmin.createUser({
                email: data.email,
                password: data.password,
                email_confirm: true
            })
            const { error, data: user } = await supabase
                .from('profiles')
                .update(
                    { full_name: data.name, group: data.group }
                )
                .eq('id', res.data.user?.id)
                .select()

            if (error) {
                throw new Error(error.message)
            }

            return user
        },

        async onSuccess() {
            await quertClient.invalidateQueries({ queryKey: ['user'] })
        }
    })
}

export const useUpdateUser = () => {

    const quertClient = useQueryClient()

    return useMutation({
        async mutationFn(data: any) {
            await supabase
                .from('profiles')
                .update({
                    full_name: data?.full_name,
                    group: data?.group
                })
                .eq('id', data?.id)
                .select()

            await supabaseAdmin.updateUserById(data?.id, { email: data?.email })
        },
        async onSuccess() {
            await quertClient.invalidateQueries({ queryKey: ['user'] })
        }
    })
}

export const useDeleteUser = () => {

    const quertClient = useQueryClient()

    return useMutation({
        async mutationFn(id: string) {
            await supabaseAdmin.deleteUser(id)
        },

        async onSuccess() {
            await quertClient.invalidateQueries({ queryKey: ['user'] })
        }
    })
}