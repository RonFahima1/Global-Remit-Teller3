'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CreditCard, Wallet, Building, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTransfer } from '@/context/transfer-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const TransferDetails: React.FC = () => {
  const { state, dispatch } = useTransfer();
  const { toast } = useToast();
  const [payoutType, setPayoutType] = useState<string>('CASH');
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showMobileWalletDetails, setShowMobileWalletDetails] = useState(false);
  const [purpose, setPurpose] = useState<string>(state.purpose || '');
  const [reference, setReference] = useState<string>(state.reference || '');
  const [sourceOfFunds, setSourceOfFunds] = useState<string>('SALARY');
  const [bankName, setBankName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [branchCode, setBranchCode] = useState<string>('');
  const [walletProvider, setWalletProvider] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Source of funds options
  const sourceOfFundsOptions = [
    { value: 'SALARY', label: 'Salary' },
    { value: 'SAVINGS', label: 'Savings' },
    { value: 'BUSINESS', label: 'Business Income' },
    { value: 'INVESTMENT', label: 'Investment Returns' },
    { value: 'GIFT', label: 'Gift' },
    { value: 'OTHER', label: 'Other' }
  ];
  
  // Purpose of transfer options
  const purposeOfTransferOptions = [
    { value: 'FAMILY_SUPPORT', label: 'Family Support' },
    { value: 'EDUCATION', label: 'Education' },
    { value: 'MEDICAL', label: 'Medical Expenses' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'TRAVEL', label: 'Travel' },
    { value: 'GIFT', label: 'Gift' },
    { value: 'OTHER', label: 'Other' }
  ];
  
  // Payout method options with icons
  const payoutMethodOptions = [
    { value: 'CASH', label: 'Cash Pickup', icon: <Wallet className="h-5 w-5 mb-2" /> },
    { value: 'BANK', label: 'Bank Transfer', icon: <Building className="h-5 w-5 mb-2" /> },
    { value: 'MOBILE', label: 'Mobile Wallet', icon: <CreditCard className="h-5 w-5 mb-2" /> }
  ];
  
  const handlePayoutTypeChange = (value: string) => {
    setPayoutType(value);
    setShowBankDetails(value === 'BANK');
    setShowMobileWalletDetails(value === 'MOBILE');
  };
  
  const handlePurposeChange = (value: string) => {
    setPurpose(value);
    dispatch({ type: 'SET_PURPOSE', payload: value });
  };
  
  const handleReferenceChange = (value: string) => {
    setReference(value);
    dispatch({ type: 'SET_REFERENCE', payload: value });
  };
  
  const handleSourceOfFundsChange = (value: string) => {
    setSourceOfFunds(value);
  };
  
  const handleNotesChange = (value: string) => {
    setNotes(value);
  };
  
  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 3 });
  };
  
  const handleNext = () => {
    // Validate required fields
    if (!purpose) {
      toast({
        title: 'Missing Information',
        description: 'Please select a purpose for this transfer.',
        variant: 'destructive'
      });
      return;
    }
    
    // For bank transfers, validate bank details
    if (payoutType === 'BANK' && (!bankName || !accountNumber)) {
      toast({
        title: 'Missing Bank Details',
        description: 'Please complete all required bank details.',
        variant: 'destructive'
      });
      return;
    }
    
    // For mobile wallet, validate mobile details
    if (payoutType === 'MOBILE' && (!walletProvider || !mobileNumber)) {
      toast({
        title: 'Missing Wallet Details',
        description: 'Please complete all required mobile wallet details.',
        variant: 'destructive'
      });
      return;
    }

    dispatch({ type: 'SET_STEP', payload: 5 });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button and title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="mr-2 rounded-full h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-medium">Transfer Details</h2>
        </div>
        
        <Button 
          onClick={handleNext}
          className="bg-primary hover:bg-primary/90 text-white rounded-full px-5"
        >
          <span>Next</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      {/* Transfer Summary */}
      <Card className="card-ios overflow-hidden border-border/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Transfer Summary</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Sender</p>
                <p className="font-medium">{state.sender?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receiver</p>
                <p className="font-medium">{state.receiver?.name}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">{state.sourceCurrency} {state.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receiver Gets</p>
                <p className="font-medium text-primary">{state.targetCurrency} {state.receiveAmount.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Fee</p>
                <p className="font-medium">{state.sourceCurrency} {state.fee.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-medium">{state.sourceCurrency} {state.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payout Method Selection */}
      <Card className="card-ios overflow-hidden border-border/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Payout Method</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {payoutMethodOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handlePayoutTypeChange(option.value)}
                className={cn(
                  "p-4 border rounded-[14px] cursor-pointer transition-all text-center flex flex-col items-center",
                  payoutType === option.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                )}
              >
                {option.icon}
                <p className="font-medium">{option.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conditional Fields Based on Payout Method */}
      {showBankDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Card className="card-ios overflow-hidden border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-medium mb-2">Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Enter bank name"
                    className="rounded-[14px] border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter account number"
                    className="rounded-[14px] border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Branch Code
                  </label>
                  <Input
                    value={branchCode}
                    onChange={(e) => setBranchCode(e.target.value)}
                    placeholder="Enter branch code (optional)"
                    className="rounded-[14px] border-border/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {showMobileWalletDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Card className="card-ios overflow-hidden border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-medium mb-2">Mobile Wallet Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Mobile Wallet Provider <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={walletProvider}
                    onChange={(e) => setWalletProvider(e.target.value)}
                    placeholder="Enter wallet provider"
                    className="rounded-[14px] border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter mobile number"
                    className="rounded-[14px] border-border/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Source of Funds and Purpose */}
      <Card className="card-ios overflow-hidden border-border/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source of Funds */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium">
                <span>Source of Funds</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Required for compliance purposes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <Select
                value={sourceOfFunds}
                onValueChange={handleSourceOfFundsChange}
              >
                <SelectTrigger className="rounded-[14px] border-border/50">
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

            {/* Purpose of Transfer */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium">
                <span>Purpose of Transfer</span> <span className="text-red-500 ml-1">*</span>
              </label>
              <Select
                value={purpose}
                onValueChange={handlePurposeChange}
              >
                <SelectTrigger className="rounded-[14px] border-border/50">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  {purposeOfTransferOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reference */}
          <div className="mt-6 space-y-2">
            <label className="block text-sm font-medium">
              Reference Number
            </label>
            <Input
              value={reference}
              onChange={(e) => handleReferenceChange(e.target.value)}
              placeholder="Enter reference number (optional)"
              className="rounded-[14px] border-border/50"
            />
          </div>

          {/* Notes */}
          <div className="mt-6 space-y-2">
            <label className="block text-sm font-medium">
              Additional Notes (Optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Add any additional information here..."
              className="rounded-[14px] border-border/50 min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
