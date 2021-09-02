export class StateMachine {
    rules;
    state;
    constructor(state) {
        this.rules = new Map();
        this.state = state;
    }
    registerRules(prevState, rules) {
        this.rules.set(prevState, new Map(rules));
    }
    inputEvent(event) {
        const state = this.rules.get(this.state)?.get(event) ?? this.state;
        if (typeof state === 'function') {
            this.state = state();
        }
        else {
            this.state = state;
        }
        return this.state;
    }
}
