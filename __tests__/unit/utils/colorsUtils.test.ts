import { hexWithOpacity } from '@/utils/colorsUtils';

describe('colorsUtils', () => {
    describe('hexWithOpacity', () => {
        it('should add opacity to a full hex color', () => {
            const result = hexWithOpacity('#FF0000', 0.7);
            expect(result).toBe('#FF0000B3');
        });

        it('should add opacity to a short hex color', () => {
            const result = hexWithOpacity('#FFF', 0.5);
            expect(result).toBe('#FFFFFF80');
        });

        it('should handle hex color without #', () => {
            const result = hexWithOpacity('FF0000', 0.7);
            expect(result).toBe('#FF0000B3');
        });

        it('should handle 0 opacity', () => {
            const result = hexWithOpacity('#FF0000', 0);
            expect(result).toBe('#FF000000');
        });

        it('should handle full opacity (1)', () => {
            const result = hexWithOpacity('#FF0000', 1);
            expect(result).toBe('#FF0000FF');
        });

        it('should handle various opacity values', () => {
            expect(hexWithOpacity('#FF0000', 0.25)).toBe('#FF000040');
            expect(hexWithOpacity('#FF0000', 0.5)).toBe('#FF000080');
            expect(hexWithOpacity('#FF0000', 0.75)).toBe('#FF0000BF');
        });

        it('should handle lowercase hex colors', () => {
            const result = hexWithOpacity('#ff0000', 0.5);
            expect(result).toBe('#ff000080');
        });

        it('should handle short uppercase hex colors', () => {
            const result = hexWithOpacity('#ABC', 0.5);
            expect(result).toBe('#AABBCC80');
        });
    });
});
