import { useFormContext } from '../context/FormContext';
import { FormCard } from '../components/FormCard';
import { FormField } from '../components/FormField';

export function KYCSection() {
  const { form } = useFormContext();

  return (
    <FormCard 
      title="KYC Information" 
      className="h-full flex flex-col"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        <FormField
          name="kyc.occupation"
          label="Occupation"
          control={form.control}
          placeholder="Enter occupation"
          maxLength={50}
        />
        <FormField
          name="kyc.employer"
          label="Employer"
          control={form.control}
          placeholder="Enter employer name"
          maxLength={100}
        />
        <FormField
          name="kyc.income"
          label="Annual Income"
          control={form.control}
          type="number"
          min="0"
          placeholder="Enter annual income"
        />
      </div>
    </FormCard>
  );
}
