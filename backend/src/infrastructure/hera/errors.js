export class HeraIntegrationError extends Error {
  constructor(message, { cause, code = 'HERA_INTEGRATION_ERROR' } = {}) {
    super(message, { cause });
    this.name = 'HeraIntegrationError';
    this.code = code;
  }
}

export class HeraStateNotFoundError extends HeraIntegrationError {
  constructor(statePath) {
    super(`Hera state not found: ${statePath}`, {
      code: 'HERA_STATE_NOT_FOUND',
    });
  }
}

export class HeraStateParseError extends HeraIntegrationError {
  constructor(statePath, cause) {
    super(`Invalid Hera state JSON: ${statePath}`, {
      cause,
      code: 'HERA_STATE_INVALID',
    });
  }
}