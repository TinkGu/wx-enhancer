import Rx from 'rxjs/Rx'

export function createStore(reducer$, options = {}) {
    const { debug = false } = options
    let state = {}
    const store$ = new Rx.BehaviorSubject(state)

    const subscription = reducer$
        .map(reducer => reducer(state))
        // eslint-disable-next-line no-console
        .do(x => debug && console.log('%c%s', 'color:#61bd4f', '[wx-enhancer-store]: ', x))
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
    return Rx.Observable.merge(...reducers)
}

export function init(o$) {
    return o$.map(x => () => x)
}
