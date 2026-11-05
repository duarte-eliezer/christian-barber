const SUPABASE_URL = "https://xqwullsydwdtimodgygl.supabase.co";

const SUPABASE_KEY = "sb_publishable_ZKsC3krH1eiXVQ7LQ90goQ_iqfigPDB";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);