"use client"

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { ProblemActions, ProblemState } from "@/types/problem"

export const useProblem = (title: string, user: User | null) => {

	const DEFAULT_PROBLEM_STATE : ProblemState = {
		problemId: -1,
		userId: user?.id || "-",
		title: "untitled",
		code: "# your code here", //TODO: make this dynamic based on languageId
		languageId: "71", // python's language Id
		questionImage: null,
		imagePreview: ""
	}

	// for updating user details when user are loaded asynchronously
	useEffect(()=>{
		if (user) {
			updateProblemStates({userId: user.id})
			console.log(`[useProblem] updated userId: ${user.id}`)
		}
	}, [user])

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

	// init
	useEffect(()=> {

		const fetchProblem = async () => {

			if (!user) return;

			setIsLoading(true);
			setError(null);

			const spacedTitle : string = title.replaceAll('-', ' ')
			const userId : string = user.id;

			if (spacedTitle.length === 0) {
				return;
			}

			try {
				const supabase = await createClient();
				const { data, error : fetchError } = await supabase
					.from("Problems")
					.select("*")
					.eq("userId", userId)
					.eq("title", spacedTitle)
					.single()
	
				if (fetchError) {
					throw fetchError;
				}

				console.log("[useProblem] fetched data:")
				console.table(data)
	
				updateProblemStates({
					problemId: data.id,
					title: data.title,
					code: data.code,
					languageId: data.languageId,
				})
			} catch(err) {
				console.log("[useProblem] error:")
				console.log(err);
				setError(err instanceof Error ? err : new Error('Failed to fetch problem'));
			}

		}

		if (title!=="new") {
			fetchProblem();
		}

		setIsLoading(false);


	}, [title, user])

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

		setIsSaving(true);
		setError(null);

		console.log(`[useProblem] Saving problem with userId: ${problemStates.userId}`)

		try {

			const supabase = createClient();

			const toInsertData = {
				title: problemStates.title,
				userId: problemStates.userId,
				code: problemStates.code,
				languageId: problemStates.languageId
			};

			// new problem to insert
			if (problemStates.problemId === -1) {

				console.log("[useProblem] fresh insert")
				console.log(toInsertData)

				const { data, error: supaError } = await supabase
					.from("Problems")
					.insert(toInsertData)
					.select("id")
					.single();

				if (supaError) {
					throw supaError
				}

				const insertedProblemId = data.id
				updateProblemStates({problemId : insertedProblemId})
			
			// update previously inserted problem
			} else {

				console.log("[useProblem] update")
				console.log(toInsertData)

				const { data, error: supaError } = await supabase
					.from("Problems")
					.update(toInsertData)
					.eq("id", problemStates.problemId)	
				
				if (supaError) {
					throw supaError
				}
			}
			if (process.env.NODE_ENV==="development") {
				console.log("[useProblem] problem data upserted to DB: ", problemStates.problemId)
			}

			// TODO: handle image upload to storage



		} catch (err) {
			console.log("[useProblem] error in saving problem:");
			console.log(err);
			setError(err instanceof Error ? err : new Error("Unexpected error occured") )
		} finally {
			setIsSaving(false);
		}
	}

	const resetProblem = () => {
		updateProblemStates(DEFAULT_PROBLEM_STATE);
		setError(null);
		setIsLoading(false);
		setIsSaving(false);
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