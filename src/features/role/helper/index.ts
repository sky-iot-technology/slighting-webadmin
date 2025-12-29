export function permissionArrayToMap(
  uiPermissions: { id: string; actions: string[] }[]
): Record<string, string[]> {
  return uiPermissions.reduce(
    (acc, cur) => {
      acc[cur.id] = cur.actions;
      return acc;
    },
    {} as Record<string, string[]>
  );
}
