export interface IUserResponse {
    id: number
    organization_id: number
    code: number
    on_boarding_date: string
    email: string
    fname: string | null
    lname: string | null
    phone: string
}

export interface IUser {
    id: number
    organization_id: number
    on_boarding_date: string
    email: string
    fname: string | null
    lname: string | null
}