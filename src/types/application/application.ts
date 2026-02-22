export enum ApplicationStatus {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
    PENDING_REVIEW = 'PENDING_REVIEW',
    UNDER_REVIEW = 'UNDER_REVIEW',
    INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    SYSTEM_REJECTED = 'SYSTEM_REJECTED',
    APPROVED = 'APPROVED',
    PENDING = 'PENDING'
}

export interface Application {
    id: string;           // UUID
    userId: string;       // UUID
    cohortId: string;     // UUID
    cohortName: string;
    status: ApplicationStatus;
    isSystemRejected: boolean;
    systemRejectionReason?: string;
    submittedAt?: string; // ISO LocalDateTime
    createdAt: string;    // ISO LocalDateTime
    personalInfo?: PersonalInfoDto;
    education?: EducationDto;
    interviewDate?: string; // ISO LocalDateTime
    motivation?: MotivationDto;
    documents?: DocumentDto[];
    emergencyContacts?: EmergencyContactDto[];
    disability?: DisabilityDto;
    vulnerability?: VulnerabilityDto;
}

// Nested DTOs for multi-step forms
export interface PersonalInfoDto {
    fullName: string;
    email: string;
    phone: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
    nationality: string;
    maritalStatus?: string;
    socialLinks?: string;
    additionalInformation?: string;
}

export interface EducationDto {
    highestEducationLevel: 'PRIMARY' | 'SECONDARY' | 'HIGH_SCHOOL' | 'DIPLOMA' | 'BACHELOR' | 'MASTER' | 'PHD' | 'PROFESSIONAL_CERTIFICATE' | 'OTHER';
    highestEducation: string;
    occupation: string;
    employmentStatus: string;
    yearsExperience: number;
}

export interface MotivationDto {
    whyJoin: string;
    futureGoals: string;
    preferredCourse: string;
}

export interface DocumentDto {
    docType: string;
    fileUrl: string;
}

export interface EmergencyContactDto {
    name: string;
    relationship: string;
    phone: string;
}

export interface DisabilityDto {
    hasDisability: boolean;
    disabilityType?: string;
    disabilityDescription?: string;
}

export interface VulnerabilityDto {
    householdIncome: string;
    hasChildcareNeeds: boolean;
    description?: string;
}


export interface ApplicationQueryParams {
    page?: number;
    limit?: number;
    status?: ApplicationStatus;
    search?: string;
    cohortId?: string;
}

// Add this to src/types/application/application.ts

export interface ApplicationStepData {
    personalInfo?: PersonalInfoDto;
    education?: EducationDto;
    motivation?: MotivationDto;
    documents?: DocumentDto[];
    emergencyContacts?: EmergencyContactDto[];
    disability?: DisabilityDto;
    vulnerability?: VulnerabilityDto;
}

// You might also find this union type helpful if you have a generic
// handleNext(stepId: string, data: ApplicationStepPayload) function in your main form wrapper:
export type ApplicationStepPayload =
    | PersonalInfoDto
    | EducationDto
    | MotivationDto
    | DocumentDto[]
    | EmergencyContactDto[]
    | DisabilityDto
    | VulnerabilityDto;