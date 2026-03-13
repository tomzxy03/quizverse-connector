// Matches BE SubjectResDTO
export interface SubjectResDTO {
  id: number;
  subjectName: string;
  description?: string;
}

// Matches BE SubjectDetailResDTO
export interface SubjectDetailResDTO {
  id: number;
  subjectName: string;
  description?: string;
  countQuiz: number;
}

// Matches BE SubjectReqDTO
export interface SubjectReqDTO {
  subjectName: string;
  description: string;
}
