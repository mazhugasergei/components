const colors = {
	green: "\x1b[42m",
	red: "\x1b[41m",
	yellow: "\x1b[43m",
	blue: "\x1b[44m",
	reset: "\x1b[0m",
}

export class Logger {
	static success(message: string, customStatus?: string): void {
		const status = `${colors.green} ${customStatus?.toUpperCase() || "SUCCESS"} ${colors.reset} `
		console.log(status + message)
	}

	static error(message: string, customStatus?: string): void {
		const status = `${colors.red} ${customStatus?.toUpperCase() || "ERROR"} ${colors.reset} `
		console.error(status + message)
	}

	static warning(message: string, customStatus?: string): void {
		const status = `${colors.yellow} ${customStatus?.toUpperCase() || "WARNING"} ${colors.reset} `
		console.warn(status + message)
	}

	static info(message: string, customStatus?: string): void {
		const status = `${colors.blue} ${customStatus?.toUpperCase() || "INFO"} ${colors.reset} `
		console.log(status + message)
	}

	static log(message: string, ...args: any[]): void {
		console.log(message, ...args)
	}
}

export const logger = Logger
