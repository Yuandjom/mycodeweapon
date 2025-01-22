"use client"

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { ProblemState } from "@/types/problem"

export const useProblem = (title: string, user: User | null) => {

	const DEFAULT_PROBLEM_STATE : ProblemState = {
		problemId: "-1",
		userId: user?.id || "-",
		title: "untitled",
		status: "In Progress",
		code: "# your code here", //TODO: make this dynamic based on languageId
		languageId: "71", // python's language Id
		questionImage: null,
		imageUrl: null,
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

	// use to assist in deleting redundant images
	const [oldImagePath, setOldImagePath] = useState<string | null>(null);

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
				
				// fetch the image if such exist
				if (data.imageUrl) {
					try {
						console.log(`[useProblem] fetchProblem() - imageUrl: ${data.imageUrl}`)

						// cache this imageUrl's filepath
						const storagePathRegex = data.imageUrl.match(/problemImages\/(.+)(\?.*|$)/)
						const storagePath = storagePathRegex ? storagePathRegex[1] : null;
						console.log(`[useProblem] fetchProblem() - storagePath: ${storagePath}`)
						setOldImagePath(storagePath)

						updateProblemStates({
							imagePreview: data.imageUrl,
							imageUrl: data.imageUrl
						});

						const response = await fetch(data.imageUrl);
						const blob = await response.blob();
						
						// Get file extension from URL
						const fileExt = data.imageUrl.split('.').pop()?.split('?')[0] || 'png';
						const fileName = `${data.id}.${fileExt}`;
						
						const imageFile = new File([blob], fileName, { type: `image/${fileExt}` });
						updateProblemStates({ questionImage: imageFile });

					} catch (err) {
						console.error("[useProblem] Error fetching image:", err);
					}
				}
	
				updateProblemStates({
					problemId: data.id,
					title: data.title,
					code: data.code,
					languageId: data.languageId,
				})

				console.log("[useProblem] fetched & processe data:")
				console.table(data)
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
		updateProblemStates({title: title.trim().toLowerCase()})
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

			let problemId : string = problemStates.problemId

			const toInsertData = {
				title: problemStates.title,
				userId: problemStates.userId,
				code: problemStates.code,
				languageId: problemStates.languageId
			};

			// new problem to insert
			if (problemId === "-1") {

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

				problemId = data.id
				updateProblemStates({problemId: data.id})
			
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
				console.log("[useProblem] problem data upserted to DB: ", problemId)
			}

			// if there's images in storage, delete first
			if (oldImagePath) {

				const { error: deleteError } = await supabase.storage
					.from("problemImages")
					.remove([oldImagePath])
				
				if (deleteError) {
					throw deleteError;
				}
			}

			// handle image upload to storage if any
			if (problemStates.questionImage) {
				console.log("[useProblem] saveProblem() - Saving to storage bucket")
	
				const fileExt = problemStates.questionImage.name.split('.').pop();
	
				const fileStorePath = `${problemStates.userId}/${problemId}.${fileExt}`
				
				const { error : UploadError } = await supabase.storage
					.from("problemImages")
					.upload(fileStorePath, problemStates.questionImage, {
						cacheControl: '3600',
						upsert: true
					});
				
					if (UploadError) {
						throw UploadError
					}
	
				const { data: { publicUrl } } = supabase.storage
					.from("problemImages")
					.getPublicUrl(fileStorePath);
	
				const { error: imageUrlUpdateError } = await supabase
					.from("Problems")
					.update({imageUrl: publicUrl})
					.eq("id", problemId)
					.eq("userId", problemStates.userId)
	
				if (imageUrlUpdateError) {
					throw imageUrlUpdateError;
				}
			
				
			} else { // no image given in this saveProblem() request
				const { error: imageUrlUpdateError } = await supabase
					.from("Problems")
					.update({imageUrl: null})
					.eq("id", problemId)
					.eq("userId", problemStates.userId)

				if (imageUrlUpdateError) {
					throw imageUrlUpdateError
				}
			}

		} catch (err) {
			console.log("[useProblem] error in saving problem:");
			console.log(err);
			setError(err instanceof Error ? err : new Error("Unexpected error occured") )
		} finally {
			setIsSaving(false);
			console.log("[useProblem] saveProblem() completed")

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