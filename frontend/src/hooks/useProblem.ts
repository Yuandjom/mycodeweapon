"use client"

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProblemActions, ProblemState } from "@/types/problem"

export const useProblem = (title: string, userId: string) => {

	const DEFAULT_PROBLEM_STATE : ProblemState = {
		problemId: -1,
		userId,
		title: "untitled",
		code: "# your code here", //TODO: make this dynamic based on languageId
		languageId: "71", // python's language Id
		questionImage: null,
		imagePreview: ""
	}

	const [problemStates, setProblemStates] = useState<ProblemState>(DEFAULT_PROBLEM_STATE)

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	// utility function
	const updateProblemStates = (newStates: Partial<ProblemState>) => {
		
		setProblemStates(prev => ({
			...prev,
			...newStates
		}))
	}

	if (process.env.NODE_ENV==="development") {
		useEffect(()=> {
			console.table(problemStates);
		}, [problemStates])
	}

	// init
	useEffect(()=> {

		const fetchProblem = async () => {

			setIsLoading(true);
			setError(null);
			const spacedTitle : string = title.replaceAll('-', ' ')

			if (spacedTitle.length === 0) {
				return;
			}

			try {
				const supabase = await createClient();
				const { data, error : fetchError } = await supabase
					.from("Problems")
					.select("*")
					.eq("title", spacedTitle)
					.single()
	
				if (fetchError) {
					setError(fetchError)
					return;
				}
	
				updateProblemStates({
					problemId: data.id,
					title: data.title,
					code: data.code,
					languageId: data.languageId,
				})
			} catch(err) {
				setError(err instanceof Error ? err : new Error('Failed to fetch problem'));
			} finally {
				setIsLoading(false);
			}

		}

		if (title!=="new") {
			fetchProblem();
		}


	}, [title, userId])

	const setTitle = (title: string) => {
		updateProblemStates({title: title.trim()})
	}

	const setQuestionImage = (questionImage: File | null) => {
		updateProblemStates({questionImage})
	}

	const setCode = (code: string) => {
		updateProblemStates({code})
	}

	const setLanguageId = (languageId : string) => {
		updateProblemStates({languageId})
	}

	const saveProblem = async () => {
		alert("TODO")
	}

	const resetProblem = () => {
		updateProblemStates(DEFAULT_PROBLEM_STATE);
	}

	return {
		problemStates,

		setTitle,
		setQuestionImage,
		setCode,
		setLanguageId,
		saveProblem,
		resetProblem,

		isLoading,
		isSaving,
		error
	}

}