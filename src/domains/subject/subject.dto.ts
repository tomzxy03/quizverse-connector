export interface SubjectResDTO {
  id: number;
  subjectName: string;
  description?: string;
}

export interface SubjectReqDTO {
  subjectName: string;
  description?: string;
}
