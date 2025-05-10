'use client';

import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { AddressSection } from './sections/AddressSection';
import { ContactSection } from './sections/ContactSection';
import { DocumentSection } from './sections/DocumentSection';
import { KYCSection } from './sections/KYCSection';
import { FormProvider } from './context/FormContext';
import { useFormContext } from './context/FormContext';
import { FormCard } from './components/FormCard';
import { FormSection, NewClientFormData } from './types/form';

interface NewClientFormProps {
  onSubmit: (data: NewClientFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function NewClientForm({ onSubmit, onCancel, isLoading }: NewClientFormProps) {
  return (
    <FormProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-8 lg:p-12 flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">New Client Registration</h1>
        <div className="bg-white dark:bg-gray-800/10 rounded-xl shadow-sm dark:shadow-md p-6 sm:p-8 flex-grow">
          <form onSubmit={(e) => {
            e.preventDefault();
            const { handleSubmit, form } = useFormContext();
            const handleFormSubmit = async (data: NewClientFormData) => {
              await onSubmit(data);
            };
            handleSubmit(handleFormSubmit)(e);
          }} className="flex-grow flex flex-col space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormCard title="Personal Information">
                  <PersonalInfoSection />
                </FormCard>
                <FormCard title="Contact">
                  <ContactSection />
                </FormCard>
                <FormCard title="Address">
                  <AddressSection />
                </FormCard>
              </div>
              <div className="space-y-6">
                <FormCard title="KYC Information">
                  <KYCSection />
                </FormCard>
                <FormCard title="Document">
                  <DocumentSection />
                </FormCard>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}
