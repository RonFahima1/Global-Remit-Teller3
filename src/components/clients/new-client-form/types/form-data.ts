import { IdType, Country, Gender } from '../constants';

export interface NewClientFormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: Date;
  gender: Gender['value'];
  nationality: string;
  country: Country;
  streetAddress: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  idType: IdType;
  idNumber: string;
  issueDate: Date;
  expiryDate: Date;
  employer: string;
  occupation: string;
  idDocument?: File;
  proofOfAddress?: File;
}
