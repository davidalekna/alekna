import { of, merge, interval, empty } from 'rxjs';
import {
  filter,
  mergeMap,
  mapTo,
  startWith,
  switchMap,
  scan,
  takeWhile,
  last,
  tap,
  takeUntil,
  map,
} from 'rxjs/operators';
import {
  CREATE,
  MOUSE_ENTER,
  MOUSE_LEAVE,
  CLEAR_ALL,
  DISMISS,
} from './actions';
import { dismissToast, updateToast } from './actions';
import { ofType } from './helpers';

export function createEpic(action$) {
  return action$.pipe(
    ofType(CREATE),
    mergeMap((action: any) => {
      if (!action.payload.autoClose) {
        return of(action);
      }

      const interval$ = interval(1000).pipe(mapTo(-1));
      const pause$ = action$
        .pipe(
          ofType(MOUSE_ENTER),
          filter(({ payload }: any) => {
            return payload === action.payload.id;
          }),
        )
        .pipe(mapTo(false));
      const resume$ = action$
        .pipe(
          ofType(MOUSE_LEAVE),
          filter(({ payload }: any) => {
            return payload === action.payload.id;
          }),
        )
        .pipe(mapTo(true));

      return merge(pause$, resume$).pipe(
        startWith(true),
        switchMap(val => (val ? interval$ : empty())),
        scan(
          (acc, curr) => (curr ? curr + acc : acc),
          action.payload.delay / 1000,
        ),
        takeWhile(v => v >= 0),
        // TODO: update countdown on Toast object
        // NOTE: map not working
        map(countdown => updateToast({ ...action.payload, countdown })),
        tap(i => console.log('end', i)),
        last(),
        mapTo(dismissToast(action.payload.id)),
        takeUntil(
          merge(
            action$.pipe(ofType(CLEAR_ALL)),
            action$.pipe(
              ofType(DISMISS),
              filter(({ payload }: any) => {
                return payload === action.payload.id;
              }),
            ),
          ),
        ),
      );
    }),
  );
}
