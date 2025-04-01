import { supabase } from '../../lib/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

type LabType = {
    ID: number;
    numer_sali: string;
    nazwa: string;
    rodzaj: string;
    max_liczba: number;
    opis: string | null;
    ID_prowadzacego: string; // UUID format
    id_zdjecia: string; // UUID format or file name
    czas: number;
    ID_wydarzenia: number;
    profiles: {
        full_name: string;
    };
}

export const useLabByEvent = (eventID: number) => {
    return useQuery({
        queryKey: ['lab', eventID],
        queryFn: async () => {
            const { data } = await supabase
                .from('laboratory')
                .select(`*,
                    profiles(full_name)
                    `)
                .eq('ID_wydarzenia', eventID)

            return data as LabType[]
        }

    })
}

type Schedule = {
    start: string,
    end: string
}

type LabSchedule = {
    id: string,
    name: string,
    time: string,
    type: string,
    schedule: Schedule[],
    people: number
}

export const useLabs = (id: number, idTrack: number | undefined | null) => {

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
        queryKey: ['labs'],
        queryFn: async () => {
            const query = supabase
                .from('laboratory')
                .select(`
                ID,
                nazwa,
                czas,
                max_liczba,
                rodzaj,
                lab_list(godzina_rozpoczecia)
                `)
                .eq('ID_wydarzenia', id)
            if (idTrack) {
                query.neq('lab_list.ID_trasy', idTrack);
            }

            const { data } = await query

            return data
                ?.map((lab) => ({
                    id: lab.ID,
                    name: lab.nazwa,
                    time: lab.czas.toString(),
                    people: lab.max_liczba,
                    type: lab.rodzaj,
                    schedule: lab.lab_list.map((l) => ({
                        start: l.godzina_rozpoczecia,
                        end: endTime(l.godzina_rozpoczecia, lab.czas)
                    })) as Schedule[]
                })) as LabSchedule[]
        }
    })
}

type AddLabType = {
    ID_trasy: number,
    ID_lab: number,
    godzina_rozpoczecia: string,
    kolejnosc: number
}

export const useAddLab = () => {
    return useMutation({
        async mutationFn(data: AddLabType[]) {
            await supabase
                .from('lab_list')
                .insert(data)
                .select()
        }
    })
}

export const useDeleteTrackDetails = () => {
    return useMutation({
        async mutationFn(id: number) {
            await supabase
                .from('lab_list')
                .delete()
                .eq('ID_trasy', id)
        }
    })
}

export const useCreateLab = () => {
    return useMutation({
        async mutationFn(data: any) {
            await supabase
                .from('laboratory')
                .insert(data)
                .select()
        }
    })
}

export const useUpdateLab = () => {
    return useMutation({
        async mutationFn(data: any) {
            await supabase
                .from('laboratory')
                .update({
                    nazwa: data.nazwa,
                    rodzaj: data.rodzaj,
                    numer_sali: data.numer_sali,
                    max_liczba: data.max_liczba,
                    czas: data.czas,
                    ID_prowadzacego: data.ID_prowadzacego,
                    opis: data.opis
                })
                .eq('ID', data.id)
                .select()
        }
    })
}

export const useDeleteLab = () => {
    const quertClient = useQueryClient()

    return useMutation({
        async mutationFn(id: number) {
            await supabase
                .from('laboratory')
                .delete()
                .eq('ID', id)
                .select()
        },
        async onSuccess() {
            await quertClient.invalidateQueries({ queryKey: ['lab'] })
        }
    })
}