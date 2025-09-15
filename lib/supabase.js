import { createClient } from '@supabase/supabase-js'


export default async function locationsDB(){
    let supabase = null;
    try {
        supabase = createClient('https://ocovsegnbznppkruyuvw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jb3ZzZWduYnpucHBrcnV5dXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NTgxMzgsImV4cCI6MjA2ODEzNDEzOH0.EnOdBLgQ02IrY97mwlYCMhWk-jEfa6Nfg4udZHueLgA')
    console.log('supabase connected!')
    } catch (error) {
        console.log(error)
    }
    return supabase;
}
