import React from 'react';
import { render } from '@testing-library/react-native';
import Header from '@/components/Header';

describe('Header Component', () => {
    it('should render Urban KO title', () => {
        const { getByText } = render(<Header />);
        expect(getByText('Urban KO')).toBeTruthy();
    });

    it('should render subtitle', () => {
        const { getByText } = render(<Header />);
        expect(getByText('Trouve ton adversaire et met le KO')).toBeTruthy();
    });

    it('should render with custom style', () => {
        const customStyle = { marginTop: 20 };
        const { getByText } = render(<Header style={customStyle} />);
        expect(getByText('Urban KO')).toBeTruthy();
    });
});
