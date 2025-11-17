export interface ICreateUser {
    full_name: string,
    document: string,
    email: string,
    password: string,
    type_of_user: 'guardian' | 'student',
    has_full_permission: boolean
}

export interface IUser extends ICreateUser {
    user_id: string,
}

export interface ILoginUser {
    email: string,
    password: string
}

export interface IAuthenticateUserResponse {
    user: IUser
    token: string;
}
