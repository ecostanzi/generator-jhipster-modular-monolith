/* eslint-disable consistent-return */
const _ = require('lodash');
const chalk = require('chalk');
const EntityGenerator = require('generator-jhipster/generators/entity');

module.exports = class extends EntityGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(
                `This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint modular-monolith')}`
            );
        }

        this.configOptions = jhContext.configOptions || {};

        // This sets up options for this sub generator and is being reused from JHipster
        jhContext.setupEntityOptions(this, jhContext, this);
    }

    get initializing() {
        return super._initializing();
    }

    get prompting() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        const phaseFromJHipster = super._prompting();

        const customPrompts = {
            askSkipRest() {
                const context = this.context;

                if (context.useConfigurationFile || context.skipServer) {
                    this.skipRest = false;
                    return;
                }

                // module is already defined
                if (context.fileData !== undefined && context.fileData.skipRest !== undefined) {
                    this.skipRest = context.fileData.skipRest;
                    return;
                }

                this.skipRest = false;
                const prompts = [
                    {
                        type: 'list',
                        name: 'controller',
                        message: 'Do you want to generate a REST controller for your entity?',
                        choices: [
                            {
                                value: 'yes',
                                name: 'Yes, generate the REST controller as usual'
                            },
                            {
                                value: 'no',
                                name: 'No, skip the generation of the REST controller'
                            }
                        ],
                        default: 0
                    }
                ];

                const done = this.async();
                this.prompt(prompts).then(props => {
                    this.skipRest = props.controller === 'no';
                    done();
                });
            },

            askModuleName() {
                const context = this.context;

                if (context.useConfigurationFile || context.skipServer) {
                    this.moduleName = '';
                    this.useModule = false;
                    return;
                }

                // module is already defined
                if (context.fileData !== undefined && context.fileData.module !== undefined) {
                    if (context.fileData.module) {
                        this.moduleName = context.fileData.module;
                        this.useModule = true;
                    } else {
                        this.moduleName = '';
                        this.useModule = false;
                    }
                    return;
                }

                const prompts = [
                    {
                        type: 'confirm',
                        name: 'useModule',
                        message: 'Do you want to add your entity to a module?',
                        default: true
                    },
                    {
                        when: response => response.useModule === true,
                        type: 'input',
                        name: 'moduleName',
                        message: "What's the module name for your entity?",
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
                    this.useModule = props.useModule;
                    if (this.useModule) {
                        this.moduleName = props.moduleName;
                    }
                    done();
                });
            }
        };

        return Object.assign(phaseFromJHipster, customPrompts);
    }

    get configuring() {
        const configuring = super._configuring();

        const myCustomPostPhaseSteps = {
            configureModuleData() {
                this.context.useModule = this.useModule;
                if (!this.useModule) {
                    this.updateEntityConfig(this.context.filename, 'module', '');
                    return;
                }

                // check that all the entity relationships are in the same module
                this.context.relationships.forEach(relationship => {
                    if (relationship.otherEntityNameCapitalized !== 'User') {
                        const relationshipData = this.fs.readJSON(`.jhipster/${relationship.otherEntityNameCapitalized}.json`);
                        if (relationshipData.module !== this.moduleName) {
                            throw new Error(
                                `Cannot relate entity ${this.context.name} to entity ${
                                    relationship.otherEntityNameCapitalized
                                }. they belong to different modules ('${this.moduleName}' and '${relationshipData.module}').`
                            );
                        }
                    }
                });

                this.log(chalk.white(`Saving ${chalk.bold(this.options.name)} module`));
                this.context.useModule = this.useModule;
                this.context.lowerCaseModuleName = _.toLower(this.moduleName);
                this.context.capitalizedModuleName = _.capitalize(this.moduleName);
                this.context.modulePackageName = `${this.context.packageName}.modules.${this.context.lowerCaseModuleName}`;
                this.context.moduleFolder = `${this.context.packageFolder}/modules/${this.context.lowerCaseModuleName}`;
                this.updateEntityConfig(this.context.filename, 'module', this.moduleName);
            },

            configureSkipRestData() {
                this.context.skipRest = this.skipRest;
                this.updateEntityConfig(this.context.filename, 'skipRest', this.skipRest || false);
            }
        };
        return Object.assign(configuring, myCustomPostPhaseSteps);
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
