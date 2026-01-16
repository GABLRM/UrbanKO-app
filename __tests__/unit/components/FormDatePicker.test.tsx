import { render } from '@testing-library/react-native';
import { FormDatePicker } from '@/components/FormDatePicker';
import { useForm } from 'react-hook-form';

jest.mock('@react-native-community/datetimepicker', () => {
    const { View } = require('react-native');
    return (props: any) => <View testID="date-time-picker" {...props} />;
});

const FormDatePickerWrapper = ({ label }: { label?: string }) => {
    const { control } = useForm({
        defaultValues: {
            testDate: new Date('2024-01-01'),
        },
    });

    return <FormDatePicker control={control} name="testDate" label={label} />;
};

describe('FormDatePicker', () => {
    it('should render without label', () => {
        const { queryByText, getByTestId } = render(<FormDatePickerWrapper />);

        expect(queryByText(/Date/)).toBeNull();
        expect(getByTestId('date-time-picker')).toBeTruthy();
    });

    it('should render with label', () => {
        const { getByText, getByTestId } = render(<FormDatePickerWrapper label="Date du combat" />);

        expect(getByText('Date du combat')).toBeTruthy();
        expect(getByTestId('date-time-picker')).toBeTruthy();
    });
});
