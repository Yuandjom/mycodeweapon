"use client"

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Problem } from "@/types/supabasetable";

export const useProblem = (title : string) => {

	const [problem, setProblem] = useState<Problem | null>(null);
	const [fetchError, setFetchError] = useState<Error | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const processedTitle = title.replaceAll('-', ' ');

	useEffect(()=> {

		const fetchProblem = async () => {

			setFetchError(null);
			setIsLoading(true);

			if (processedTitle !== ""){
				let { data, error  } = await supabase
					.from('Problems')
					.select('*')
					.eq("title", processedTitle);
	
				console.log("Received data: ", data);
	
				if (data && !fetchError) {
					setProblem(data[0])
				} else {
					setFetchError(error);
				}
			} else {
				setProblem({
					id: 1,
					title: "",
				})
			}
			setIsLoading(false);
		}
		
		fetchProblem();

	}, [processedTitle]);

	return { problem, setProblem, fetchError, isLoading }
}