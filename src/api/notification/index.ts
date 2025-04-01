import { supabase } from "../../lib/supabase";

export async function sendPushNotification(expoPushToken: string, nrTrack: number) {
    const message = {
        to: expoPushToken,
        sound: "default",
        title: "Dodano nową trasę!",
        body: `Dodano trasę #${nrTrack}`,
        data: { someData: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
        mode: 'no-cors',
        method: "POST",
        headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
            Authorization: `Bearer 9MLLw4uhWof3nhY1OiBt7-QMhcPWNb7bO00V98Fl`
        },
        body: JSON.stringify(message),
    });
}

export const sendPushNotificationFn = async () => {
    const { data, error } = await supabase.functions.invoke('send-push-notification', {
        body: { name: 'Functions' },
    })

    return { data, error }
}