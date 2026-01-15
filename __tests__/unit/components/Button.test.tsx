import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '@/components/Button';

describe('Button Component', () => {
    it('should render with title', () => {
        const { getByText } = render(<Button title="Click me" onPress={() => {}} />);

        expect(getByText('Click me')).toBeTruthy();
    });

    it('should call onPress when pressed', () => {
        const onPressMock = jest.fn();
        const { getByText } = render(<Button title="Click me" onPress={onPressMock} />);

        fireEvent.press(getByText('Click me'));

        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
        const onPressMock = jest.fn();
        const { getByText } = render(
            <Button title="Click me" onPress={onPressMock} isDisabled={true} />,
        );

        fireEvent.press(getByText('Click me'));

        expect(onPressMock).not.toHaveBeenCalled();
    });

    it('should apply custom styles', () => {
        const customStyle = { backgroundColor: 'red' };
        const { getByText } = render(
            <Button title="Styled Button" onPress={() => {}} style={customStyle} />,
        );

        expect(getByText('Styled Button')).toBeTruthy();
    });

    it('should render with disabled state', () => {
        const { getByText } = render(
            <Button title="Disabled" onPress={() => {}} isDisabled={true} />,
        );

        const button = getByText('Disabled');
        expect(button).toBeTruthy();
    });
});
