import { useFormContext } from '../context/FormContext';
import { FormCard } from '../components/FormCard';
import { CountryField } from '../fields/address/CountryField';
import { StreetAddressField } from '../fields/address/StreetAddressField';
import { CityField } from '../fields/address/CityField';
import { PostalCodeField } from '../fields/address/PostalCodeField';

export function AddressSection() {
  return (
    <FormCard 
      title="Address Information" 
      className="h-full flex flex-col"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        <CountryField />
        <StreetAddressField />
        <CityField />
        <PostalCodeField />
      </div>
    </FormCard>
  );
}
