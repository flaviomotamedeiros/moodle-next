"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = exports.LogoutPerformed = exports.LoginFailed = exports.LoginSucceeded = void 0;
const entity_js_1 = require("../shared/entity.js");
const domain_event_js_1 = require("../shared/domain-event.js");
class LoginSucceeded extends domain_event_js_1.BaseDomainEvent {
    userId;
    sessionId;
    constructor(userId, sessionId) {
        super('auth.login_succeeded', sessionId);
        this.userId = userId;
        this.sessionId = sessionId;
    }
}
exports.LoginSucceeded = LoginSucceeded;
class LoginFailed extends domain_event_js_1.BaseDomainEvent {
    username;
    reason;
    constructor(username, reason) {
        super('auth.login_failed', username);
        this.username = username;
        this.reason = reason;
    }
}
exports.LoginFailed = LoginFailed;
class LogoutPerformed extends domain_event_js_1.BaseDomainEvent {
    sessionId;
    constructor(sessionId) {
        super('auth.logout', sessionId);
        this.sessionId = sessionId;
    }
}
exports.LogoutPerformed = LogoutPerformed;
class Session extends entity_js_1.Entity {
    props;
    constructor(id, props) {
        super(id);
        this.props = props;
    }
    get userId() { return this.props.userId; }
    get accessToken() { return this.props.accessToken; }
    get refreshToken() { return this.props.refreshToken; }
    get expiresAt() { return this.props.expiresAt; }
    get isExpired() { return new Date() >= this.props.expiresAt; }
    get isRevoked() { return !!this.props.revokedAt; }
    get isValid() { return !this.isExpired && !this.isRevoked; }
    revoke() {
        this.props.revokedAt = new Date();
    }
}
exports.Session = Session;
//# sourceMappingURL=session.js.map