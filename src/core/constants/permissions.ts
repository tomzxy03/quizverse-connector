export const AVAILABLE_PERMISSIONS = [
  'CREATE_user',
  'DELETE_answer_user',
  'DELETE_question_folder',
  'CREATE_question_folder',
  'CREATE_group',
  'CREATE_question_bank',
  'VIEW_group',
  'DELETE_quiz',
  'VIEW_permission',
  'DELETE_chapter',
  'UPDATE_quiz_result',
  'VIEW_user',
  'UPDATE_role',
  'VIEW_question_folder',
  'CREATE_role',
  'DELETE_permission',
  'VIEW_quiz_result',
  'CREATE_quiz',
  'VIEW_answer',
  'UPDATE_permission',
  'CREATE_permission',
  'UPDATE_question_folder',
  'DELETE_subject',
  'DELETE_role',
  'CREATE_chapter',
  'CREATE_question',
  'CREATE_subject',
  'UPDATE_question',
  'VIEW_notification',
  'UPDATE_quiz',
  'VIEW_question_bank',
  'UPDATE_group',
  'DELETE_user',
  'UPDATE_user',
  'DELETE_quiz_result',
  'UPDATE_question_bank',
  'VIEW_chapter',
  'DELETE_question_bank',
  'CREATE_notification',
  'DELETE_question',
  'VIEW_role',
  'CREATE_answer_user',
  'UPDATE_answer_user',
  'DELETE_notification',
  'CREATE_quiz_result',
  'UPDATE_subject',
  'UPDATE_answer',
  'CREATE_answer',
  'DELETE_group',
  'UPDATE_notification',
  'VIEW_subject',
  'DELETE_answer',
  'UPDATE_chapter',
  'VIEW_quiz',
  'VIEW_question',
  'VIEW_answer_user',
] as const;

export const PERMISSION_ACTIONS = ['CREATE', 'VIEW', 'UPDATE', 'DELETE'] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export type PermissionMatrixRow = {
  resourceKey: string;
  resourceLabel: string;
  permissions: Partial<Record<PermissionAction, string>>;
};

const ACTION_SET = new Set<string>(PERMISSION_ACTIONS);

const titleCase = (value: string) =>
  value
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ');

export const PERMISSION_MATRIX: PermissionMatrixRow[] = (() => {
  const rowsByResource = new Map<string, PermissionMatrixRow>();

  for (const permission of AVAILABLE_PERMISSIONS) {
    const [actionRaw, ...resourceParts] = permission.split('_');
    if (!ACTION_SET.has(actionRaw)) continue;
    const action = actionRaw as PermissionAction;
    const resourceKey = resourceParts.join('_');
    if (!resourceKey) continue;
    const existing = rowsByResource.get(resourceKey);
    if (existing) {
      existing.permissions[action] = permission;
      continue;
    }
    rowsByResource.set(resourceKey, {
      resourceKey,
      resourceLabel: titleCase(resourceKey),
      permissions: { [action]: permission },
    });
  }

  return Array.from(rowsByResource.values()).sort((a, b) => a.resourceLabel.localeCompare(b.resourceLabel));
})();
