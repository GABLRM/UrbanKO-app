import { Discipline } from '@/enums/discipline';
import { Gender } from '@/enums/gender';

type User = {
    _id: string;
    username: string;
    email: string;
    age: number;
    gender: Gender;
    height: number;
    weight: number;
    city?: string;
    disciplines: Discipline[];
    score: number;
    fights: number;
    victories: number;
    defeats: number;
    image?: string;
};

export default User;
