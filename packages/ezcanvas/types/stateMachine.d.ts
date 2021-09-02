export declare class StateMachine<T, U> {
    private rules;
    state: T;
    constructor(state: T);
    registerRules(prevState: T, rules: [U, T | (() => T)][]): void;
    inputEvent(event: U): T;
}
