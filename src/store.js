import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { merge } from 'rxjs/observable/merge'
// eslint-disable-next-line no-unused-vars
import { map } from 'rxjs/operator/map'
// eslint-disable-next-line no-unused-vars
import { do as tap } from 'rxjs/operator/do'

export function createStore(reducer$, options = {}) {
    const { debug = false } = options
    let state = {}
    const store$ = new BehaviorSubject(state)

    const subscription = reducer$
        .map(reducer => reducer(state))
        // eslint-disable-next-line no-console
        .tap(x => debug && console.log('%c%s', 'color:#61bd4f', '[wx-enhancer-store]: ', x))
        .subscribe(x => {
            state = x
            store$.next(x)
        })

    return {
        store$,
        getState: () => state,
        unsubcribe: () => {
            subscription.unsubcribe()
            store$.unsubcribe()
        },
    }
}

export function combineReducers(reducerMap) {
    const keys = Object.keys(reducerMap)
    const reducers = keys.map(k => reducerMap[k].map(r => state => ({
        ...state,
        [k]: r(state[k])
    })))
    return merge(...reducers)
}

export function init(o$) {
    return o$.map(x => () => x)
}
