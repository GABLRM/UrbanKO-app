type User = {
    _id: string;
    username: string;
    email: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
    city?: string;
    disciplines: string[];
    score: number;
    fights: number;
    victories: number;
    defeats: number;
    image?: string;
};

export default User;
