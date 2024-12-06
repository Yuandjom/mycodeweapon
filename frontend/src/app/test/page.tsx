"use client"

import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function TestPage(){

    useEffect(() => {
        const fetchData = async () => {
            
            let { data, error } = await supabase
                .from('Problems')
                .select('*')
            console.log("Error: ", error);
            console.log("Data: ", data);

        }
        
        fetchData();
    
    }, [])
    

  
    return (
        <div>
            <p>Test</p>
            <p>{process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
            <p>{process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}</p>
        </div>
    )

}