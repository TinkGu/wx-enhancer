import { create } from 'rxjs/observable/create'
import { of } from 'rxjs/observable/of'

const ob = {}

// eslint-disable-next-line
for (const p in wx) {
    switch (typeof wx[p]) {
        case 'object':
            ob[p] = Object.assign(wx[p])
            break
        case 'function':
            if (/Sync$/.test(p)) {
                ob[p] = obj => of(wx[p].call(null, obj))
            } else {
                ob[p] = obj =>
                    create(observer => {
                        const param = Object.assign({}, obj)
                        param.success = (...arg) => observer.next(...arg)
                        param.fail = e => observer.error(e)
                        param.complete = () => observer.complete()
                        wx[p].call(null, param)
                    })
            }
            break
        default:
            ob[p] = wx[p]
            break
    }
}

export default ob
