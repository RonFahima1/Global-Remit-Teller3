/**
 * Receipt Generator Component
 * Allows generating and sending transaction receipts
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useReceipts } from '@/hooks/useReceipts';
import { 
  ReceiptTemplateType, 
  ReceiptFormat, 
  ReceiptDeliveryMethod,
  ReceiptMetadata,
  ReceiptLanguage
} from '@/types/receipt';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Printer, 
  Mail, 
  Download, 
  Phone, 
  RefreshCw, 
  Eye,
  FileText
} from 'lucide-react';

/**
 * Receipt Generator Props
 */
interface ReceiptGeneratorProps {
  transactionData: ReceiptMetadata;
  onSuccess?: (receiptUrl: string) => void;
  onError?: (error: string) => void;
}

/**
 * Receipt Generator Component
 */
export function ReceiptGenerator({ 
  transactionData, 
  onSuccess, 
  onError 
}: ReceiptGeneratorProps) {
  // Hooks
  const { 
    generateReceiptForTransaction,
    getDefaultTemplate,
    templates,
    getReceiptTemplates,
    isLoading,
    error,
    clearErrorMessage
  } = useReceipts();
  
  // State
  const [deliveryMethod, setDeliveryMethod] = useState<ReceiptDeliveryMethod>(
    ReceiptDeliveryMethod.DOWNLOAD
  );
  const [templateType, setTemplateType] = useState<ReceiptTemplateType>(
    ReceiptTemplateType.STANDARD
  );
  const [format, setFormat] = useState<ReceiptFormat>(ReceiptFormat.PDF);
  const [language, setLanguage] = useState<ReceiptLanguage>('en');
  const [destination, setDestination] = useState('');
  const [message, setMessage] = useState('');
  const [includeTerms, setIncludeTerms] = useState(true);
  const [includeSupportInfo, setIncludeSupportInfo] = useState(true);
  
  // Load templates on mount
  useEffect(() => {
    getReceiptTemplates();
  }, [getReceiptTemplates]);
  
  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      if (onError) onError(error);
      clearErrorMessage();
    }
  }, [error, onError, clearErrorMessage]);
  
  // Generate receipt
  const handleGenerateReceipt = async () => {
    try {
      // Validate input
      if (deliveryMethod !== ReceiptDeliveryMethod.DOWNLOAD && !destination) {
        toast.error('Please enter a valid destination for the receipt');
        return;
      }
      
      // Create options
      const options = {
        template: templateType,
        format,
        language,
        branding: {
          companyName: 'Global Remit Teller',
          logoUrl: '/logo.png',
          primaryColor: '#2563eb',
          secondaryColor: '#8b5cf6'
        },
        includeTermsAndConditions: includeTerms,
        includeSupportInfo,
        includeBarcode: true,
        includeQrCode: true
      };
      
      // Create delivery options if needed
      const delivery = deliveryMethod !== ReceiptDeliveryMethod.DOWNLOAD
        ? {
            method: deliveryMethod,
            destination,
            message: message || undefined
          }
        : undefined;
      
      // Generate receipt
      const result = await generateReceiptForTransaction(
        transactionData,
        options,
        delivery
      );
      
      // Handle success
      if (result.status === 'success') {
        toast.success(
          `Receipt ${deliveryMethod !== ReceiptDeliveryMethod.DOWNLOAD ? 'sent' : 'generated'} successfully`
        );
        if (onSuccess && result.downloadUrl) {
          onSuccess(result.downloadUrl);
        }
      } else {
        toast.error(`Failed to generate receipt: ${result.errorMessage}`);
        if (onError && result.errorMessage) {
          onError(result.errorMessage);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast.error(`Error: ${errorMessage}`);
      if (onError) onError(errorMessage);
    }
  };
  
  // Render delivery method input
  const renderDeliveryInput = () => {
    switch (deliveryMethod) {
      case ReceiptDeliveryMethod.EMAIL:
        return (
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="customer@example.com"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <Label htmlFor="emailMessage">Message (Optional)</Label>
            <Textarea
              id="emailMessage"
              placeholder="Please find your transaction receipt attached."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        );
      case ReceiptDeliveryMethod.SMS:
        return (
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <Label htmlFor="smsMessage">Message (Optional)</Label>
            <Textarea
              id="smsMessage"
              placeholder="Your transaction receipt is available at the link below."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Generate Receipt</CardTitle>
        <CardDescription>
          Create and send a receipt for transaction {transactionData.transactionId}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="delivery" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="delivery">Delivery Method</TabsTrigger>
            <TabsTrigger value="options">Receipt Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="delivery" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryMethod">Delivery Method</Label>
              <Select
                value={deliveryMethod}
                onValueChange={(value) => setDeliveryMethod(value as ReceiptDeliveryMethod)}
              >
                <SelectTrigger id="deliveryMethod">
                  <SelectValue placeholder="Select delivery method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ReceiptDeliveryMethod.DOWNLOAD}>
                    <div className="flex items-center">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </div>
                  </SelectItem>
                  <SelectItem value={ReceiptDeliveryMethod.EMAIL}>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value={ReceiptDeliveryMethod.SMS}>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      SMS
                    </div>
                  </SelectItem>
                  <SelectItem value={ReceiptDeliveryMethod.PRINT}>
                    <div className="flex items-center">
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {renderDeliveryInput()}
          </TabsContent>
          
          <TabsContent value="options" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <Select
                value={templateType}
                onValueChange={(value) => setTemplateType(value as ReceiptTemplateType)}
              >
                <SelectTrigger id="template">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ReceiptTemplateType.STANDARD}>Standard</SelectItem>
                  <SelectItem value={ReceiptTemplateType.COMPACT}>Compact</SelectItem>
                  <SelectItem value={ReceiptTemplateType.DETAILED}>Detailed</SelectItem>
                  <SelectItem value={ReceiptTemplateType.CUSTOM}>Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select
                value={format}
                onValueChange={(value) => setFormat(value as ReceiptFormat)}
              >
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ReceiptFormat.PDF}>PDF</SelectItem>
                  <SelectItem value={ReceiptFormat.HTML}>HTML</SelectItem>
                  <SelectItem value={ReceiptFormat.IMAGE}>Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value as ReceiptLanguage)}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={includeTerms}
                onCheckedChange={(checked) => setIncludeTerms(!!checked)}
              />
              <Label htmlFor="terms">Include Terms & Conditions</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="support" 
                checked={includeSupportInfo}
                onCheckedChange={(checked) => setIncludeSupportInfo(!!checked)}
              />
              <Label htmlFor="support">Include Support Information</Label>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button">
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <Button 
          onClick={handleGenerateReceipt}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate Receipt
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
