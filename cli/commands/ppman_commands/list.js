const chalk = require('chalk');

exports.command = ['list'];
exports.aliases = ['l'];
exports.describe = 'Lists all available packages';

const msg_format = {
    color: p =>
        `${chalk[p.installed ? 'green' : 'red']('•')} ${p.language} ${
            p.language_version
        }`,
    monochrome: p =>
        `${p.language} ${p.language_version} ${
            p.installed ? '(INSTALLED)' : ''
        }`,
    json: JSON.stringify,
};

exports.handler = async ({ axios }) => {
    try {
        const packages = await axios.get('/api/v2/packages');

        const pkg_msg = packages.data.map(msg_format.color).join('\n');

        console.log(pkg_msg);
    } catch (error) {
        const message =
            error.response?.data?.message ||
            (typeof error.response?.data === 'string'
                ? error.response.data
                : null) ||
            error.message;

        console.error(chalk.red.bold('❌'), `Failed to list packages: ${message}`);
    }
};
