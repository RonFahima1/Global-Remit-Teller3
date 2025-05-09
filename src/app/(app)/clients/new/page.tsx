
'use client';

import { NewClientForm, type NewClientFormData } from "@/components/clients/NewClientForm";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { useState } from "react";

export default function NewClientPage() {
    const router = useRouter();
    const { toast } = useToast(); // Get toast function
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: NewClientFormData, files: Record<string, File | null>) => {
        setIsLoading(true);
        console.log("Submitting New Client Data:", data);
        console.log("Submitting Attached Files:", files);

        // --- Mock API Call ---
        // Simulate network delay and potential API interaction
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate success/failure (replace with actual API call logic)
        const success = Math.random() > 0.2; // 80% chance of success

        // --- End Mock API Call ---


        setIsLoading(false);

        if (success) {
            // In a real application, you would send the data and files to your API endpoint here.
            // Example using FormData:
            // const formData = new FormData();
            // Object.entries(data).forEach(([key, value]) => {
            //     // Ensure value is not null/undefined before appending
            //     if (value !== undefined && value !== null) {
            //         // Convert boolean/number to string if necessary for FormData
            //         formData.append(key, String(value));
            //     }
            // });
            // Object.entries(files).forEach(([key, file]) => {
            //     if (file) {
            //         formData.append(key, file);
            //     }
            // });
            // try {
            //     // Replace '/api/clients' with your actual API endpoint
            //     const response = await fetch('/api/clients', {
            //         method: 'POST',
            //         body: formData,
            //         // Add headers if needed (e.g., for authentication)
            //     });
            //     if (!response.ok) {
            //         // Handle non-successful responses (e.g., 4xx, 5xx)
            //         const errorData = await response.json().catch(() => ({ message: 'Failed to create client' }));
            //         throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            //     }
            //     const result = await response.json();
            //     console.log('Client created successfully:', result);
                toast({
                    title: "Client Created",
                    description: `Client ${data.firstName} ${data.lastName} has been successfully added.`,
                    variant: "default", // Use "default" or create a "success" variant
                });
                router.push('/clients'); // Redirect back to the clients list after success
            // } catch (error: any) {
            //     console.error("Failed to create client via API:", error);
            //     toast({
            //         title: "Error Creating Client",
            //         description: error.message || "Could not save the new client. Please try again.",
            //         variant: "destructive",
            //     });
            // }
        } else {
             // Handle simulated failure
             console.error("Failed to create client (Simulated failure)");
             toast({
                title: "Error Creating Client",
                description: "Could not save the new client (Simulated failure). Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <h1 className="text-h1 font-h1 text-foreground">Create New Client</h1>
            {/* Pass isLoading state to the form */}
            <NewClientForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
    );
}
