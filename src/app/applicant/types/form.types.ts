export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export interface Education {
  name: string;
  degree: string;
  grade: string;
  startDate: string;
  endDate: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  responsibilities: string;
}

export interface FormData {
  personalInfo: PersonalInfo;
  education: Education[];
  workExperience: WorkExperience[];
  cv: File | null;
  coverLetter: File | null;
  certificates: File[];
}

export interface StepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}