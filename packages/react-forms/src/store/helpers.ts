import { filter } from 'rxjs/operators';
import { merge } from 'lodash';
import { FormActions } from './types';
import { FormState, IFinalValues, FieldProps } from '../types';

export const createObject = (obj: { [key: string]: unknown } | void) => {
  if (!obj) return {};
  const isPlainObject = obj => !!obj && obj.constructor === {}.constructor;
  const getNestedObject = obj =>
    Object.entries(obj).reduce((result, [prop, val]) => {
      prop.split('.').reduce((nestedResult, prop, propIndex, propArray) => {
        const lastProp = propIndex === propArray.length - 1;
        if (lastProp) {
          nestedResult[prop] = isPlainObject(val) ? getNestedObject(val) : val;
        } else {
          nestedResult[prop] = nestedResult[prop] || {};
        }
        return nestedResult[prop];
      }, result);
      return result;
    }, {});
  return getNestedObject(obj);
};

export const isBoolean = (val: unknown) => typeof val === 'boolean';

export function ofType(actionType: string): any {
  return filter(({ type }: FormActions) => type === actionType);
}

export function containsNoErrors(fields: FieldProps[]) {
  return (
    fields
      .map((field: any) => field.meta.errors)
      .reduce((acc, val) => {
        return acc.concat(val);
      }, []).length === 0
  );
}

export function extractFinalValues(state: FormState): IFinalValues {
  return Object.values(state).reduce((acc, field: FieldProps) => {
    if ((field.value && !isBoolean(field.value)) || isBoolean(field.value)) {
      return merge(acc, createObject({ [field.name]: field.value }));
    }
    return acc;
  }, {});
}

export function allErrorsEmitted(state: any[], totalErrors: number) {
  return (
    Object.values(state)
      .filter((item: any) => item.requirements)
      .reduce((acc: unknown[], val: any) => {
        return acc.concat(val.requirements);
      }, []).length === totalErrors
  );
}
