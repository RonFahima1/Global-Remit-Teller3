'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, AlertCircle, Check } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

interface VerificationStepProps {
  client: any;
  withdrawalDetails: {
    amount: number;
    currency: string;
    note: string;
  };
  onVerify: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function VerificationStep({ 
  client, 
  withdrawalDetails, 
  onVerify, 
  onBack,
  isLoading 
}: VerificationStepProps) {
  const [idVerified, setIdVerified] = useState(false);
  const [signatureVerified, setSignatureVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [codeVerified, setCodeVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Simulate verification code check
  const verifyCode = () => {
    if (!verificationCode) {
      return;
    }
    
    setIsVerifying(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // For demo, we'll accept any 6-digit code
      const isValid = /^\d{6}$/.test(verificationCode);
      setCodeVerified(isValid);
      setIsVerifying(false);
      
      if (!isValid) {
        alert('Invalid verification code. Please try again.');
      }
    }, 1000);
  };

  const canProceed = idVerified && signatureVerified && codeVerified;

  return (
    <Card className="card-ios">
      <CardHeader>
        <CardTitle className="text-h3 font-h3">Verify Withdrawal</CardTitle>
        <CardDescription>Confirm client identity and withdrawal details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Client and Transaction Details */}
        <div className="bg-muted p-4 rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Client</p>
              <p className="font-medium">{client.firstName} {client.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ID</p>
              <p className="font-medium">{client.id}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-bold text-lg">{formatCurrency(withdrawalDetails.amount, withdrawalDetails.currency)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Currency</p>
              <p className="font-medium">{withdrawalDetails.currency}</p>
            </div>
          </div>
          
          {withdrawalDetails.note && (
            <div>
              <p className="text-sm text-muted-foreground">Note</p>
              <p className="font-medium">{withdrawalDetails.note}</p>
            </div>
          )}
        </div>

        {/* Verification Checklist */}
        <div className="space-y-4">
          <h3 className="font-medium">Identity Verification</h3>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="id-verification" 
              checked={idVerified} 
              onCheckedChange={(checked) => setIdVerified(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="id-verification" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I have verified the client's ID document
              </Label>
              <p className="text-sm text-muted-foreground">
                Check the client's ID and verify it matches our records
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="signature-verification" 
              checked={signatureVerified} 
              onCheckedChange={(checked) => setSignatureVerified(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="signature-verification" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I have verified the client's signature
              </Label>
              <p className="text-sm text-muted-foreground">
                Ensure the signature matches the one on file
              </p>
            </div>
          </div>
        </div>

        {/* SMS Verification */}
        <div className="space-y-4">
          <h3 className="font-medium">SMS Verification</h3>
          <p className="text-sm text-muted-foreground">
            A 6-digit verification code has been sent to {client.contact.phone}
          </p>
          
          <div className="flex space-x-2">
            <Input
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              className="max-w-[200px]"
              disabled={codeVerified || isVerifying}
            />
            <Button 
              variant="outline" 
              onClick={verifyCode}
              disabled={codeVerified || isVerifying || !verificationCode}
            >
              {isVerifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : codeVerified ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                'Verify'
              )}
            </Button>
          </div>
          
          {codeVerified && (
            <div className="flex items-center text-sm text-green-500">
              <Check className="h-4 w-4 mr-1" />
              Code verified successfully
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button 
          onClick={onVerify} 
          disabled={!canProceed || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Confirm Withdrawal'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
