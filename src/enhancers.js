import { Subject } from 'rxjs/Subject'
// eslint-disable-next-line no-unused-vars
import { map } from 'rxjs/operator/map'
// eslint-disable-next-line no-unused-vars
import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged'

export const withGetApp = wrappedPage =>
    Object.assign(wrappedPage, {
        getApp,
    })

export function connect(selector) {
    return (wrappedPage) => {
        const page = Object.assign({}, wrappedPage)
        let connectSub

        page.onLoad = function onLoad(...params) {
            const app = getApp()
            const didUpdate$ = app.store$
                .map(x => selector(x))
                .distinctUntilChanged((x, y) =>
                    Object.keys(x).every(k => x[k] === y[k]))
            connectSub = didUpdate$.subscribe(x =>
                this.state$ ? this.state$.next(x) : this.setData(x))
            apply(this, wrappedPage, 'onLoad', params)
        }

        page.onUnload = function onUnload(...params) {
            tryUnsubcribe(connectSub)
            apply(this, wrappedPage, 'onUnload', params)
        }
        return page
    }
}

const dump = () => {}
const highOrderDump = () => dump
export function watchUpdate(wrappedPage) {
    const page = Object.assign({}, wrappedPage)
    page.state$ = new Subject()

    page.onLoad = function onLoad(...params) {
        if (!this.state$ || this.state$.closed) {
            this.state$ = new Subject()
        }
        const didUpdate = this.didUpdate
            ? oldVal => () => this.didUpdate(oldVal)
            : highOrderDump

        this.state$
            .map(x => this.willUpdate
                ? (this.willUpdate(Object.assign({}, this.data, x)) || x)
                : x)
            .subscribe(x => {
                const data = Object.assign({}, this.data)
                this.setData(x, didUpdate(data))
            })
        apply(this, wrappedPage, 'onLoad', params)
    }

    page.onUnload = function onUnload(...params) {
        tryUnsubcribe(this.state$)
        apply(this, wrappedPage, 'onUnload', params)
    }

    return page
}

// 加入 computed 属性，必须前置 watchUpdate
export function computable(wrappedPage) {
    const page = Object.assign({}, wrappedPage)
    page.data = Object.assign(page.data, compute(page))
    page.willUpdate = function willUpdate(nextState) {
        const next = Object.assign({}, nextState, compute(this))
        return apply(this, wrappedPage, 'willUpdate', [next])
    }
    return page
}

export function compose(funcs) {
    if (funcs.length === 0) {
        return arg => arg
    }

    if (funcs.length === 1) {
        return funcs[0]
    }

    return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

function tryUnsubcribe(subscription) {
    if (subscription) {
        subscription.unsubcribe()
    }
}

function apply(ctx, target, funcName, args) {
    if (target[funcName]) {
        target[funcName].apply(ctx, args)
    }
}

function compute(page) {
    return page.computed
        ? Object.keys(page.computed).reduce((x, k) => ({
            ...x,
            [k]: page.computed[k].apply(page),
        }), {})
        : {}
}

export const polyfill = compose([
    withGetApp,
])

export const observable = compose([
    computable,
    watchUpdate,
])
