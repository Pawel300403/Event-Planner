import { supabase } from '../../lib/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '../../providers/FormProvider';
import { useNavigate } from 'react-router-dom';

type EventType = {
    id?: number;
    title: string;
    date: string; // ISO format: YYYY-MM-DD
    description: string;
    extra_info: string; // Możesz zamienić na typ `string[]`, jeśli chcesz przetwarzać informacje jako tablicę wierszy
    place: string;
    schedule: string; // Możesz zamienić na typ `string[]`, jeśli chcesz przetwarzać harmonogram jako tablicę wierszy
    time_start: string; // Format: HH:mm
    time_end?: string;   // Format: HH:mm
}

export const useEvent = () => {
    return (
        useQuery({
            queryKey: ['event'],
            queryFn: async () => {
                const { data } = await supabase
                    .from('events')
                    .select('*')
                return data?.sort((a, b) => a.date.localeCompare(b.date))
            }
        })
    )
}

export const useEventByID = (id: number) => {
    return (
        useQuery({
            queryKey: ['event', id],
            queryFn: async () => {
                const { data } = await supabase
                    .from('events')
                    .select('*')
                    .eq('id', id)
                    .single()
                return data as EventType
            }
        })
    )
}

export const useCreateEvent = () => {

    const { setEventID, setStatus } = useForm()
    const navigate = useNavigate()

    return useMutation({
        async mutationFn(data: EventType) {
            const { data: event } = await supabase
                .from('events')
                .insert([{
                    title: data.title,
                    date: data.date,
                    time_start: data.time_start,
                    place: data.place,
                    description: data.description,
                    schedule: data.schedule,
                    extra_info: data.extra_info
                }])
                .select()
                .single()
            return event
        },
        onSuccess: (data: EventType) => {
            console.log(data)
            console.log('only: ', data.id)
            data.id && setEventID(data.id)
            setStatus([true, false, false])
            navigate('/create-labs')
        }
    })
}

export const useUpdateEvent = () => {
    return useMutation({
        async mutationFn(data: any) {
            await supabase
                .from('events')
                .update(data.value)
                .eq('id', data.id)
                .select()
        }
    })
}

export const useDeleteEvent = () => {

    const queryClient = useQueryClient()

    return useMutation({
        async mutationFn(id: number) {
            await supabase
                .from('events')
                .delete()
                .eq('id', id)
        },
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ['event'] })
        }
    })
}