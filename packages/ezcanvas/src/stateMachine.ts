export class StateMachine<T, U> {
    private rules: Map<T, Map<U, T | (() => T)>>
    public state: T
    constructor(state: T) {
        this.rules = new Map()
        this.state = state
    }

    registerRules(prevState: T, rules: [U, T | (() => T)][]) {
        this.rules.set(prevState, new Map(rules))
    }

    inputEvent(event: U): T {
        const state = this.rules.get(this.state)?.get(event) ?? this.state
        if (typeof state === 'function') {
            this.state = (state as (() => T))()
        } else {
            this.state = state
        }
        return this.state
    }
}
