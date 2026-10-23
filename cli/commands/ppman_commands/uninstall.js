const chalk = require('chalk');

exports.command = ['uninstall <packages...>'];
exports.aliases = ['u'];
exports.describe = 'Uninstalls the named package';

//Splits the package into it's language and version
function split_package(pkg) {
    const [language, language_version] = pkg.split('=');

    return {
        language,
        version: language_version || '*',
    };
}

const msg_format = {
    color: p =>
        `${
            p.language ? chalk.green.bold('✓') : chalk.red.bold('❌')
        } Uninstallation ${p.language ? 'succeeded' : 'failed: ' + p.message}`,
    monochrome: p =>
        `Uninstallation ${p.language ? 'succeeded' : 'failed: ' + p.message}`,
    json: JSON.stringify,
};

exports.handler = async ({ axios, packages }) => {
    const requests = packages.map(package => split_package(package));
    for (const request of requests) {
        try {
            const uninstall = await axios.delete(`/api/v2/packages`, {
                data: request,
            });

            console.log(msg_format.color(uninstall.data));
        } catch (error) {
            const message =
                error.response?.data?.message ||
                (typeof error.response?.data === 'string'
                    ? error.response.data
                    : null) ||
                error.message;

            console.error(msg_format.color({ message }));
        }
    }
};
