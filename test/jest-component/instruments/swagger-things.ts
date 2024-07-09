import { context, schema } from '../steps-config';

export function getRowsDetail(length) {
  const rows = {};

  for (const row in schema.paths[context.path][context.method].requestBody
    .content['application/json'].schema.properties) {
    const prop =
      schema.paths[context.path][context.method].requestBody.content[
        'application/json'
      ].schema.properties[row];

    if (prop.type == 'string' && prop[length]) {
      rows[row] = prop[length];
    } else if (prop.type == 'object') {
      for (const subprop in prop.properties) {
        if (
          (prop.properties[subprop].type = 'string') &&
          prop.properties[subprop][length]
        ) {
          rows[row + '.' + subprop] = prop.properties[subprop][length];
        }
      }
    }
  }
  return rows;
}
