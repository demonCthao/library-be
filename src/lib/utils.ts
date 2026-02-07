import bcrypt from 'bcrypt';

const hashPass = async (user_pass: string) => {
    const saltRounds = 10;
    return await bcrypt.hash(user_pass, saltRounds);
}

export { hashPass }