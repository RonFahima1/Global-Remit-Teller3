
'use client';

import { NewClientForm } from "@/components/clients/NewClientForm";
import type { NewClientFormData } from "@/components/clients/types/form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useClient } from "@/context/ClientContext";

export default function NewClientPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { createClientFromForm } = useClient();
    const [isLoading, setIsLoading] = useState(false);

    const onCancel = () => {
        router.back();
    };

    const handleSubmit = async (data: NewClientFormData) => {
        setIsLoading(true);
        try {
            // Create client using the ClientContext
            createClientFromForm(data);
            
            toast({
                title: "Success",
                description: "Client created successfully",
            });
            router.push('/clients');
        } catch (error) {
            console.error("Error creating client:", error);
            toast({
                title: "Error",
                description: "Failed to create client",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">New Client</h1>
            <Card className="card-ios">
                <CardContent>
                    <NewClientForm
                        onSubmit={handleSubmit}
                        onCancel={onCancel}
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
