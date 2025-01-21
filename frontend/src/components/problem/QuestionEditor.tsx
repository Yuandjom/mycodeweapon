import { useToast } from "@/hooks/use-toast";
import React, { useCallback, useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit2, ImagePlus, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { Problem } from "@/types/supabasetable";

interface QuestionEditorProps {
    imageUrl: string | null,
    title: string,
    setTitle: (title: string) => void,
    image: File | null,
    setImage: (file: File | null) => void

}

const QuestionEditor = ( {imageUrl, title, setTitle, image, setImage} : QuestionEditorProps) => {

    const { toast } = useToast();

    const [isEdittingTitle, setIsEditingTitle] = useState<boolean>(false);
    const [tempTitle, setTempTitle] = useState<string>(title)
    const [preview, setPreview] = useState<string>(imageUrl || "");

    useEffect(()=>{
        setTempTitle(title);
    }, [title])

    useEffect(()=>{
        setPreview(imageUrl || "");
    }, [imageUrl])

    const handleTitleSave = () => {
        setTitle(tempTitle.trim());
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

    const handleImageDelete = () => {
        setImage(null);
        setPreview("");
    }


    return (
        <div className="w-full h-full flex flex-col space-y-4">

            {/* Title component */}
            <div className="space-y-2 flex justify-start items-baseline gap-4">
                <Label htmlFor="title" className="text-lg font-bold text-left">Title</Label>
                {isEdittingTitle ? 
                    <div className="flex items-center justify-between space-x-2">
                        <Input
                            id="title"
                            className="w-full bg-secondary"
                            value={tempTitle}
                            onChange={(e)=>{setTempTitle(e.target.value)}}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleTitleSave()
                                }
                            }}
                        />
                        <Button
                            onClick={handleTitleSave}
                        >
                            <Save className="icon"/>
                        </Button>
                    </div>
                :
                    <div className="text-foreground px-3 rounded-md flex items-center justify-between">
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
            
            
            </div>
            

            {/* Image Component */}
            <ImageUploadSection 
                preview={preview}
                handleImageUpload={handleImageUpload}
                handleImageDelete={handleImageDelete}
            />
        
        </div>

    )
}
interface ImageUploadSectionProps {
    preview: string;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleImageDelete: () => void;
}


const ImageUploadSection = ({ preview, handleImageUpload, handleImageDelete } : ImageUploadSectionProps) => {
    const triggerFileInput = () => {
        document.getElementById('image-upload')?.click();
    };

    return (
        <div className={`flex-grow min-h-0 space-y-2 ${preview ? "" : "rounded-lg transition-colors border-2 border-dashed group border-muted-foreground hover:border-primary"}`}>
            <div className={cn(
                "w-full h-[calc(100%-1rem)]",
                preview ? "overflow-y-auto" : "flex items-center"
            )}>
                {preview ? (
                    <div className="relative group">
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleImageDelete}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <img
                            src={preview}
                            alt="question preview"
                            className="w-full rounded-md border border-border"
                        />
                    </div>
                ) : (
                    <div 
                        className="w-full h-full cursor-pointer" 
                        onClick={triggerFileInput}
                    >
                        <div className="w-full h-full p-4 flex_col_center">
                            <ImagePlus className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                            <p className="text-sm text-center text-muted-foreground group-hover:text-primary">
                                Click to upload problem img (png, jpg)
                            </p>
                        </div>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionEditor;

