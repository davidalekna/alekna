import { IField, FormState } from '../types';
import {
  mergeMap,
  filter,
  throttleTime,
  switchMap,
  map,
  tap,
} from 'rxjs/operators';
import { of, Observable, from } from 'rxjs';
import fieldValidator from './fieldValidator';
import {
  containsNoErrors,
  extractFinalValues,
  allErrorsEmitted,
} from './helpers';

export const UPDATE = '@form/UPDATE';
export const FIELD_BLUR = '@form/FIELD_BLUR';
export const FIELD_ERROR_UPDATE = '@form/FIELD_ERROR_UPDATE';
export const ERROR = '@form/ERROR';
export const FIELD_FOCUS = '@form/FIELD_FOCUS';
export const ERRORS = '@form/ERRORS';
export const FORM_RESET = '@form/FORM_RESET';
export const FORM_SUBMIT = '@form/FORM_SUBMIT';
export const FORM_INITIALIZE = '@form/FORM_INITIALIZE';

export function fieldUpdate({ name, value }: { name: string; value: any }) {
  return {
    type: UPDATE,
    payload: {
      name,
      value,
    },
  };
}

export const fieldBlur: any = ({ item }: { item: IField }) => (
  actions$: Observable<any>,
) => {
  return of({
    type: FIELD_BLUR,
    payload: { item },
  }).pipe(
    mergeMap((action: any) => {
      return of(action).pipe(
        filter(
          ({ payload }) =>
            Array.isArray(payload.item.requirements) &&
            payload.item.requirements.length,
        ),
        fieldValidator(actions$),
      );
    }),
  );
};

export function fieldFocus(name: string) {
  return {
    type: FIELD_FOCUS,
    payload: { name },
  };
}

export function formReset() {
  return {
    type: FORM_RESET,
  };
}

export function formInitialize(initialValues) {
  return {
    type: FORM_INITIALIZE,
    payload: initialValues,
  };
}

export const formSubmit: any = (state: any, onSubmit: Function) => actions$ => {
  return of({
    type: FORM_SUBMIT,
    payload: state,
    onSubmit,
  }).pipe(
    throttleTime(1500),
    switchMap(({ payload, onSubmit }: { payload: any; onSubmit: Function }) => {
      const errorsBuffer: IField[] = [];
      const state$ = Object.values(payload).map((item: IField) => of(item));

      return from(state$).pipe(
        mergeMap((field: any) => {
          return field.pipe(
            filter((item: any) => {
              return (
                Array.isArray(item.requirements) && item.requirements.length
              );
            }),
            map(field => ({ payload: { item: field } })),
            fieldValidator(actions$),
            tap((err: any) => {
              // Side effect: process onSubmit
              errorsBuffer.push(err.payload.item);
              return (
                allErrorsEmitted(payload, errorsBuffer.length) &&
                containsNoErrors(errorsBuffer) &&
                onSubmit(extractFinalValues(payload))
              );
            }),
          );
        }),
      );
    }),
  );
};

export function formErrors(state: FormState) {
  return {
    type: ERRORS,
    payload: state,
  };
}

export function fieldErrorUpdate(field: IField) {
  return {
    type: FIELD_ERROR_UPDATE,
    payload: field,
  };
}
