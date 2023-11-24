export interface IOrganization {
    orgName:string,
    orgId:string,
    orgAddress:string,
    onBoardDate:string,
    spocName:string,
    spocEmail:string,
    spocContactNo:string,
    subscriptionPackages:string,
    isQr: boolean
}

export interface IOrganizationResponse {
        id: number
        name: string
        address: string
        spoc_email: string
        spoc_name: string
        spoc_phone: string
        password: string
        on_boarding_date: string
        entitlement: number
        code: number
        is_qr: boolean
        is_logged_in: boolean
        access_token: any
        status: string
}