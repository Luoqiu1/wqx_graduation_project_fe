export function GetContentListURL(res_id: number, schema_id: string): string {
  return `/content?res_id=${res_id}&schema_id=${schema_id}`;
}

export function GetContentDetailURL(
  res_id: string,
  schema_id: string,
  loc: string,
  is_create: string,
): string {
  return `/contentDetail?res_id=${res_id}&schema_id=${schema_id}&loc=${loc}&is_create=${is_create}`;
}

export function UpdateResourceURL(id: number): string {
  return `/updateResource/${id}`;
}

export function UpdateSchemaURL(id: number): string {
  return `/updateSchema/${id}`;
}
