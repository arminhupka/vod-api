import { Transform, TransformFnParams } from 'class-transformer';

export const ExposeId = () => (target: unknown, propertyKey: string) => {
  Transform((params: TransformFnParams) => params.obj[propertyKey])(
    target,
    propertyKey,
  );
};
