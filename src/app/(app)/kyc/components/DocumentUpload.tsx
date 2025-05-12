'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, X, FileText, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DocumentUploadProps {
  client: any;
  onDocumentsUploaded: (documents: any[]) => void;
  onBack: () => void;
  isLoading: boolean;
}

export function DocumentUpload({ 
  client, 
  onDocumentsUploaded, 
  onBack,
  isLoading 
}: DocumentUploadProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentType, setDocumentType] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  // Document type options
  const documentTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'national_id', label: 'National ID Card' },
    { value: 'drivers_license', label: 'Driver\'s License' },
    { value: 'utility_bill', label: 'Utility Bill (Proof of Address)' },
    { value: 'bank_statement', label: 'Bank Statement (Proof of Address)' },
    { value: 'tax_document', label: 'Tax Document' }
  ];
  
  // Required document types
  const requiredDocuments = ['passport', 'utility_bill'];
  
  // Check if all required documents are uploaded
  const hasAllRequiredDocuments = () => {
    return requiredDocuments.every(reqType => 
      documents.some(doc => doc.type === reqType)
    );
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!documentType) {
      setError('Please select a document type first');
      return;
    }
    
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type (only allow images and PDFs)
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, and PDF files are allowed');
      return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }
    
    // Check if document type already exists
    if (documents.some(doc => doc.type === documentType)) {
      setError('A document of this type has already been uploaded');
      return;
    }
    
    // Clear error if validation passes
    setError('');
    
    // Add document to list
    const newDocument = {
      id: Date.now().toString(),
      type: documentType,
      name: file.name,
      size: file.size,
      file: file,
      uploadDate: new Date()
    };
    
    setDocuments([...documents, newDocument]);
    setDocumentType(''); // Reset document type after upload
    
    // Reset file input
    e.target.value = '';
  };
  
  // Remove a document
  const removeDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!hasAllRequiredDocuments()) {
      setError('Please upload all required documents');
      return;
    }
    
    onDocumentsUploaded(documents);
  };

  return (
    <Card className="card-ios">
      <CardHeader>
        <CardTitle className="text-h3 font-h3">Upload Documents</CardTitle>
        <CardDescription>
          Please upload the required documents for KYC verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="info" className="bg-blue-50 text-blue-800 border-blue-200">
          <Info className="h-4 w-4" />
          <AlertDescription>
            You must upload a valid ID document (passport or national ID) and a proof of address (utility bill or bank statement).
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <Select
                value={documentType}
                onValueChange={setDocumentType}
                disabled={isLoading}
              >
                <SelectTrigger id="documentType">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                      {requiredDocuments.includes(type.value) && ' (Required)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="documentFile">Upload File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="documentFile"
                  type="file"
                  onChange={handleFileChange}
                  disabled={isLoading || !documentType}
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        
        {/* Uploaded Documents List */}
        <div className="space-y-2">
          <h3 className="font-medium">Uploaded Documents</h3>
          
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">
                        {documentTypes.find(t => t.value === doc.type)?.label || doc.type}
                        {requiredDocuments.includes(doc.type) && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Required
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {doc.name} ({formatFileSize(doc.size)})
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeDocument(doc.id)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Document Requirements Status */}
        <div className="bg-muted p-3 rounded-md">
          <h3 className="font-medium text-sm mb-2">Document Requirements</h3>
          <ul className="space-y-1">
            {requiredDocuments.map(reqType => {
              const isUploaded = documents.some(doc => doc.type === reqType);
              const docLabel = documentTypes.find(t => t.value === reqType)?.label || reqType;
              
              return (
                <li key={reqType} className="flex items-center gap-2 text-sm">
                  <div className={`w-4 h-4 rounded-full ${isUploaded ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span>{docLabel}</span>
                  <span className="text-xs text-muted-foreground">
                    {isUploaded ? 'Uploaded' : 'Required'}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !hasAllRequiredDocuments()}
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
