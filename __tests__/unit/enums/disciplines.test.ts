import { Disciplines, getDisciplineLabel } from '@/enums/disciplines';

describe('Disciplines Enum', () => {
    it('should have all discipline values', () => {
        expect(Disciplines.BOXING).toBe('Boxe');
        expect(Disciplines.MMA).toBe('MMA');
        expect(Disciplines.JUDO).toBe('Judo');
        expect(Disciplines.KARATE).toBe('Karate');
        expect(Disciplines.STREET_FIGHTING).toBe('Combat de rue');
        expect(Disciplines.TAEKWONDO).toBe('Taekwondo');
    });

    it('should have exactly 6 disciplines', () => {
        const values = Object.values(Disciplines);
        expect(values).toHaveLength(6);
    });

    describe('getDisciplineLabel', () => {
        it('should return correct label for BOXING', () => {
            expect(getDisciplineLabel('BOXING')).toBe('Boxe');
        });

        it('should return correct label for MMA', () => {
            expect(getDisciplineLabel('MMA')).toBe('MMA');
        });

        it('should return correct label for JUDO', () => {
            expect(getDisciplineLabel('JUDO')).toBe('Judo');
        });

        it('should return correct label for KARATE', () => {
            expect(getDisciplineLabel('KARATE')).toBe('Karate');
        });

        it('should return correct label for STREET_FIGHTING', () => {
            expect(getDisciplineLabel('STREET_FIGHTING')).toBe('Combat de rue');
        });

        it('should return correct label for TAEKWONDO', () => {
            expect(getDisciplineLabel('TAEKWONDO')).toBe('Taekwondo');
        });
    });
});
