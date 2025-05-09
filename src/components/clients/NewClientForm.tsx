'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Upload, FileText, Loader2, RefreshCw, Info, Calendar as CalendarIcon } from 'lucide-react'; // Icons
import { useState } from 'react';
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker"; // Import the new DatePicker
import Link from 'next/link';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Import Form components


// Define the Zod schema for form validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];

const fileSchema = z.any().optional().refine(
  (files) => {
    if (!files || files.length === 0) return true;
    const file = files[0];
    if (!file) return true;
    if (typeof File !== 'undefined' && file instanceof File) {
      if (file.size > MAX_FILE_SIZE) return false;
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return false;
    }
    return true;
  },
  {
    message: `File must be under 5MB and of type: .jpg, .jpeg, .png, .webp, .pdf`,
  }
);

const formSchema = z.object({
  // Personal Info
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.date({
    required_error: "Date of birth is required",
  }),
  gender: z.enum(["male", "female"], {
    required_error: "Gender is required",
  }),
  nationality: z.string().min(1, "Nationality is required"),

  // Address
  country: z.string().min(1, "Country is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),

  // Relationship
  employer: z.string().default("Global Remit Private"),
  division: z.string().default("No Billing 0 WalletGlobalPrivate"),

  // Contact Details
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  customerCard: z.string().optional().default(""),

  // Identification
  idType: z.string().min(1, "ID type is required"),
  idIssuanceCountry: z.string().min(1, "ID issuance country is required"),
  idNumber: z.string().min(1, "ID number is required"),
  idExpiryDate: z.date({
    required_error: "ID expiry date is required",
  }),
  idIssueDate: z.date().optional().default(new Date()),

  // Documents
  documentFile: fileSchema,
});


export type NewClientFormData = z.infer<typeof formSchema>;

interface NewClientFormProps {
  onSubmit: (data: Omit<NewClientFormData, 'documentFile'>, files: Record<string, File | null>) => void; // Keep single file record
  isLoading?: boolean; // Added isLoading prop
  initialData?: Partial<NewClientFormData>;
}

// Mock data for dropdowns
const nationalities = ["Israeli", "American", "British", "French", "German"]; // Example
const idTypes = ["Passport", "National ID", "Driver's License"]; // Example
const countries = ["Israel", "United States", "United Kingdom", "France", "Germany"]; // Example

function getDefaultValues(initialData?: Partial<NewClientFormData>): NewClientFormData {
  return {
    firstName: initialData?.firstName ?? "",
    middleName: initialData?.middleName ?? "",
    lastName: initialData?.lastName ?? "",
    dob: initialData?.dob ?? new Date(),
    gender: initialData?.gender ?? "male",
    nationality: initialData?.nationality ?? "",
    country: initialData?.country ?? "Israel",
    streetAddress: initialData?.streetAddress ?? "",
    city: initialData?.city ?? "",
    postalCode: initialData?.postalCode ?? "",
    employer: initialData?.employer ?? "Global Remit Private",
    division: initialData?.division ?? "No Billing 0 WalletGlobalPrivate",
    phoneNumber: initialData?.phoneNumber ?? "",
    email: initialData?.email ?? "",
    customerCard: initialData?.customerCard ?? "",
    idType: initialData?.idType ?? "",
    idIssuanceCountry: initialData?.idIssuanceCountry ?? "",
    idNumber: initialData?.idNumber ?? "",
    idExpiryDate: initialData?.idExpiryDate ?? new Date(),
    idIssueDate: initialData?.idIssueDate ?? new Date(),
    documentFile: undefined,
  };
}

export function NewClientForm({ onSubmit, isLoading = false, initialData }: NewClientFormProps) {
  // State to hold the actual File object
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<NewClientFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(initialData),
  });

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values, { documentFile: values.documentFile?.[0] || null });
  });

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files: inputFiles } = e.target;
    if (inputFiles && inputFiles.length > 0) {
      setSelectedFile(inputFiles[0]);
      form.setValue("documentFile", inputFiles, { shouldValidate: true });
    } else {
      setSelectedFile(null);
      form.setValue("documentFile", undefined, { shouldValidate: true });
    }
  };

  const handleCancel = () => {
    form.reset(); // Reset form fields to default values
    setSelectedFile(null);
    // Optional: Redirect back or show a confirmation message
    console.log("Form cancelled and reset.");
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="card-ios">
          <CardHeader>
            <CardTitle className="text-h3 font-h3 text-card-foreground">New Client Registration</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"> {/* Use grid for layout */}

            {/* Left Side Column */}
            <div className="space-y-6">
              {/* Personal Info Section */}
              <section>
                <h3 className="text-lg font-semibold mb-3 text-foreground border-b pb-1">Personal Information</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="label-ios">First Name *</FormLabel>
                        <FormControl>
                          <Input {...field} className={cn("input-ios focus:ring-primary", form.formState.errors.firstName && "border-destructive focus:ring-destructive")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="label-ios">Middle Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="input-ios focus:ring-primary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="label-ios">Last Name *</FormLabel>
                        <FormControl>
                          <Input {...field} className={cn("input-ios focus:ring-primary", form.formState.errors.lastName && "border-destructive focus:ring-destructive")} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="label-ios">Date of Birth *</FormLabel>
                           <DatePicker
                                field={field}
                                placeholder="DD-MM-YYYY"
                                dateFormat="dd-MM-yyyy"
                                triggerClassName={cn("input-ios justify-start text-left font-normal", !field.value && "text-muted-foreground", form.formState.errors.dob && "border-destructive focus:ring-destructive")}
                            />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="label-ios">Gender *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="male" id="male" />
                              </FormControl>
                              <FormLabel htmlFor="male" className="font-normal">Male</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="female" id="female"/>
                              </FormControl>
                              <FormLabel htmlFor="female" className="font-normal">Female</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="label-ios">Nationality *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className={cn("input-ios focus:ring-primary", form.formState.errors.nationality && "border-destructive focus:ring-destructive")}>
                                <SelectValue placeholder="Select nationality" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {nationalities.map(nat => <SelectItem key={nat} value={nat}>{nat}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
              </section>

              {/* Address Section */}
              <section>
                <h3 className="text-lg font-semibold mb-3 text-foreground border-b pb-1">Address</h3>
                <div className="space-y-4">
                   <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="label-ios">Country</FormLabel>
                          <FormControl>
                             <Input {...field} className="input-ios bg-muted cursor-not-allowed" readOnly disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                   <FormField
                      control={form.control}
                      name="streetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="label-ios">Street Address *</FormLabel>
                          <FormControl>
                            <Input {...field} className={cn("input-ios focus:ring-primary", form.formState.errors.streetAddress && "border-destructive focus:ring-destructive")} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                   <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="label-ios">City *</FormLabel>
                          <FormControl>
                            <Input {...field} className={cn("input-ios focus:ring-primary", form.formState.errors.city && "border-destructive focus:ring-destructive")} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                   <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="label-ios">Postal Code</FormLabel>
                          <FormControl>
                             <Input {...field} className="input-ios focus:ring-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
              </section>

              {/* Relationship Section */}
               <section>
                 <h3 className="text-lg font-semibold mb-3 text-foreground border-b pb-1">Relationship</h3>
                 <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="employer"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="label-ios">Employer</FormLabel>
                            <FormControl>
                                <Input {...field} className="input-ios bg-muted cursor-not-allowed" readOnly disabled />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="division"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="label-ios">Division</FormLabel>
                            <FormControl>
                                <Input {...field} className="input-ios bg-muted cursor-not-allowed" readOnly disabled />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                 </div>
               </section>
            </div>

            {/* Right Side Column */}
            <div className="space-y-6">
                {/* Contact Details Section */}
                 <section>
                     <h3 className="text-lg font-semibold mb-3 text-foreground border-b pb-1">Contact Details</h3>
                     <div className="space-y-4">
                       <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="label-ios">Phone Number *</FormLabel>
                               <div className="flex items-center gap-2">
                                   <span className="input-ios w-auto px-3 bg-muted text-muted-foreground">+972</span>
                                   <FormControl>
                                       <Input {...field} type="tel" placeholder="e.g., 501234567" className={cn("input-ios focus:ring-primary flex-1", form.formState.errors.phoneNumber && "border-destructive focus:ring-destructive")} />
                                   </FormControl>
                               </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="label-ios">Email</FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" className={cn("input-ios focus:ring-primary", form.formState.errors.email && "border-destructive focus:ring-destructive")} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={form.control}
                            name="customerCard"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="label-ios">Customer Card</FormLabel>
                                <FormControl>
                                    <Input {...field} className="input-ios focus:ring-primary" />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                         />
                     </div>
                 </section>

                 {/* Identification Section */}
                  <section>
                    <h3 className="text-lg font-semibold mb-3 text-foreground border-b pb-1">Identification (ID)</h3>
                     <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="idType"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="label-ios">ID Type *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger className={cn("input-ios focus:ring-primary", form.formState.errors.idType && "border-destructive focus:ring-destructive")}>
                                        <SelectValue placeholder="Select ID type" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {idTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={form.control}
                            name="idIssuanceCountry"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="label-ios">Issuance Country *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger className={cn("input-ios focus:ring-primary", form.formState.errors.idIssuanceCountry && "border-destructive focus:ring-destructive")}>
                                        <SelectValue placeholder="Select issuance country" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={form.control}
                            name="idNumber"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="label-ios">ID Number *</FormLabel>
                                <FormControl>
                                    <Input {...field} className={cn("input-ios focus:ring-primary", form.formState.errors.idNumber && "border-destructive focus:ring-destructive")} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={form.control}
                            name="idExpiryDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel className="label-ios">ID Expiry Date *</FormLabel>
                                <DatePicker
                                    field={field}
                                    placeholder="Select expiry date"
                                    triggerClassName={cn("input-ios justify-start text-left font-normal", !field.value && "text-muted-foreground", form.formState.errors.idExpiryDate && "border-destructive focus:ring-destructive")}
                                />
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={form.control}
                            name="idIssueDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel className="label-ios">ID Issue Date</FormLabel>
                                 <DatePicker
                                    field={field}
                                    placeholder="Select issue date"
                                    triggerClassName={cn("input-ios justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                                />
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                     </div>
                  </section>

                  {/* Documents Section */}
                   <section>
                     <h3 className="text-lg font-semibold mb-3 text-foreground border-b pb-1">Documents</h3>
                     <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="documentFile"
                          render={() => ( // Don't need field object directly for input type=file RHF handling
                            <FormItem>
                              <FormLabel className="label-ios">Upload Document</FormLabel>
                              <FormControl>
                                <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-card hover:bg-muted/50 transition-colors">
                                  <Input
                                    id="documentFile"
                                    type="file"
                                    {...form.register("documentFile")} // Register with RHF
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                    aria-invalid={form.formState.errors.documentFile ? "true" : "false"}
                                  />
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                    {selectedFile && !form.formState.errors.documentFile ? (
                                      <>
                                        <FileText className="w-8 h-8 mb-2 text-primary" />
                                        <p className="mb-1 text-sm text-foreground font-semibold">{selectedFile.name}</p>
                                        <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                        <p className="mb-1 text-sm text-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG, WEBP (MAX. 5MB)</p>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-between items-center">
                            <Button
                                type="button" // Important: Prevent form submission
                                variant="link"
                                className="text-sm text-primary p-0 h-auto"
                                onClick={() => console.log("Reloading documents...")} // Replace with actual reload logic
                            >
                                <RefreshCw className="mr-1 h-3 w-3" /> Reload Documents
                            </Button>
                            <Link href="/limits" passHref> {/* Make sure this route exists */}
                                <Button variant="link" className="text-sm text-primary p-0 h-auto">
                                    <Info className="mr-1 h-3 w-3" /> Show Limits
                                </Button>
                            </Link>
                        </div>
                     </div>
                   </section>
            </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="secondary" className="btn-ios-secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="btn-ios-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Client'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

    