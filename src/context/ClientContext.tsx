'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { toast } from 'sonner';
import type { NewClientFormData, IdType } from '@/components/clients/types/form';

// Define client types
export interface ClientAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ClientContact {
  email: string;
  phone: string;
  alternatePhone?: string;
}

export interface ClientIdentification {
  type: string;
  number: string;
  issuingCountry: string;
  issueDate: string;
  expiryDate: string;
}

export interface ClientDocument {
  id: string;
  type: string;
  fileName: string;
  uploadDate: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  gender: 'male' | 'female' | 'other';
  address: ClientAddress;
  contact: ClientContact;
  identification: ClientIdentification;
  documents: ClientDocument[];
  kycStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
  lastTransactionDate?: string;
  frequentDestinations?: string[];
  riskLevel: 'low' | 'medium' | 'high';
  notes?: string;
  status?: string; // Added for compatibility with existing client list
}

// Define state type
interface ClientState {
  clients: Client[];
  selectedClient: Client | null;
  filteredClients: Client[];
  searchTerm: string;
  loading: boolean;
  error: string | null;
}

// Define action types
type ClientAction =
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'SET_SELECTED_CLIENT'; payload: Client | null }
  | { type: 'SET_FILTERED_CLIENTS'; payload: Client[] }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'ADD_DOCUMENT'; payload: { clientId: string; document: ClientDocument } }
  | { type: 'UPDATE_DOCUMENT_STATUS'; payload: { clientId: string; documentId: string; status: 'pending' | 'verified' | 'rejected' } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Helper function to convert form data to client data
const formDataToClient = (formData: NewClientFormData): Omit<Client, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    firstName: formData.personal.firstName,
    lastName: formData.personal.lastName,
    dateOfBirth: formData.personal.dob,
    gender: formData.personal.gender,
    nationality: formData.personal.nationality,
    address: {
      street: formData.address.streetAddress,
      city: formData.address.city,
      state: '', // Not in the form data
      postalCode: formData.address.postalCode || '',
      country: formData.address.country,
    },
    contact: {
      email: formData.contact.email,
      phone: `${formData.contact.prefix}${formData.contact.areaCode}${formData.contact.phone}`,
      alternatePhone: formData.contact.customerCard,
    },
    identification: {
      type: formData.identification.idType,
      number: formData.identification.idNumber,
      issuingCountry: formData.identification.issuanceCountry,
      issueDate: formData.identification.issueDate,
      expiryDate: formData.identification.expiryDate,
    },
    documents: [],
    kycStatus: 'pending',
    riskLevel: 'low',
    status: 'Active',
  };
};

// Helper function to convert client data to form data
const clientToFormData = (client: Client): NewClientFormData => {
  // Extract phone parts (simplified - in a real app would need more robust parsing)
  const phoneRegex = /^(\+\d{1,3})(\d{1,4})(\d+)$/;
  const phoneMatch = client.contact.phone.match(phoneRegex) || ['', '+1', '555', '1234567'];
  const [_, prefix, areaCode, phoneNumber] = phoneMatch;
  
  return {
    personal: {
      firstName: client.firstName,
      lastName: client.lastName,
      dob: client.dateOfBirth,
      gender: client.gender,
      nationality: client.nationality,
    },
    address: {
      streetAddress: client.address.street,
      city: client.address.city,
      country: client.address.country,
      postalCode: client.address.postalCode,
    },
    contact: {
      email: client.contact.email,
      prefix: prefix,
      areaCode: areaCode,
      phone: phoneNumber,
      customerCard: client.contact.alternatePhone,
    },
    identification: {
      idType: client.identification.type as IdType,
      idNumber: client.identification.number,
      issuanceCountry: client.identification.issuingCountry,
      issueDate: client.identification.issueDate,
      expiryDate: client.identification.expiryDate,
    },
    employment: {
      occupation: '',
      employer: '',
      income: '',
    },
    documents: {
      idFront: null,
      idBack: null,
      proofOfAddress: null,
    },
  };
};

// Mock data for clients
const MOCK_CLIENTS: Client[] = [
  {
    id: 'C1001',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1985-05-15',
    nationality: 'United States',
    gender: 'male',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States'
    },
    contact: {
      email: 'john.doe@example.com',
      phone: '+1-555-123-4567'
    },
    identification: {
      type: 'Passport',
      number: 'US123456789',
      issuingCountry: 'United States',
      issueDate: '2018-01-15',
      expiryDate: '2028-01-14'
    },
    documents: [
      {
        id: 'DOC1001',
        type: 'Passport',
        fileName: 'passport_scan.pdf',
        uploadDate: '2023-01-10',
        status: 'verified'
      },
      {
        id: 'DOC1002',
        type: 'Proof of Address',
        fileName: 'utility_bill.pdf',
        uploadDate: '2023-01-10',
        status: 'verified'
      }
    ],
    kycStatus: 'verified',
    createdAt: '2023-01-10T10:30:00Z',
    updatedAt: '2023-01-15T14:20:00Z',
    lastTransactionDate: '2023-04-20T09:15:00Z',
    frequentDestinations: ['Mexico', 'Canada'],
    riskLevel: 'low',
    notes: 'Regular customer, sends money to family monthly.'
  },
  {
    id: 'C1002',
    firstName: 'Maria',
    lastName: 'Garcia',
    dateOfBirth: '1990-08-22',
    nationality: 'Mexico',
    gender: 'female',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'United States'
    },
    contact: {
      email: 'maria.garcia@example.com',
      phone: '+1-555-987-6543'
    },
    identification: {
      type: 'Driver License',
      number: 'CA87654321',
      issuingCountry: 'United States',
      issueDate: '2020-03-10',
      expiryDate: '2025-03-09'
    },
    documents: [
      {
        id: 'DOC2001',
        type: 'Driver License',
        fileName: 'license_scan.pdf',
        uploadDate: '2023-02-05',
        status: 'verified'
      }
    ],
    kycStatus: 'verified',
    createdAt: '2023-02-05T15:45:00Z',
    updatedAt: '2023-02-10T11:30:00Z',
    lastTransactionDate: '2023-05-01T16:20:00Z',
    frequentDestinations: ['Mexico'],
    riskLevel: 'low'
  },
  {
    id: 'C1003',
    firstName: 'Ahmed',
    lastName: 'Khan',
    dateOfBirth: '1978-11-03',
    nationality: 'Pakistan',
    gender: 'male',
    address: {
      street: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      country: 'United States'
    },
    contact: {
      email: 'ahmed.khan@example.com',
      phone: '+1-555-456-7890',
      alternatePhone: '+1-555-456-7891'
    },
    identification: {
      type: 'Passport',
      number: 'PK987654321',
      issuingCountry: 'Pakistan',
      issueDate: '2019-06-20',
      expiryDate: '2029-06-19'
    },
    documents: [
      {
        id: 'DOC3001',
        type: 'Passport',
        fileName: 'passport_scan.pdf',
        uploadDate: '2023-03-15',
        status: 'verified'
      },
      {
        id: 'DOC3002',
        type: 'Proof of Address',
        fileName: 'lease_agreement.pdf',
        uploadDate: '2023-03-15',
        status: 'pending'
      }
    ],
    kycStatus: 'pending',
    createdAt: '2023-03-15T09:20:00Z',
    updatedAt: '2023-03-20T14:10:00Z',
    lastTransactionDate: '2023-04-10T11:05:00Z',
    frequentDestinations: ['Pakistan'],
    riskLevel: 'medium',
    notes: 'Needs to complete KYC verification.'
  }
];

// Initial state
const initialState: ClientState = {
  clients: MOCK_CLIENTS,
  selectedClient: null,
  filteredClients: MOCK_CLIENTS,
  searchTerm: '',
  loading: false,
  error: null,
};

// Reducer function
const clientReducer = (state: ClientState, action: ClientAction): ClientState => {
  switch (action.type) {
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload, filteredClients: action.payload };
    case 'SET_SELECTED_CLIENT':
      return { ...state, selectedClient: action.payload };
    case 'SET_FILTERED_CLIENTS':
      return { ...state, filteredClients: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'ADD_CLIENT':
      return { 
        ...state, 
        clients: [...state.clients, action.payload],
        filteredClients: [...state.clients, action.payload] 
      };
    case 'UPDATE_CLIENT':
      return { 
        ...state, 
        clients: state.clients.map(client => 
          client.id === action.payload.id ? action.payload : client
        ),
        filteredClients: state.filteredClients.map(client => 
          client.id === action.payload.id ? action.payload : client
        ),
        selectedClient: state.selectedClient?.id === action.payload.id 
          ? action.payload 
          : state.selectedClient
      };
    case 'DELETE_CLIENT':
      return { 
        ...state, 
        clients: state.clients.filter(client => client.id !== action.payload),
        filteredClients: state.filteredClients.filter(client => client.id !== action.payload),
        selectedClient: state.selectedClient?.id === action.payload 
          ? null 
          : state.selectedClient
      };
    case 'ADD_DOCUMENT':
      return {
        ...state,
        clients: state.clients.map(client => {
          if (client.id === action.payload.clientId) {
            return {
              ...client,
              documents: [...client.documents, action.payload.document]
            };
          }
          return client;
        }),
        filteredClients: state.filteredClients.map(client => {
          if (client.id === action.payload.clientId) {
            return {
              ...client,
              documents: [...client.documents, action.payload.document]
            };
          }
          return client;
        }),
        selectedClient: state.selectedClient?.id === action.payload.clientId
          ? {
              ...state.selectedClient,
              documents: [...state.selectedClient.documents, action.payload.document]
            }
          : state.selectedClient
      };
    case 'UPDATE_DOCUMENT_STATUS':
      return {
        ...state,
        clients: state.clients.map(client => {
          if (client.id === action.payload.clientId) {
            return {
              ...client,
              documents: client.documents.map(doc => 
                doc.id === action.payload.documentId
                  ? { ...doc, status: action.payload.status }
                  : doc
              )
            };
          }
          return client;
        }),
        filteredClients: state.filteredClients.map(client => {
          if (client.id === action.payload.clientId) {
            return {
              ...client,
              documents: client.documents.map(doc => 
                doc.id === action.payload.documentId
                  ? { ...doc, status: action.payload.status }
                  : doc
              )
            };
          }
          return client;
        }),
        selectedClient: state.selectedClient?.id === action.payload.clientId
          ? {
              ...state.selectedClient,
              documents: state.selectedClient.documents.map(doc => 
                doc.id === action.payload.documentId
                  ? { ...doc, status: action.payload.status }
                  : doc
              )
            }
          : state.selectedClient
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Create context
interface ClientContextType {
  state: ClientState;
  dispatch: React.Dispatch<ClientAction>;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  createClientFromForm: (formData: NewClientFormData) => void;
  updateClient: (client: Client) => void;
  updateClientFromForm: (id: string, formData: NewClientFormData) => void;
  deleteClient: (id: string) => void;
  selectClient: (client: Client | null) => void;
  searchClients: (term: string) => void;
  addDocument: (clientId: string, document: Omit<ClientDocument, 'id' | 'uploadDate'>) => void;
  updateDocumentStatus: (clientId: string, documentId: string, status: 'pending' | 'verified' | 'rejected') => void;
  getClientFormData: (clientId: string) => NewClientFormData | null;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

// Provider component
export function ClientProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(clientReducer, initialState);

  // Search clients
  const searchClients = (term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
    
    if (!term.trim()) {
      dispatch({ type: 'SET_FILTERED_CLIENTS', payload: state.clients });
      return;
    }
    
    const lowerCaseTerm = term.toLowerCase();
    const filtered = state.clients.filter(client => 
      client.firstName.toLowerCase().includes(lowerCaseTerm) ||
      client.lastName.toLowerCase().includes(lowerCaseTerm) ||
      client.id.toLowerCase().includes(lowerCaseTerm) ||
      client.contact.email.toLowerCase().includes(lowerCaseTerm) ||
      client.contact.phone.includes(term)
    );
    
    dispatch({ type: 'SET_FILTERED_CLIENTS', payload: filtered });
  };

  // Get client by ID
  const getClient = (id: string): Client | null => {
    const client = state.clients.find(client => client.id === id) || null;
    dispatch({ type: 'SET_SELECTED_CLIENT', payload: client });
    return client;
  };
  
  // Select client
  const selectClient = (client: Client | null) => {
    dispatch({ type: 'SET_SELECTED_CLIENT', payload: client });
  };

  // Add new client
  const addClient = (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newClient: Client = {
      ...client,
      id: `C${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: now,
      updatedAt: now,
    };
    
    dispatch({ type: 'ADD_CLIENT', payload: newClient });
    toast.success('Client added successfully');
  };
  
  // Create client from form data
  const createClientFromForm = (formData: NewClientFormData) => {
    const clientData = formDataToClient(formData);
    addClient(clientData);
  };

  // Update client
  const updateClient = (client: Client) => {
    const updatedClient: Client = {
      ...client,
      updatedAt: new Date().toISOString(),
    };
    
    dispatch({ type: 'UPDATE_CLIENT', payload: updatedClient });
    toast.success('Client updated successfully');
  };
  
  // Update client from form data
  const updateClientFromForm = (id: string, formData: NewClientFormData) => {
    const client = state.clients.find(client => client.id === id);
    if (!client) {
      toast.error('Client not found');
      return;
    }
    
    const clientData = formDataToClient(formData);
    const updatedClient: Client = {
      ...client,
      ...clientData,
      updatedAt: new Date().toISOString(),
    };
    
    updateClient(updatedClient);
  };
  
  // Get client form data
  const getClientFormData = (clientId: string): NewClientFormData | null => {
    const client = state.clients.find(client => client.id === clientId);
    if (!client) return null;
    
    return clientToFormData(client);
  };

  // Delete client
  const deleteClient = (id: string) => {
    dispatch({ type: 'DELETE_CLIENT', payload: id });
    toast.success('Client deleted successfully');
  };

  // Add document to client
  const addDocument = (clientId: string, document: Omit<ClientDocument, 'id' | 'uploadDate'>) => {
    const newDocument: ClientDocument = {
      ...document,
      id: `DOC${Math.floor(1000 + Math.random() * 9000)}`,
      uploadDate: new Date().toISOString(),
    };
    
    dispatch({ 
      type: 'ADD_DOCUMENT', 
      payload: { clientId, document: newDocument } 
    });
    toast.success('Document added successfully');
  };

  // Update document status
  const updateDocumentStatus = (clientId: string, documentId: string, status: 'pending' | 'verified' | 'rejected') => {
    dispatch({ 
      type: 'UPDATE_DOCUMENT_STATUS', 
      payload: { clientId, documentId, status } 
    });
    toast.success(`Document status updated to ${status}`);
  };

  return (
    <ClientContext.Provider value={{ 
      state, 
      dispatch,
      searchClients,
      addClient,
      createClientFromForm,
      updateClient,
      updateClientFromForm,
      deleteClient,
      selectClient,
      addDocument,
      updateDocumentStatus,
      getClientFormData
    }}>
      {children}
    </ClientContext.Provider>
  );
}

// Custom hook to use the ClientContext
export function useClient() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
}
