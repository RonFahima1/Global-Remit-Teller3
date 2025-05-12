'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { NewClientForm } from "@/components/clients/NewClientForm";
import { useClient } from '@/context/ClientContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function EditClientPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { state, updateClientFromForm, getClientFormData } = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  
  const clientId = Array.isArray(id) ? id[0] : id || '';
  const client = state.clients.find(c => c.id === clientId);
  
  useEffect(() => {
    if (!client && clientId) {
      toast({
        title: "Client not found",
        description: "The client you're trying to edit doesn't exist or has been deleted.",
        variant: "destructive"
      });
      router.push('/clients');
      return;
    }
    
    // Get form data for the client
    const data = getClientFormData(clientId);
    setFormData(data);
  }, [client, clientId, getClientFormData, router, toast]);
  
  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Update client using the ClientContext
      updateClientFromForm(clientId, data);
      
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
      router.push(`/clients/${clientId}`);
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    router.push(`/clients/${clientId}`);
  };
  
  if (!formData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Loading client data...</h2>
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.push(`/clients/${clientId}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Client: {client.firstName} {client.lastName}</h1>
      </div>
      
      <Card className="card-ios">
        <CardContent className="pt-6">
          <NewClientForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            initialData={formData}
          />
        </CardContent>
      </Card>
    </div>
  );
}
