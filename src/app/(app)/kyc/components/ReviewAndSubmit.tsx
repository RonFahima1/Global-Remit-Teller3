'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ReviewAndSubmitProps {
  client: any;
  personalInfo: any;
  documents: any[];
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function ReviewAndSubmit({ 
  client, 
  personalInfo, 
  documents, 
  onSubmit, 
  onBack,
  isLoading 
}: ReviewAndSubmitProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [error, setError] = useState('');
  
  // Document type options for display
  const documentTypes = {
    passport: 'Passport',
    national_id: 'National ID Card',
    drivers_license: 'Driver\'s License',
    utility_bill: 'Utility Bill (Proof of Address)',
    bank_statement: 'Bank Statement (Proof of Address)',
    tax_document: 'Tax Document'
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  const handleSubmit = () => {
    if (!termsAccepted || !privacyAccepted) {
      setError('You must accept the terms and privacy policy to proceed');
      return;
    }
    
    setError('');
    onSubmit();
  };

  return (
    <Card className="card-ios">
      <CardHeader>
        <CardTitle className="text-h3 font-h3">Review and Submit</CardTitle>
        <CardDescription>
          Please review your information before submitting for KYC verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Information Section */}
        <div className="space-y-3">
          <h3 className="font-medium">Personal Information</h3>
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{personalInfo.firstName} {personalInfo.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{personalInfo.dateOfBirth}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Nationality</p>
              <p className="font-medium">{personalInfo.nationality}</p>
            </div>
            
            <div className="pt-2 border-t mt-2">
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{personalInfo.address}</p>
              <p className="font-medium">
                {personalInfo.city}, {personalInfo.postalCode}
              </p>
              <p className="font-medium">{personalInfo.country}</p>
            </div>
          </div>
        </div>
        
        {/* Documents Section */}
        <div className="space-y-3">
          <h3 className="font-medium">Uploaded Documents</h3>
          <div className="bg-muted p-4 rounded-lg space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {documentTypes[doc.type as keyof typeof documentTypes] || doc.type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {doc.name} ({formatFileSize(doc.size)})
                  </p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Terms and Conditions */}
        <div className="space-y-4 pt-2">
          <h3 className="font-medium">Terms and Conditions</h3>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={termsAccepted} 
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="terms" className="text-sm font-medium leading-none">
                I accept the Terms and Conditions
              </Label>
              <p className="text-xs text-muted-foreground">
                By checking this box, I agree to the terms and conditions of the KYC verification process.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="privacy" 
              checked={privacyAccepted} 
              onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="privacy" className="text-sm font-medium leading-none">
                I accept the Privacy Policy
              </Label>
              <p className="text-xs text-muted-foreground">
                I understand that my personal information will be processed in accordance with the Privacy Policy.
              </p>
            </div>
          </div>
        </div>
        
        {/* Verification Process Information */}
        <Alert className="bg-blue-50 text-blue-800 border-blue-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your KYC verification will be reviewed by our compliance team. This process typically takes 1-2 business days.
            You will be notified once your verification is complete.
          </AlertDescription>
        </Alert>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !termsAccepted || !privacyAccepted}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Submit for Verification'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
