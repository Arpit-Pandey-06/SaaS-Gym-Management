export interface Tokenpayload {
    id:string,
    email:string,
    role:string,
    status:string
}

export interface RefreshTokenInterface{
    token_hash: string;
    userId: string;
    expires_at: Date;
}

export type UpdateBranchDTO = {
    branch_name:string,
    business_email:string,
    business_phone:string,
    address:string,
    city:string,
    state:string,
    country:string,
    postal_code:string,
    capacity:string,
    opening_time:string,
    closing_time:string,
}