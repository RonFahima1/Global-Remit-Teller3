/**
 * Transfer Details Component
 * Fourth step in the money transfer process
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

// Types
interface Sender {
  id: string;
  firstName: string;
  lastName: string;
}

interface Receiver {
  id: string;
  firstName: string;
  lastName: string;
  country?: string;
}

interface TransferAmount {
  sendAmount: number;
  receiveAmount: number;
  sendCurrency: string;
  receiveCurrency: string;
  exchangeRate: number;
  fee: number;
  totalCost: number;
}

interface TransferDetailsData {
  purpose: string;
  sourceOfFunds: string;
  paymentMethod: string;
  deliveryMethod: string;
  notes?: string;
  referenceNumber?: string;
  termsAccepted: boolean;
}

interface TransferDetailsProps {
  sender: Sender;
  receiver: Receiver;
  amount: TransferAmount;
  onDetailsConfirmed: (details: TransferDetailsData) => void;
  onBack: () => void;
}

/**
 * Transfer Details Component
 */
export function TransferDetails({ 
  sender, 
  receiver, 
  amount, 
  onDetailsConfirmed, 
  onBack 
}: TransferDetailsProps) {
  // State for form values
  const [purpose, setPurpose] = useState<string>('');
  const [sourceOfFunds, setSourceOfFunds] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [deliveryMethod, setDeliveryMethod] = useState<string>('cash');
  const [notes, setNotes] = useState<string>('');
  const [referenceNumber, setReferenceNumber] = useState<string>(`TR-${Date.now().toString().slice(-6)}`);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  
  // Purpose options
  const purposeOptions = [
    { value: 'family_support', label: 'Family Support' },
    { value: 'education', label: 'Education' },
    { value: 'medical', label: 'Medical Expenses' },
    { value: 'business', label: 'Business' },
    { value: 'travel', label: 'Travel' },
    { value: 'gift', label: 'Gift' },
    { value: 'other', label: 'Other' }
  ];
  
  // Source of funds options
  const sourceOfFundsOptions = [
    { value: 'salary', label: 'Salary' },
    { value: 'savings', label: 'Savings' },
    { value: 'business_income', label: 'Business Income' },
    { value: 'investment', label: 'Investment' },
    { value: 'loan', label: 'Loan' },
    { value: 'gift', label: 'Gift' },
    { value: 'other', label: 'Other' }
  ];
  
  // Payment method options
  const paymentMethodOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' }
  ];
  
  // Delivery method options
  const deliveryMethodOptions = [
    { value: 'cash', label: 'Cash Pickup' },
    { value: 'bank_deposit', label: 'Bank Deposit' },
    { value: 'mobile_wallet', label: 'Mobile Wallet' },
    { value: 'home_delivery', label: 'Home Delivery' }
  ];
  
  // Handle continue button click
  const handleContinue = () => {
    // Validate form
    if (!purpose) {
      toast.error('Please select a purpose for the transfer');
      return;
    }
    
    if (!sourceOfFunds) {
      toast.error('Please select a source of funds');
      return;
    }
    
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    
    if (!deliveryMethod) {
      toast.error('Please select a delivery method');
      return;
    }
    
    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }
    
    // Create transfer details object
    const transferDetails: TransferDetailsData = {
      purpose,
      sourceOfFunds,
      paymentMethod,
      deliveryMethod,
      notes,
      referenceNumber,
      termsAccepted
    };
    
    onDetailsConfirmed(transferDetails);
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Transfer Details</CardTitle>
        <CardDescription>
          Provide additional details for the transfer from {sender.firstName} {sender.lastName} to {receiver.firstName} {receiver.lastName}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <h3 className="text-sm font-medium">Transfer Summary</h3>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-xs text-muted-foreground">Sender</p>
              <p className="text-sm font-medium">{sender.firstName} {sender.lastName}</p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground">Receiver</p>
              <p className="text-sm font-medium">{receiver.firstName} {receiver.lastName}</p>
              {receiver.country && (
                <p className="text-xs text-muted-foreground">{receiver.country}</p>
              )}
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground">Send Amount</p>
              <p className="text-sm font-medium">{formatCurrency(amount.sendAmount, amount.sendCurrency)}</p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground">Receive Amount</p>
              <p className="text-sm font-medium">{formatCurrency(amount.receiveAmount, amount.receiveCurrency)}</p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground">Exchange Rate</p>
              <p className="text-sm font-medium">
                1 {amount.sendCurrency} = {amount.exchangeRate.toFixed(4)} {amount.receiveCurrency}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground">Fee</p>
              <p className="text-sm font-medium">{formatCurrency(amount.fee, amount.sendCurrency)}</p>
            </div>
            
            <div className="col-span-2 pt-2 border-t">
              <p className="text-xs text-muted-foreground">Total Cost</p>
              <p className="text-sm font-bold">{formatCurrency(amount.totalCost, amount.sendCurrency)}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Transfer</Label>
            <Select value={purpose} onValueChange={setPurpose} required>
              <SelectTrigger id="purpose">
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                {purposeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sourceOfFunds">Source of Funds</Label>
            <Select value={sourceOfFunds} onValueChange={setSourceOfFunds} required>
              <SelectTrigger id="sourceOfFunds">
                <SelectValue placeholder="Select source of funds" />
              </SelectTrigger>
              <SelectContent>
                {sourceOfFundsOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-2">
              {paymentMethodOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`payment-${option.value}`} />
                  <Label htmlFor={`payment-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Delivery Method</Label>
            <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="grid grid-cols-2 gap-2">
              {deliveryMethodOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`delivery-${option.value}`} />
                  <Label htmlFor={`delivery-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="referenceNumber">Reference Number</Label>
            <Input
              id="referenceNumber"
              placeholder="Reference number"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This reference number will be used to track the transfer
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes or instructions"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex items-start space-x-2 pt-4">
            <Checkbox 
              id="terms" 
              checked={termsAccepted} 
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)} 
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </Label>
              <p className="text-xs text-muted-foreground">
                I confirm that the information provided is accurate and I agree to the terms of service and privacy policy.
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Important Information</p>
              <p className="text-xs text-yellow-700 mt-1">
                This transfer may be subject to verification checks. The receiver may need to present valid identification to collect the funds.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!purpose || !sourceOfFunds || !paymentMethod || !deliveryMethod || !termsAccepted}>
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
