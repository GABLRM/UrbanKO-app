import React from 'react';
import { render } from '@testing-library/react-native';
import PageHeader from '@/components/PageHeader';

describe('PageHeader Component', () => {
    it('should render with title', () => {
        const { getByText } = render(<PageHeader title="Page Title" />);
        expect(getByText('Page Title')).toBeTruthy();
    });

    it('should render with subtitle', () => {
        const { getByText } = render(<PageHeader title="Title" subtitle="Subtitle" />);
        expect(getByText('Title')).toBeTruthy();
        expect(getByText('Subtitle')).toBeTruthy();
    });

    it('should render without subtitle', () => {
        const { getByText, queryByText } = render(<PageHeader title="Title" />);
        expect(getByText('Title')).toBeTruthy();
    });
});
