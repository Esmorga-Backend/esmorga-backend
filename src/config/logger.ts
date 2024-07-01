const LOGGER_PINO_CONFIG = {
  TEST: {
    pinoHttp: {
      level: 'silent',
    },
  },
  LOCAL: {
    pinoHttp: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          singleLine: true,
          ignore: 'pid,hostname,req',
        },
      },
    },
  },
  DEFAULT: {
    pinoHttp: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          singleLine: true,
        },
      },
    },
  },
};

export function getLoggerConfig(env: string) {
  return LOGGER_PINO_CONFIG[env.toUpperCase()] || LOGGER_PINO_CONFIG.DEFAULT;
}
