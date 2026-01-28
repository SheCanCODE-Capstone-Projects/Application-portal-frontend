export type CohortStatus = "OPEN" | "CLOSED" | "UPCOMING" | "COMPLETED";

export interface Cohort {
    id: string;          // UUID
    name: string;
    description: string;
    requirements: string[];
    rules: string[];
    roles: string[];     // e.g., ['APPLICANT', 'ADMIN']
    isOpen: boolean;
    status?: CohortStatus;
    applicationLimit: number;
    year: number;
    startDate: string;   // ISO LocalDate
    endDate: string;     // ISO LocalDate
}
