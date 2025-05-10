import { useFormContext } from '../context/FormContext';
import { FormCard } from '../components/FormCard';
import { EmailField } from '../fields/contact/EmailField';
import { PhoneField } from '../fields/contact/PhoneField';

export function ContactSection() {
  return (
    <FormCard 
      title="Contact Information" 
      className="h-full flex flex-col"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <EmailField />
        </div>
        <div className="flex flex-col gap-4">
          <PhoneField />
        </div>
      </div>
    </FormCard>
  );
}
