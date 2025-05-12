'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Clock } from 'lucide-react';

interface ConfirmationStepProps {
  client: any;
  onComplete: () => void;
}

export function ConfirmationStep({ client, onComplete }: ConfirmationStepProps) {
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Calculate estimated completion date (2 business days from now)
  const getEstimatedCompletionDate = () => {
    const date = new Date();
    let businessDaysToAdd = 2;
    
    while (businessDaysToAdd > 0) {
      date.setDate(date.getDate() + 1);
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        businessDaysToAdd--;
      }
    }
    
    return formatDate(date);
  };

  return (
    <Card className="card-ios">
      <CardHeader className="bg-green-50 dark:bg-green-950/20 border-b">
        <div className="flex items-center justify-center mb-2">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <CardTitle className="text-center text-h3 font-h3 text-green-600 dark:text-green-400">
          KYC Verification Submitted
        </CardTitle>
        <CardDescription className="text-center">
          Your KYC verification request has been submitted successfully
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Confirmation Message */}
        <div className="text-center">
          <p className="mb-2">
            Thank you for submitting your KYC verification, {client.firstName}.
          </p>
          <p className="text-muted-foreground">
            Your verification request has been received and is now pending review by our compliance team.
          </p>
        </div>
        
        {/* Status Information */}
        <div className="bg-muted/50 border rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Verification in Progress</p>
              <p className="text-sm text-muted-foreground">
                Your documents are being reviewed by our compliance team
              </p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground">Submission Date</p>
            <p className="font-medium">{formatDate(new Date())}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Estimated Completion</p>
            <p className="font-medium">{getEstimatedCompletionDate()}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Reference Number</p>
            <p className="font-medium">KYC-{Math.floor(100000 + Math.random() * 900000)}</p>
          </div>
        </div>
        
        {/* Next Steps */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
          <h3 className="font-medium mb-2">What happens next?</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-blue-600">1</span>
              </div>
              <p>Our compliance team will review your submitted documents</p>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-blue-600">2</span>
              </div>
              <p>You will receive an email notification once the review is complete</p>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-blue-600">3</span>
              </div>
              <p>If approved, you can immediately use all features of the platform</p>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-blue-600">4</span>
              </div>
              <p>If additional information is needed, we will contact you</p>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onComplete}>
          View KYC Status
        </Button>
        <Button onClick={() => window.location.href = '/dashboard'}>
          Dashboard
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
