'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

interface AmountEntryProps {
  client: any;
  onAmountSubmit: (amount: number, currency: string, note: string, source: string) => void;
  isLoading: boolean;
}

export function AmountEntry({ client, onAmountSubmit, isLoading }: AmountEntryProps) {
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [note, setNote] = useState<string>('');
  const [source, setSource] = useState<string>('cash');

  const handleSubmit = () => {
    const numericAmount = parseFloat(amount);
    
    // Validate amount
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }

    // Submit valid amount
    onAmountSubmit(numericAmount, currency, note, source);
  };

  // List of available currencies
  const currencies = ['USD', 'EUR', 'GBP', 'ILS', 'JPY'];
  
  // List of source of funds options
  const sourceOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'check', label: 'Check' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Card className="card-ios">
      <CardHeader>
        <CardTitle className="text-h3 font-h3">Deposit Amount</CardTitle>
        <CardDescription>Enter the amount to deposit into the client's account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              disabled={isLoading}
              className="text-lg"
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={currency}
              onValueChange={setCurrency}
              disabled={isLoading}
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr} value={curr}>
                    {curr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="source">Source of Funds</Label>
          <Select
            value={source}
            onValueChange={setSource}
            disabled={isLoading}
          >
            <SelectTrigger id="source">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {sourceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="note">Note (Optional)</Label>
          <Input
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note for this deposit"
            disabled={isLoading}
          />
        </div>

        {client.balances && (
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm font-medium">Current Balance:</p>
            {client.balances.map((balance: any) => (
              <p key={balance.currency} className="text-sm">
                {balance.currency}: <span className="font-bold">{formatCurrency(balance.amount, balance.currency)}</span>
              </p>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !amount || !currency || !source}
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
