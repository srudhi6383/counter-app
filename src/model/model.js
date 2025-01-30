import { BehaviorSubject } from 'rxjs';

export class CounterModel {
  constructor() {
    this.state$ = new BehaviorSubject({
      count: 0,
      isAutoIncrement: false
    });
  }

  getState() {
    return this.state$.getValue();
  }

  updateState(newState) {
    const currentState = this.getState();
    this.state$.next({
      ...currentState,
      ...newState
    });
  }
}