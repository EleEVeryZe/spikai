export interface IQueueStatus{
    jobId: string;
    status: "Processing" | "Pending" | "Finished";
    message: string;  
    body?: any;
}
export class QueueStatus implements IQueueStatus {
    jobId: string;
    status: "Processing" | "Pending" | "Finished";
    message: string; 
    body?: any;
}