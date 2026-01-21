export interface SubjectFormModel {
  name: string;
  description: string;

  isDirty: boolean;
  isSaving: boolean;

  errors?: {
    name?: string;
    description?: string;
  };
}
