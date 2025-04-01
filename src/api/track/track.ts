import { supabase } from '../../lib/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

type TrackType = {
    czas: number
    id_lab: number
    kolejnosc: number
    nazwa: string
    opoznienie: string
    poczatek: string
    rodzaj: string
}

type TracksType = {
    guide: string,
    id: number,
    tracks: TrackType[]
}

export const useTrack = (id: number) => {
    return useQuery({
        queryKey: ['track', id],
        queryFn: async () => {
            const { data } = await supabase
                .from('track')
                .select(`
                    ID_przewodnika,
                    ID,
                    laboratory(*),
                    lab_list(*)
                    `)
                .eq('laboratory.ID_wydarzenia', id)
            return data
                ?.filter((track) => track.laboratory.length > 0 && track.laboratory.length > 0)
                .map((track) => {
                    const guide = track.ID_przewodnika
                    const ID = track.ID
                    const labs = track.laboratory.map((lab) => ({
                        id_lab: lab.ID,
                        nazwa: lab.nazwa,
                        rodzaj: lab.rodzaj,
                        czas: lab.czas
                    }))
                    const list = track.lab_list.map((item) => ({
                        id_lab: item.ID_lab,
                        kolejnosc: item.kolejnosc,
                        opoznienie: item.opoznienie,
                        poczatek: item.godzina_rozpoczecia
                    }))
                    const merge = labs.map((lab) => {
                        const matchingItem = list.find((item) => item.id_lab === lab.id_lab)
                        return {
                            ...lab,
                            ...matchingItem
                        }
                    }) as TrackType[]
                    const tracks = merge.sort((a, b) => a.kolejnosc - b.kolejnosc)
                    return { guide: guide, tracks: tracks, id: ID } as TracksType
                })
        }
    })
}

export const useTrackByID = (trackID: number | undefined | null) => {

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
        queryKey: ['track', trackID],
        queryFn: async () => {
            const { data } = await supabase
                .from('track')
                .select(`
                    ID_przewodnika,
                    ID,
                    poczatek,
                    czas,
                    lab_list(kolejnosc, ID_lab, godzina_rozpoczecia)
                    `)
                .eq('ID', trackID)
                .maybeSingle()

            // if (error) {
            //     throw new Error(error.message)
            // }

            return {
                id: data?.ID,
                przewodnik: data?.ID_przewodnika,
                labs: data?.lab_list.sort((a, b) => a.kolejnosc - b.kolejnosc),
                poczatek: data?.poczatek,
                koniec: endTime(data?.poczatek, data?.czas)
            }
        }
    })
}

type CreateTrack = {
    ID_przewodnika: string,
    ilosc_osob: number,
    poczatek: string,
    czas: number
}

export const useCreateTrack = () => {
    return useMutation({
        async mutationFn(data: CreateTrack) {
            const { data: newTrack } = await supabase
                .from('track')
                .insert(data)
                .select()
                .single()

            return newTrack
        }
    })
}

export const useUpdateTrack = () => {
    return useMutation({
        async mutationFn({ id, data }: { id: number, data: any }) {
            await supabase
                .from('track')
                .update(data)
                .eq('ID', id)
        }
    })
}

export const useDeleteTrack = () => {

    const queryClient = useQueryClient()

    return useMutation({
        async mutationFn(id: number) {
            await supabase
                .from('track')
                .delete()
                .eq('ID', id)
        },
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ['track'] })
        }
    })
}