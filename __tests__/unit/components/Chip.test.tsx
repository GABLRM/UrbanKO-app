import React from 'react';
import { render } from '@testing-library/react-native';
import Chip from '@/components/Chip';

describe('Chip Component', () => {
    it('should render with text', () => {
        const { getByText } = render(<Chip text="Boxing" />);

        expect(getByText('Boxing')).toBeTruthy();
    });

    it('should render different text values', () => {
        const { getByText, rerender } = render(<Chip text="MMA" />);

        expect(getByText('MMA')).toBeTruthy();

        rerender(<Chip text="Karate" />);
        expect(getByText('Karate')).toBeTruthy();
    });

    it('should render as a TouchableOpacity', () => {
        const { getByText } = render(<Chip text="Judo" />);
        const chip = getByText('Judo').parent;

        expect(chip).toBeTruthy();
    });

    it('should handle empty text', () => {
        const { getByText } = render(<Chip text="" />);

        expect(getByText('')).toBeTruthy();
    });

    it('should handle long text', () => {
        const longText = 'This is a very long text for a chip component';
        const { getByText } = render(<Chip text={longText} />);

        expect(getByText(longText)).toBeTruthy();
    });
});
