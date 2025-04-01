import { createContext, PropsWithChildren, useContext, useState } from "react"

type FormData = {
    eventID: number,
    status: Boolean[],
    setEventID: (id: number) => void,
    setStatus: (status: boolean[]) => void
}

const FormContex = createContext<FormData>({
    eventID: 0,
    status: [false, false, false],
    setEventID: () => {},
    setStatus: () => {}
})

export default function FormProvider({ children }: PropsWithChildren) {

    const [status, setStatus] = useState<boolean[]>([])
    const [eventID, setEventID] = useState<number>(0)

    return (
        <FormContex.Provider value={{ eventID, status, setEventID, setStatus }}>
            {children}
        </FormContex.Provider>
    )
}

export const useForm = () => useContext(FormContex)