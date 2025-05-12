'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useClient } from '@/context/ClientContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, UserCircle, Phone, Mail, Calendar, MapPin, FileText, Shield, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { TransactionHistory } from './components/TransactionHistory';

export default function ClientProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { state, deleteClient } = useClient();
  const [activeTab, setActiveTab] = useState('profile');
  
  const clientId = Array.isArray(id) ? id[0] : id || '';
  const client = state.clients.find(c => c.id === clientId);
  
  useEffect(() => {
    if (!client && clientId) {
      toast({
        title: "Client not found",
        description: "The client you're looking for doesn't exist or has been deleted.",
        variant: "destructive"
      });
      router.push('/clients');
    }
  }, [client, clientId, router, toast]);
  
  const handleEdit = () => {
    router.push(`/clients/${clientId}/edit`);
  };
  
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${client?.firstName} ${client?.lastName}?`)) {
      deleteClient(clientId);
      toast({
        title: "Client deleted",
        description: `${client?.firstName} ${client?.lastName} has been deleted.`,
      });
      router.push('/clients');
    }
  };
  
  const handleBack = () => {
    router.push('/clients');
  };
  
  if (!client) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Loading client...</h2>
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          </div>
        </div>
      </div>
    );
  }
  
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400';
      case 'inactive':
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            {client.firstName} {client.lastName}
          </h1>
          <Badge className={getStatusColor(client.kycStatus)}>
            {client.kycStatus || 'Unknown'}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="kyc">KYC</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="card-ios">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">First Name</p>
                    <p className="font-medium">{client.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Name</p>
                    <p className="font-medium">{client.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{formatDate(client.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium capitalize">{client.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nationality</p>
                    <p className="font-medium">{client.nationality}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <Badge variant={client.riskLevel === 'high' ? 'destructive' : client.riskLevel === 'medium' ? 'outline' : 'default'}>
                      {client.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Contact Information */}
            <Card className="card-ios">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{client.contact.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{client.contact.phone}</p>
                </div>
                {client.contact.alternatePhone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Alternate Phone</p>
                    <p className="font-medium">{client.contact.alternatePhone}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Address Information */}
            <Card className="card-ios">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Street</p>
                  <p className="font-medium">{client.address.street}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-medium">{client.address.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">State/Province</p>
                    <p className="font-medium">{client.address.state || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Postal Code</p>
                    <p className="font-medium">{client.address.postalCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium">{client.address.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Identification */}
            <Card className="card-ios">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Identification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">ID Type</p>
                  <p className="font-medium capitalize">{client.identification.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID Number</p>
                  <p className="font-medium">{client.identification.number}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <p className="font-medium">{formatDate(client.identification.issueDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expiry Date</p>
                    <p className="font-medium">{formatDate(client.identification.expiryDate)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Issuing Country</p>
                  <p className="font-medium">{client.identification.issuingCountry}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Other tabs would go here */}
        <TabsContent value="documents">
          <Card className="card-ios">
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Client documents and verification files</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-12">
                Document management will be implemented in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionHistory clientId={clientId} />
        </TabsContent>
        
        <TabsContent value="kyc">
          <Card className="card-ios">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                KYC Status
              </CardTitle>
              <CardDescription>Know Your Customer verification status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <Badge className={getStatusColor(client.kycStatus)}>
                    {client.kycStatus.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                  <Badge variant={client.riskLevel === 'high' ? 'destructive' : client.riskLevel === 'medium' ? 'outline' : 'default'}>
                    {client.riskLevel.toUpperCase()}
                  </Badge>
                </div>
                <Separator />
                <p className="text-muted-foreground text-center py-6">
                  Detailed KYC management will be implemented in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="limits">
          <Card className="card-ios">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Transaction Limits
              </CardTitle>
              <CardDescription>Manage transaction and account limits for this client</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <p>
                  View and manage this client's transaction limits, account balance limits, and limit exceptions.
                </p>
                <div>
                  <Button 
                    onClick={() => router.push(`/clients/${clientId}/limits`)}
                    className="mt-4"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Manage Limits
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card className="card-ios">
            <CardHeader>
              <CardTitle>Client Notes</CardTitle>
              <CardDescription>Notes and comments about this client</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-12">
                Client notes will be implemented in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 