import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ImagePlus, Upload, Edit2, Save, X } from 'lucide-react';

interface UploadQuestionProps {
  onSave: (data: { title: string; imageFile: File }) => Promise<void>;
}

const UploadQuestion = ({ onSave }: UploadQuestionProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(true);
  const { toast } = useToast();

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.includes('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an image file (JPG or PNG)",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [toast]);

  const handleSave = async () => {
    if (!imageFile || !title.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both a title and an image",
      });
      return;
    }

    try {
      await onSave({ title: title.trim(), imageFile });
      toast({
        title: "Success",
        description: "Problem saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save the problem",
      });
    }
  };

  return (
    <Card className="w-full bg-background">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title" className="text-lg font-semibold">
                Problem Title
              </Label>
              {!isEditingTitle && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {isEditingTitle ? (
              <div className="flex gap-2">
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter problem title..."
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => title.trim() && setIsEditingTitle(false)}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="text-foreground py-2 px-3 rounded-md bg-secondary">
                {title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-lg font-semibold">Problem Image</Label>
            <div className="flex flex-col items-center gap-4">
              {imagePreview ? (
                <div className="relative w-full">
                  <img
                    src={imagePreview}
                    alt="Problem preview"
                    className="w-full h-auto rounded-lg border border-border"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-full h-64 border-2 border-dashed border-muted-foreground rounded-lg flex_col_center group cursor-pointer hover:border-primary transition-colors">
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer flex_col_center gap-2 p-6"
                  >
                    <ImagePlus className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                    <p className="text-muted-foreground group-hover:text-primary transition-colors">
                      Click to upload problem image
                    </p>
                    <p className="text-sm text-muted-foreground">
                      JPG or PNG accepted
                    </p>
                  </Label>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                className="hidden"
              />
              {imagePreview && (
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Change Image
                </Button>
              )}
            </div>
          </div>

          <Button
            className="w-full"
            disabled={!imageFile || !title.trim()}
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Problem
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadQuestion;