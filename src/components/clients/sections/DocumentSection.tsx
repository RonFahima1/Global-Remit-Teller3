import { useFormContext } from '../context/FormContext';
import { FormCard } from '../components/FormCard';
import { FormField } from '../components/FormField';
import { DocumentType } from '../types/form';
import { FileUpload } from '../components/FileUpload';

export function DocumentSection() {
  const { form } = useFormContext();

  return (
    <FormCard title="Document Information">
      <div className="space-y-6">
        <div>
          <FormField
            name="identification.idType"
            label="ID Type"
            control={form.control}
            as="select"
            options={[
              { value: 'passport', label: 'Passport' },
              { value: 'national_id', label: 'National ID' },
              { value: 'drivers_license', label: 'Driver\'s License' }
            ]}
          />
        </div>
        <div>
          <FormField
            name="identification.idNumber"
            label="ID Number"
            control={form.control}
            placeholder="Enter ID number"
            maxLength={50}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUpload
            type="idFront"
            label="ID Front"
            error={form.formState.errors.documents?.idFront?.message}
          />
          <FileUpload
            type="idBack"
            label="ID Back"
            error={form.formState.errors.documents?.idBack?.message}
          />
          <FileUpload
            type="proofOfAddress"
            label="Proof of Address"
            error={form.formState.errors.documents?.proofOfAddress?.message}
          />
        </div>
      </div>
    </FormCard>
  );
}
