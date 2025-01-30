import React, { useEffect, useState } from 'react';
import { interval } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CounterModel } from '../model/model';
import { CounterIntent } from '../intent/intent';
import './view.css';

export const Counter = () => {
  const [model] = useState(() => new CounterModel());
  const [intent] = useState(() => new CounterIntent());
  const [state, setState] = useState(model.getState());

  useEffect(() => {
    const stateSub = model.state$.subscribe(setState);

    const actionSub = intent.actions$.subscribe(action => {
      const currentState = model.getState();

      switch (action.type) {
        case 'INCREMENT':
          model.updateState({ count: Math.min(currentState.count + 1, 98) });
          break;
        case 'DECREMENT':
          model.updateState({ count: Math.max(currentState.count - 1, 0) });
          break;
        case 'RESET':
          model.updateState({ count: 0 });
          break;
        case 'TOGGLE_AUTO':
          model.updateState({ isAutoIncrement: !currentState.isAutoIncrement });
          break;
        default:
          break;
      }
    });

    const autoSub = interval(1100)
      .pipe(filter(() => model.getState().isAutoIncrement))
      .subscribe(() => {
        const { count } = model.getState();
        model.updateState({ count: Math.min(count + 1, 98) });
      });

    return () => {
      stateSub.unsubscribe();
      autoSub.unsubscribe();
      actionSub.unsubscribe();
    };
  }, [model, intent]);

  return (
    <div className="app-wrapper">
      <div className="counter-box">
        <h1 className="counter-heading">Counter App</h1>
        
        <div className="counter-value">
          {state.count}
        </div>
        
        <div className="counter-actions">
          <button 
            className="counter-btn decrement-btn"
            onClick={() => intent.dispatch({ type: 'DECREMENT' })}
          >
            -
          </button>
          <button 
            className="counter-btn increment-btn"
            onClick={() => intent.dispatch({ type: 'INCREMENT' })}
          >
            +
          </button>
        </div>
        
        <button 
          className="counter-btn reset-btn"
          onClick={() => intent.dispatch({ type: 'RESET' })}
        >
          Reset
        </button>
        
        <div className="auto-toggle-wrapper">
          <div 
            className={`toggle-container ${state.isAutoIncrement ? 'toggle-active' : ''}`}
            onClick={() => intent.dispatch({ type: 'TOGGLE_AUTO' })}
          >
            <div className={`toggle-indicator ${state.isAutoIncrement ? 'toggle-active' : ''}`} />
          </div>
          <span className="toggle-description">Auto Increment</span>
        </div>
      </div>
    </div>
  );
};
