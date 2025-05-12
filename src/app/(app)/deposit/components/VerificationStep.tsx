'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, Check } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

interface VerificationStepProps {
  client: any;
  depositDetails: {
    amount: number;
    currency: string;
    note: string;
    source: string;
  };
  onVerify: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function VerificationStep({ 
  client, 
  depositDetails, 
  onVerify, 
  onBack,
  isLoading 
}: VerificationStepProps) {
  const [fundsVerified, setFundsVerified] = useState(false);
  const [idVerified, setIdVerified] = useState(false);
  const [complianceVerified, setComplianceVerified] = useState(false);

  // Format source of funds for display
  const formatSource = (source: string) => {
    return source.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const canProceed = fundsVerified && idVerified && complianceVerified;

  return (
    <Card className="card-ios">
      <CardHeader>
        <CardTitle className="text-h3 font-h3">Verify Deposit</CardTitle>
        <CardDescription>Confirm client identity and deposit details</CardDescription>
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
              <p className="font-bold text-lg">{formatCurrency(depositDetails.amount, depositDetails.currency)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Currency</p>
              <p className="font-medium">{depositDetails.currency}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Source of Funds</p>
              <p className="font-medium">{formatSource(depositDetails.source)}</p>
            </div>
            {depositDetails.note && (
              <div>
                <p className="text-sm text-muted-foreground">Note</p>
                <p className="font-medium">{depositDetails.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="space-y-4">
          <h3 className="font-medium">Verification Checklist</h3>
          
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
              id="funds-verification" 
              checked={fundsVerified} 
              onCheckedChange={(checked) => setFundsVerified(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="funds-verification" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I have verified the source of funds
              </Label>
              <p className="text-sm text-muted-foreground">
                Ensure the funds are from a legitimate source and match the declared amount
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="compliance-verification" 
              checked={complianceVerified} 
              onCheckedChange={(checked) => setComplianceVerified(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="compliance-verification" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I confirm this deposit complies with AML regulations
              </Label>
              <p className="text-sm text-muted-foreground">
                The deposit does not raise any suspicious activity concerns
              </p>
            </div>
          </div>
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
            'Confirm Deposit'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
