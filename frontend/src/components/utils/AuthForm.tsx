"use client";

import Logo from "@/components/utils/Logo";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface AuthFormField {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    component?: React.ReactNode;
}

interface AuthFormProps {
    title: string;
    fields: AuthFormField[];
    isLoading: boolean;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    submitButtonText: string;
    loadingButtonText: string;
    footer?: React.ReactNode;
    className?: string;
    renderField?: (field: AuthFormField) => React.ReactNode;
}

export const AuthForm = ({
    title,
    fields,
    isLoading,
    onSubmit,
    submitButtonText,
    loadingButtonText,
    footer,
    className,
    renderField
}: AuthFormProps) => {
    return (
        <div className="bg-background">
            <div className="flex_center w-full px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-md">
                    <div>
                        <div className="flex">
                            <Logo withText logoSize={40} />
                        </div>
                        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-black dark:text-white">
                            {title}
                        </h2>
                    </div>

                    <div className="mt-10">
                        <form onSubmit={onSubmit} className="space-y-6">
                            {fields.map((field) => (
                                <div key={field.id} className="space-y-2">
                                    <Label htmlFor={field.id} className="font-semibold text-md">
                                        {field.label}
                                    </Label>
                                    {renderField ? (
                                        renderField(field)
                                    ) : (
                                        <Input
                                            id={field.id}
                                            name={field.id}
                                            type={field.type}
                                            placeholder={field.placeholder || ""}
                                            required
                                            disabled={isLoading}
                                        />
                                    )}
                                </div>
                            ))}

                            {footer && <div className="w-full flex_col_center gap-1">
                                <Button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl w-[300px]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? loadingButtonText : submitButtonText}
                                </Button>
                                {footer}
                            </div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};