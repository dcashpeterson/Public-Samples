
export interface IWeeklyToDoTask {
    ContentTypeId: string;
    Id: number;
    Title: string;
    TaskDate: string;
    ProcessNotes: string;
    TaskOffset: number;
    SubmissionNotes: string;
    Completed1: boolean;
    Week: number;
    Cadence: string;
    WeekStartDate: string;
    WeekEndDate: string;
    SubmissionOffset: string;
    SubmissionDeadline1: string;
    Submit: boolean;
    Frequency: string;
}
