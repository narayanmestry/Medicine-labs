export interface IOffice {
    officeName:string,
    orgId:string,
    OfficeAddredd:string,
    onBoardingDate:string
}

export interface IOfficeResponse {
    id: number
    name: string
    address: string
    organization_id: any
    on_boarding_date: string
}