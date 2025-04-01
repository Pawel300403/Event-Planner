import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";

type AuthData = {
    session: Session | null
    loading: boolean
    profile: string
}

const AuthContext = createContext<AuthData>({
    session: null,
    loading: true,
    profile: ""
})


export default function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState("")

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)

            if (session) {
                // fetch profile
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()
                setProfile(data.group || "")
            }

            setLoading(false)
        }

        fetchSession()
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (session) {
                const fetchProfile = async () => {
                    const { data } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single()
                    setProfile(data.group || "")
                }
                fetchProfile()
            } else {
                setProfile("")
            }
        })
    }, [])

    return (
        <AuthContext.Provider value={{ session, loading, profile }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)