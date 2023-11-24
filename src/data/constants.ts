export enum Models {
    CPR = 0
}

export enum SCENARIOS {
    CPR_BasicLifeSupport = 'CPR_BasicLifeSupport',
    CPR_BLS_Garden_AED = 'CPR_BLS_Garden_AED',
    CPR_BLS_Office_AED = 'CPR_BLS_Office_AED',
    CPR_BLS_Garden = 'CPR_BLS_Garden',
    CPR_BLS_AED = 'CPR_BLS_AED'
}

export const scenariosList=[
    {value:'CPR_BLS_Garden', label:'CPR Garden'},
    {value:'CPR_BasicLifeSupport', label:'CPR Office'},
    {value:'CPR_BLS_AED', label:'CPR AED Office'},
    {value:'CPR_BLS_Garden_AED', label:'CPR AED Garden'},
]


export const sessionWarningTimeInMins = 10;
export const sessionTimeoutInMins = 15;

export const existingSessionMessage = 'You have already an active session. If you clicks on continue then your previous session will be expired.';