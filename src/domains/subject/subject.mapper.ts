import { SubjectResDTO, SubjectReqDTO } from './subject.dto';
import { Subject } from './subject.types';
import { SubjectFormModel } from './subject.model';

export function dtoToSubject(dto: SubjectResDTO): Subject {
  return {
    id: dto.id,
    name: dto.subjectName,
    description: dto.description,
  };
}

export function subjectToFormModel(subject?: Subject): SubjectFormModel {
  return {
    name: subject?.name ?? '',
    description: subject?.description ?? '',
    isDirty: false,
    isSaving: false,
  };
}

export function formModelToReqDTO(model: SubjectFormModel): SubjectReqDTO {
  return {
    subjectName: model.name,
    description: model.description,
  };
}
