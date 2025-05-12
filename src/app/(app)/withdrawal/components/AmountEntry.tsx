'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

interface AmountEntryProps {
  client: any;
  onAmountSubmit: (amount: number, currency: string, note: string) => void;
  isLoading: boolean;
}

export function AmountEntry({ client, onAmountSubmit, isLoading }: AmountEntryProps) {
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [showInsufficientFunds, setShowInsufficientFunds] = useState(false);
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  // Set default currency when client changes
  useEffect(() => {
    if (client?.balances?.length > 0) {
      const defaultCurrency = client.balances[0].currency;
      setCurrency(defaultCurrency);
      updateAvailableBalance(defaultCurrency);
    }
  }, [client]);

  // Update available balance when currency changes
  const updateAvailableBalance = (selectedCurrency: string) => {
    const balance = client?.balances?.find(b => b.currency === selectedCurrency)?.amount || 0;
    setAvailableBalance(balance);
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    updateAvailableBalance(value);
    // Reset insufficient funds warning when currency changes
    setShowInsufficientFunds(false);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    // Reset insufficient funds warning when amount changes
    setShowInsufficientFunds(false);
  };

  const handleSubmit = () => {
    const numericAmount = parseFloat(amount);
    
    // Validate amount
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }

    // Check for sufficient funds
    if (numericAmount > availableBalance) {
      setShowInsufficientFunds(true);
      return;
    }

    // Submit valid amount
    onAmountSubmit(numericAmount, currency, note);
  };

  return (
    <Card className="card-ios">
      <CardHeader>
        <CardTitle className="text-h3 font-h3">Withdrawal Amount</CardTitle>
        <CardDescription>Enter the amount to withdraw from the client's account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Enter amount"
              disabled={isLoading}
              className="text-lg"
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={currency}
              onValueChange={handleCurrencyChange}
              disabled={isLoading}
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {client?.balances?.map((balance: any) => (
                  <SelectItem key={balance.currency} value={balance.currency}>
                    {balance.currency} - {formatCurrency(balance.amount, balance.currency)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="note">Note (Optional)</Label>
          <Input
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note for this withdrawal"
            disabled={isLoading}
          />
        </div>

        <div className="bg-muted p-3 rounded-md">
          <p className="text-sm font-medium">Available Balance:</p>
          <p className="text-xl font-bold">{formatCurrency(availableBalance, currency)}</p>
        </div>

        {showInsufficientFunds && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Insufficient Funds</AlertTitle>
            <AlertDescription>
              The withdrawal amount exceeds the available balance.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !amount || !currency}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
