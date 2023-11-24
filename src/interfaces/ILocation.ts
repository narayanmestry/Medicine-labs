export interface ILocation {
    officeName:string,
    locationId?:string,
    locationName:string,
    onBoardingDate:string
}

export interface ILocationResponse {
    id: number
    name: string
    office_id: number
    on_boarding_date: string
}