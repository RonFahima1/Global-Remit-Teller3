'use client';

import React from 'react';
import { useClient, Client } from '@/context/ClientContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Calendar, 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Edit,
  Send,
  History,
  Shield,
  Flag
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Link from 'next/link';

interface ClientDetailsProps {
  clientId: string;
}

export function ClientDetails({ clientId }: ClientDetailsProps) {
  const { getClient } = useClient();
  const client = getClient(clientId);
  
  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Client not found</p>
      </div>
    );
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Get KYC status badge
  const getKycStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Get risk level badge
  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case 'low':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Low Risk
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Medium Risk
          </Badge>
        );
      case 'high':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            High Risk
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Get document status badge
  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Client Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="card-ios">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-lg">
                  {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                </div>
                <div>
                  <CardTitle className="text-2xl">{client.firstName} {client.lastName}</CardTitle>
                  <div className="text-sm text-gray-500">{client.id}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {getKycStatusBadge(client.kycStatus)}
                {getRiskLevelBadge(client.riskLevel)}
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/clients/${client.id}/edit`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Link href={`/send-money?clientId=${client.id}`}>
                <Button className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send Money
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
      
      {/* Client Details Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Compliance
            </TabsTrigger>
          </TabsList>
          
          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-ios">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Full Name</div>
                      <div className="font-medium">{client.firstName} {client.lastName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Date of Birth</div>
                      <div className="font-medium">{formatDate(client.dateOfBirth)}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Gender</div>
                      <div className="font-medium capitalize">{client.gender}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Nationality</div>
                      <div className="font-medium">{client.nationality}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Client Since</div>
                    <div className="font-medium">{formatDate(client.createdAt)}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-ios">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Phone
                    </div>
                    <div className="font-medium">{client.contact.phone}</div>
                  </div>
                  
                  {client.contact.alternatePhone && (
                    <div>
                      <div className="text-sm text-gray-500">Alternate Phone</div>
                      <div className="font-medium">{client.contact.alternatePhone}</div>
                    </div>
                  )}
                  
                  <div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </div>
                    <div className="font-medium">{client.contact.email}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-ios">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Street Address
                    </div>
                    <div className="font-medium">{client.address.street}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">City</div>
                      <div className="font-medium">{client.address.city}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">State/Province</div>
                      <div className="font-medium">{client.address.state}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Postal Code</div>
                      <div className="font-medium">{client.address.postalCode}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Globe className="h-4 w-4" /> Country
                      </div>
                      <div className="font-medium">{client.address.country}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-ios">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Identification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">ID Type</div>
                    <div className="font-medium">{client.identification.type}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">ID Number</div>
                    <div className="font-medium">{client.identification.number}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Issue Date</div>
                      <div className="font-medium">{formatDate(client.identification.issueDate)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Expiry Date</div>
                      <div className="font-medium">{formatDate(client.identification.expiryDate)}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Issuing Country</div>
                    <div className="font-medium">{client.identification.issuingCountry}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="card-ios">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Documents</CardTitle>
                <Button size="sm">Upload Document</Button>
              </CardHeader>
              <CardContent>
                {client.documents.length > 0 ? (
                  <div className="space-y-4">
                    {client.documents.map((doc) => (
                      <div 
                        key={doc.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">{doc.type}</div>
                            <div className="text-sm text-gray-500">
                              {doc.fileName} • Uploaded on {formatDate(doc.uploadDate)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getDocumentStatusBadge(doc.status)}
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No documents uploaded yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card className="card-ios">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {client.lastTransactionDate ? (
                  <div className="space-y-4">
                    <div className="text-center text-gray-500 py-8">
                      Transaction history will be displayed here
                    </div>
                    <div className="text-sm text-gray-500 text-center">
                      Last transaction: {formatDate(client.lastTransactionDate)}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No transactions found for this client
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline">View All Transactions</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Compliance Tab */}
          <TabsContent value="compliance">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-ios">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Risk Level</div>
                    <div>{getRiskLevelBadge(client.riskLevel)}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">KYC Status</div>
                    <div>{getKycStatusBadge(client.kycStatus)}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Last Verification</div>
                    <div className="font-medium">{formatDate(client.updatedAt)}</div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-sm text-gray-500 mb-2">Notes</div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                      {client.notes || 'No compliance notes available'}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-ios">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Frequent Destinations</CardTitle>
                </CardHeader>
                <CardContent>
                  {client.frequentDestinations && client.frequentDestinations.length > 0 ? (
                    <div className="space-y-3">
                      {client.frequentDestinations.map((destination, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <Flag className="h-4 w-4 text-blue-500" />
                          <div className="font-medium">{destination}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      No frequent destinations recorded
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
