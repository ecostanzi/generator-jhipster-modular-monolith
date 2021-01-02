/* eslint-disable consistent-return */
const chalk = require('chalk');
const AppGenerator = require('generator-jhipster/generators/app');

module.exports = class extends AppGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(
                `This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint modular-monolith')}`
            );
        }

        this.configOptions = jhContext.configOptions || {};
    }

    get initializing() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._initializing();
    }

    get prompting() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        const phaseFromJHipster = super._prompting();
        const customPrompts = {
            askModuleName() {
                const prompts = [
                    {
                        type: 'confirm',
                        name: 'useModuleForUser',
                        message: 'Do you want to move user related classes to a module?',
                        default: true
                    },
                    {
                        when: response => response.useModuleForUser === true,
                        type: 'input',
                        name: 'userModuleName',
                        message: "What's the module name for your user classes?",
                        default: '',
                        validate: input => {
                            if (!/^([a-zA-Z0-9_]*)$/.test(input)) {
                                return 'Your module name cannot contain special characters';
                            }
                            if (input === '') return 'Please provide a module name';
                            return true;
                        }
                    }
                ];

                const done = this.async();
                this.prompt(prompts).then(props => {
                    this.useModuleForUser = props.useModuleForUser;
                    if (this.useModuleForUser) {
                        this.userModuleName = props.userModuleName;
                    }
                    done();
                });
            }
        };
        return Object.assign(customPrompts, phaseFromJHipster);
    }

    get configuring() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._configuring();
    }

    get default() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._default();
    }

    get writing() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._writing();
    }

    get install() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._install();
    }

    get end() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._end();
    }
};
