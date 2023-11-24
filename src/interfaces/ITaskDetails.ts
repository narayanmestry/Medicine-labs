export interface ITask {
    id: number,
    user_id: number | null,
    start_time: null | string, 
    organization_id: number,
    device_id: null | number
}

export interface ITaskPerformed {
    id: number
    task_id: number
    model_id: number
    complete: boolean
    start_time: string
    end_time: string
    serial_id: number
    scenario: null | string
    version: null | string
}

export interface ItaskData {
    task:ITask[] | [], 
    taskPerformed: ITaskPerformed[] | [], 
    completedTask: number, 
    incompletedTask: number, 
    monthOverviewData: any[],
};

export interface ITaskResponse {
    task: ITask[],
    taskPerformed: ITaskPerformed[]
}

export interface ICompletedInCompleted {
    completedCount: number
    incompletedCount: number
  }

  export interface IUniqueMonths {
    [key: string]: any;
  }