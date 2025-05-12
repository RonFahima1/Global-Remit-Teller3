/**
 * Client Activity Component
 * Displays recent client activities on the dashboard
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Users, 
  RefreshCw,
  Clock,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock4
} from 'lucide-react';
import { useClientService } from '@/components/providers/service-provider';
import { toast } from 'sonner';

// Types
interface ClientActivity {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  activityType: 'registration' | 'verification' | 'update' | 'transaction' | 'kyc';
  status: 'completed' | 'pending' | 'rejected';
  timestamp: string;
  details?: string;
}

/**
 * Client Activity Component
 */
export function ClientActivity() {
  const router = useRouter();
  const clientService = useClientService();
  
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<ClientActivity[]>([]);
  const [newClients, setNewClients] = useState<number>(0);
  const [pendingVerifications, setPendingVerifications] = useState<number>(0);
  
  // Fetch client activities on mount
  useEffect(() => {
    fetchClientActivities();
  }, []);
  
  // Fetch client activities from service
  const fetchClientActivities = async () => {
    try {
      setIsLoading(true);
      
      // Use mock data in development
      const { 
        getMockClientActivities, 
        getMockNewClientsCount, 
        getMockPendingVerificationsCount 
      } = await import('@/lib/mock-data');
      
      // Get recent client activities
      const response = getMockClientActivities();
      setActivities(response.activities);
      
      // Get new clients count
      const newClientsResponse = getMockNewClientsCount();
      setNewClients(newClientsResponse.count);
      
      // Get pending verifications count
      const pendingVerificationsResponse = getMockPendingVerificationsCount();
      setPendingVerifications(pendingVerificationsResponse.count);
    } catch (error) {
      console.error('Error fetching client activities:', error);
      toast.error('Failed to fetch client activities');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    fetchClientActivities();
  };
  
  // Handle client click
  const handleClientClick = (clientId: string) => {
    router.push(`/clients/${clientId}`);
  };
  
  // Get activity type icon
  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'verification':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'update':
        return <RefreshCw className="h-4 w-4 text-purple-500" />;
      case 'transaction':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'kyc':
        return <Users className="h-4 w-4 text-indigo-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  // Get activity type label
  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'registration':
        return 'New Registration';
      case 'verification':
        return 'Identity Verification';
      case 'update':
        return 'Profile Update';
      case 'transaction':
        return 'Transaction';
      case 'kyc':
        return 'KYC Update';
      default:
        return type;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Get avatar fallback
  const getAvatarFallback = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Client Activity</CardTitle>
          <CardDescription>Recent client activities and verifications</CardDescription>
        </div>
        
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* New Clients */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">New Clients (Today)</p>
                  <p className="text-2xl font-bold">{newClients}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <UserPlus className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Pending Verifications */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Verifications</p>
                  <p className="text-2xl font-bold">{pendingVerifications}</p>
                </div>
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Clock4 className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Recent Activities</p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent client activities</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 rounded-lg border cursor-pointer hover:bg-muted/50"
                  onClick={() => handleClientClick(activity.clientId)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activity.clientAvatar} alt={activity.clientName} />
                    <AvatarFallback>{getAvatarFallback(activity.clientName)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.clientName}</p>
                      {getStatusBadge(activity.status)}
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      {getActivityTypeIcon(activity.activityType)}
                      <span className="ml-1">{getActivityTypeLabel(activity.activityType)}</span>
                      <span className="mx-1">•</span>
                      <span>{new Date(activity.timestamp).toLocaleString()}</span>
                    </div>
                    
                    {activity.details && (
                      <p className="text-xs text-muted-foreground">{activity.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => router.push('/clients?filter=recent')}>
          View Recent Clients
        </Button>
        
        <Button variant="outline" size="sm" onClick={() => router.push('/clients?filter=pending')}>
          View Pending Verifications
        </Button>
      </CardFooter>
    </Card>
  );
}
