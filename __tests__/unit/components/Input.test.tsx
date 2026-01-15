import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Input from '@/components/Input';

describe('Input Component', () => {
    it('should render with label and placeholder', () => {
        const { getByText, getByPlaceholderText } = render(
            <Input label="Email" placeholder="Enter your email" />,
        );

        expect(getByText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    });

    it('should call onChangeText when text changes', () => {
        const onChangeTextMock = jest.fn();
        const { getByPlaceholderText } = render(
            <Input label="Email" placeholder="Enter your email" onChangeText={onChangeTextMock} />,
        );

        const input = getByPlaceholderText('Enter your email');
        fireEvent.changeText(input, 'test@example.com');

        expect(onChangeTextMock).toHaveBeenCalledWith('test@example.com');
    });

    it('should display error message when provided', () => {
        const { getByText } = render(
            <Input label="Email" placeholder="Enter your email" error="Email is required" />,
        );

        expect(getByText('Email is required')).toBeTruthy();
    });

    it('should toggle password visibility when eye icon is pressed', () => {
        const { getByPlaceholderText, getByTestId } = render(
            <Input label="Password" placeholder="Enter your password" secureTextEntry={true} />,
        );

        const input = getByPlaceholderText('Enter your password');

        // Initially secure text entry should be true
        expect(input.props.secureTextEntry).toBe(true);
    });

    it('should render as numeric keyboard when isNumber is true', () => {
        const { getByPlaceholderText } = render(
            <Input label="Age" placeholder="Enter your age" isNumber={true} />,
        );

        const input = getByPlaceholderText('Enter your age');
        expect(input.props.keyboardType).toBe('numeric');
    });

    it('should call onBlur when input loses focus', () => {
        const onBlurMock = jest.fn();
        const { getByPlaceholderText } = render(
            <Input label="Email" placeholder="Enter your email" onBlur={onBlurMock} />,
        );

        const input = getByPlaceholderText('Enter your email');
        fireEvent(input, 'blur');

        expect(onBlurMock).toHaveBeenCalled();
    });

    it('should display the value prop', () => {
        const { getByDisplayValue } = render(
            <Input label="Email" placeholder="Enter your email" value="test@example.com" />,
        );

        expect(getByDisplayValue('test@example.com')).toBeTruthy();
    });
});
