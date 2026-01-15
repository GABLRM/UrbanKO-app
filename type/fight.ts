import User from '@/type/user';

export enum FightStatusEnum {
    PENDING = 'pending',
    TO_CONFIRMED = 'to_confirmed',
    IN_PROGRESS = 'in_progress',
    CANCELLED = 'cancelled',
    FINISHED = 'finished',
    TO_COME = 'to_come',
}

export type Fight = {
    _id: string;
    contestant1: User;
    contestant2: User;
    status: FightStatusEnum;
    winner?: User;
    location?: string;
    image?: string;
    date?: Date;
    description?: string;
};
