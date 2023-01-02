import { TransformableInfo } from 'logform';
import { createLogger, format, transports, Logger } from 'winston';

const { combine, colorize, label, timestamp, metadata, errors, json } = format;
const level: string = process.env.NODE_ENV === 'production' ? 'error' : 'debug';

function printLog(data: TransformableInfo): string {
	return `${data.timestamp} ${data.level} [${data.label}]: ${data.message}`;
}

const logger: Logger = createLogger({
	level,
	format: combine(
		errors({ stack: true }),
		label({ label: 'Lauzine' }),
		timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
	),
	transports: [
		new transports.Console({
			level,
			format: combine(colorize(), format.printf(printLog)),
			silent: false,
		}),
	],
});

logger.info(
	`SERVER INITIALISATION::Logging initialised on ${process.env.NODE_ENV} server`
);

export { logger };
