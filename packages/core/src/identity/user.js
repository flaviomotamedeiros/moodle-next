"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserDeleted = exports.UserCreated = void 0;
const aggregate_root_js_1 = require("../shared/aggregate-root.js");
const domain_event_js_1 = require("../shared/domain-event.js");
class UserCreated extends domain_event_js_1.BaseDomainEvent {
    userId;
    email;
    constructor(userId, email) {
        super('identity.user_created', userId);
        this.userId = userId;
        this.email = email;
    }
}
exports.UserCreated = UserCreated;
class UserDeleted extends domain_event_js_1.BaseDomainEvent {
    userId;
    constructor(userId) {
        super('identity.user_deleted', userId);
        this.userId = userId;
    }
}
exports.UserDeleted = UserDeleted;
class User extends aggregate_root_js_1.AggregateRoot {
    props;
    constructor(id, props) {
        super(id);
        this.props = props;
    }
    static create(id, props) {
        const user = new User(id, props);
        user.emit(new UserCreated(id, props.email));
        return user;
    }
    static reconstitute(id, props) {
        return new User(id, props);
    }
    get email() { return this.props.email; }
    get firstName() { return this.props.firstName; }
    get lastName() { return this.props.lastName; }
    get fullName() { return `${this.props.firstName} ${this.props.lastName}`; }
    get isDeleted() { return !!this.props.deletedAt; }
    updateProfile(firstName, lastName) {
        this.props.firstName = firstName;
        this.props.lastName = lastName;
    }
    /** Soft delete — grades and submissions are preserved for audit. */
    delete() {
        if (this.isDeleted)
            return;
        this.props.deletedAt = new Date();
        this.emit(new UserDeleted(this.id));
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map