export interface IDevice {
    deviceName:string,
    locationName:string,
    deviceDesc:string,
    onBoardingDate:string
}

export interface IDeviceResponse {
    id: number
    name: string
    descr: string
    location_id: number
    on_boarding_date: string
}