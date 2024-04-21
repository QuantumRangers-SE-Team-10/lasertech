import { createClient } from '@supabase/supabase-js'

const supabaseUrl = `${window.location.origin}/supabase`
const supabaseKey = import.meta.env.VITE_DB_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


const querySupabase = async (
    table: string,
    method: string,
    id: Number | null,
    requestData: any
) => {
    let response: any;
    try {
        if (method == "get") {
            if (id) {
                const { data, error } = await supabase.from(table).select().eq('id', id)
                response = data?.at(0) || { error: `${table} not found` };
            } else {
                const { data, error } = await supabase.from(table).select()
                response = data;
            }
        } else if (method == "post") {
            const { data, error } = await supabase.from(table).insert(requestData).select()
            response = data?.at(0);
        } else if (method == "put") {
            const { data, error } = await supabase.from(table).update(requestData).eq('id', id).select()
            response = data?.at(0);
        } else if (method == "delete") {
            const { data, error } = await supabase.from(table).delete().eq('id', id).select()
            response = data?.at(0);
        }
    } catch (error) {
        response = { error: error.response, data: null };
    }
    return response;

};



export default querySupabase;