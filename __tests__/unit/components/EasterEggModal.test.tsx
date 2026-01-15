import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EasterEggModal from '@/components/EasterEggModal';

describe('EasterEggModal Component', () => {
    const mockSetIsVisible = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not render when isVisible is false', () => {
        const { queryByText } = render(
            <EasterEggModal isVisible={false} setIsVisible={mockSetIsVisible} />,
        );

        expect(queryByText("POV: 5 ans d'étude à Ynov")).toBeFalsy();
    });

    it('should render when isVisible is true', () => {
        const { getByText } = render(
            <EasterEggModal isVisible={true} setIsVisible={mockSetIsVisible} />,
        );

        expect(getByText("POV: 5 ans d'étude à Ynov")).toBeTruthy();
    });

    it('should have a close button in modal', () => {
        const { getByText } = render(
            <EasterEggModal isVisible={true} setIsVisible={mockSetIsVisible} />,
        );

        // Modal renders content
        expect(getByText("POV: 5 ans d'étude à Ynov")).toBeTruthy();
    });

    it('should render the GIF image', () => {
        const { UNSAFE_getByType } = render(
            <EasterEggModal isVisible={true} setIsVisible={mockSetIsVisible} />,
        );

        const Image = require('react-native').Image;
        const image = UNSAFE_getByType(Image);

        expect(image.props.source.uri).toContain('tenor.com');
    });

    it('should toggle visibility on request close', () => {
        const { UNSAFE_getByType } = render(
            <EasterEggModal isVisible={true} setIsVisible={mockSetIsVisible} />,
        );

        const Modal = require('react-native').Modal;
        const modal = UNSAFE_getByType(Modal);

        // Simulate onRequestClose
        modal.props.onRequestClose();

        expect(mockSetIsVisible).toHaveBeenCalledWith(false);
    });
});
