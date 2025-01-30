import { Subject } from 'rxjs';

export class CounterIntent {
  constructor() {
    this.actions$ = new Subject();
  }

  dispatch(action) {
    this.actions$.next(action);
  }
}