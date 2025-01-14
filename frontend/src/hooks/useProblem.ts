"use client"

import { createClient } from "@/lib/supabase/client";
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
			setProblem(null);

			if (processedTitle !== ""){
				const supabase = await createClient();
				let { data, error  } = await supabase
					.from('Problems')
					.select('*')
					.eq("title", processedTitle);
				
				if (!error && data?.length == 0) {
					setFetchError(Error("No problem found"))
				} else if (!error && data) {
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