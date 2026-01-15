import { Gender } from '@/enums/gender';

describe('Gender Enum', () => {
    it('should have MALE value', () => {
        expect(Gender.MALE).toBe('Male');
    });

    it('should have FEMALE value', () => {
        expect(Gender.FEMALE).toBe('Female');
    });

    it('should have OTHER value', () => {
        expect(Gender.OTHER).toBe('Other');
    });

    it('should have exactly 3 values', () => {
        const values = Object.values(Gender);
        expect(values).toHaveLength(3);
    });

    it('should be possible to iterate over gender values', () => {
        const genderValues = Object.values(Gender);
        expect(genderValues).toContain('Male');
        expect(genderValues).toContain('Female');
        expect(genderValues).toContain('Other');
    });
});
