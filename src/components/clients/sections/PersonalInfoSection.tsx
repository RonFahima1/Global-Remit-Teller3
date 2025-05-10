import { useFormContext } from '../context/FormContext';
import { FormCard } from '../components';
import { FirstNameField } from '../fields/FirstNameField';
import { LastNameField } from '../fields/LastNameField';
import { NationalityField } from '../fields/NationalityField';
import { GenderField } from '../fields/GenderField';
import { DateOfBirthField } from '../fields/DateOfBirthField';

export function PersonalInfoSection() {
  return (
    <FormCard 
      title="Personal Information" 
      className="h-full flex flex-col lg:col-span-1 p-4 sm:p-6 lg:p-8 xl:p-10"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 flex-grow">
        <FirstNameField />
        <LastNameField />
        <NationalityField />
        <GenderField />
        <DateOfBirthField />
      </div>
    </FormCard>
  );
}
