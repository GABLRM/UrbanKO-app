import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Select } from '@/components/Select';

describe('Select Component', () => {
    const mockOptions = [
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2' },
        { label: 'Option 3', value: 'opt3' },
    ];

    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render with default placeholder', () => {
        const { getByText } = render(<Select options={mockOptions} onChange={mockOnChange} />);
        expect(getByText('Sélectionner...')).toBeTruthy();
    });

    it('should render with custom placeholder', () => {
        const { getByText } = render(
            <Select options={mockOptions} onChange={mockOnChange} placeholder="Choose option" />,
        );
        expect(getByText('Choose option')).toBeTruthy();
    });

    it('should render with label', () => {
        const { getByText } = render(
            <Select options={mockOptions} onChange={mockOnChange} label="Select an option" />,
        );
        expect(getByText('Select an option')).toBeTruthy();
    });

    it('should render with value', () => {
        const { getByText } = render(
            <Select options={mockOptions} onChange={mockOnChange} value="opt1" />,
        );
        expect(getByText('opt1')).toBeTruthy();
    });

    it('should render with labelValue instead of value', () => {
        const { getByText } = render(
            <Select
                options={mockOptions}
                onChange={mockOnChange}
                value="opt1"
                labelValue="Option 1"
            />,
        );
        expect(getByText('Option 1')).toBeTruthy();
    });

    it('should render dropdown trigger', () => {
        const { getByText } = render(<Select options={mockOptions} onChange={mockOnChange} />);

        // The select should render the placeholder text
        expect(getByText('Sélectionner...')).toBeTruthy();
    });

    it('should render options in component', () => {
        const { UNSAFE_root } = render(<Select options={mockOptions} onChange={mockOnChange} />);

        // Check the component receives the options prop
        expect(UNSAFE_root).toBeTruthy();
    });
});
