import { useToast } from "@/hooks/use-toast";
import React, { useCallback, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit2, ImagePlus, Save } from "lucide-react";

import { Problem } from "@/types/supabasetable";

interface QuestionEditorProps {
    problem: Problem | null
    setProblem: React.Dispatch<React.SetStateAction<Problem | null>>;
}

const QuestionEditor = ( {problem, setProblem} : QuestionEditorProps) => {

    const { toast } = useToast();

    const [isEdittingTitle, setIsEditingTitle] = useState<boolean>(false);
    const [tempTitle, setTempTitle] = useState<string>(problem?.title || "Untitled Problem")
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');


    const handleTitleSave = () => {

        if (!tempTitle.trim()) {
            toast({
                variant: "destructive",
                title: "Invalid title",
                description: "Title cannot be empty!"
            });
            return;
        }

        if (problem) {
            setProblem({
                ...problem,
                title: tempTitle.trim()
            })
        } else {
            setProblem({
                id: 1,
                title: tempTitle.trim()

            })
        }
        setIsEditingTitle(false)
    }

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>)=> {

        const file = e.target.files?.[0]
        if (!file || !file.type.includes('image/')) {
            toast({
                variant: "destructive",
                title: "Invalid image selected",
                description: "Only png/jpg image file accepted!"
            })
            return;
        }

        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        }
        reader.readAsDataURL(file);

    }, [])


    return (
        <div className="w-full h-full space-y-4">

            {/* Title component */}
            <div className="space-y-2 flex items-center justify-between">
                <Label htmlFor="title" className="text-lg font-bold">Title</Label>
            </div>
            {isEdittingTitle ? 
                <div className="flex items-center justify-between space-x-2">
                    <Input
                        id="title"
                        className="w-full"
                        value={tempTitle}
                        onChange={(e)=>{setTempTitle(e.target.value)}}
                    />
                    <Button
                        onClick={handleTitleSave}
                    >
                        <Save className="icon"/>
                    </Button>
                </div>
            :
                <div className="text-foreground px-3 rounded-md bg-secondary flex items-center justify-between">
                    <p className="w-full">{tempTitle}</p>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={()=>setIsEditingTitle(true)}
                    >
                        <Edit2 className="icon"/>
                    </Button>
                </div>
            }

            {/* Image Component */}
            <div className="space-y-2">
                {preview !== '' ? 
                    <div>
                        <img
                            src={preview}
                            alt="image preview"
                            className="h-auto w-full rounded-md border border-border"
                        />
                    </div>
                :
                    <div className="w-full border-2 p-4 rounded-lg border-dashed group border-muted-foreground hover:border-primary">
                        <Label
                            htmlFor="image-upload"
                            className="cursor-pointer flex_col_center w-full"
                        >
                            <ImagePlus className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors"/>
                            <p className="text-sm text-center text-muted-foreground group-hover:text-primary">Click to upload problem img (png, jpg)</p>
                        </Label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>
                }
                
            </div>


        </div>
    )


}

export default QuestionEditor;