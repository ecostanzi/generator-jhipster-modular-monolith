const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const constants = require('generator-jhipster/generators/generator-constants');

const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
const SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;

describe('Subgenerator entity-server of modular-monolith JHipster blueprint', () => {
    describe('Test SQL JPA monolith', () => {
        before(done => {
            helpers
                .run('generator-jhipster/generators/entity')
                .inTmpDir(dir => {
                    fse.copySync(path.join(__dirname, '../test/templates/default'), dir);
                })
                .withOptions({
                    'from-cli': true,
                    skipInstall: true,
                    blueprint: 'modular-monolith',
                    skipChecks: true
                })
                .withGenerators([
                    [
                        require('../generators/entity'), // eslint-disable-line global-require
                        'jhipster-modular-monolith:entity',
                        path.join(__dirname, '../generators/entity/index.js')
                    ],
                    [
                        require('../generators/entity-server'), // eslint-disable-line global-require
                        'jhipster-modular-monolith:entity-server',
                        path.join(__dirname, '../generators/entity-server/index.js')
                    ]
                ])
                .withArguments(['foo'])
                .withPrompts({
                    moduleName: 'mymodule',
                    useModule: true,
                    fieldAdd: false,
                    relationshipAdd: false,
                    dto: 'mapstruct',
                    service: 'serviceImpl',
                    pagination: 'paginate',
                    filtering: 'jpaMetamodel'
                })
                .on('end', done);
        });

        it('writes module name into entity json', () => {
            assert.JSONFileContent('.jhipster/Foo.json', { module: 'mymodule' });
        });

        it('it does NOT generates java entity files in the default package', () => {
            assert.noFile([
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/domain/Foo.java`,
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/web/rest/FooResource.java`,
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/service/FooService.java`,
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/service/FooQueryService.java`,
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/service/mapper/FooMapper.java`,
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/service/dto/FooDTO.java`,
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/service/impl/FooServiceImpl.java`,
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/repository/FooRepository.java`
            ]);
        });

        it('it generates java entity files in the module package', () => {
            assert.file([
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/modules/mymodule/domain/Foo.java`,
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/modules/mymodule/web/rest/FooResource.java`,
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/modules/mymodule/service/FooService.java`,
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/modules/mymodule/service/FooQueryService.java`,
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/modules/mymodule/service/mapper/FooMapper.java`,
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/modules/mymodule/service/dto/FooDTO.java`,
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/modules/mymodule/service/impl/FooServiceImpl.java`,
                `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/modules/mymodule/repository/FooRepository.java`
            ]);
        });

        it('generates module configuration files', () => {
            assert.file([`${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/modules/mymodule/config/MymoduleDatabaseConfiguration.java`]);
        });

        it('it generates changelog files into a module folder', () => {
            assert.file([`${SERVER_MAIN_RES_DIR}config/liquibase/changelog/mymodule/20201228174246_added_entity_Foo.xml`]);
            assert.file([`${SERVER_MAIN_RES_DIR}config/liquibase/fake-data/mymodule/foo.csv`]);
        });
    });

    describe('Test SQL JPA monolith skip REST', () => {
        before(done => {
            helpers
                .run('generator-jhipster/generators/entity')
                .inTmpDir(dir => {
                    fse.copySync(path.join(__dirname, '../test/templates/default'), dir);
                })
                .withOptions({
                    'from-cli': true,
                    skipInstall: true,
                    blueprint: 'modular-monolith',
                    skipChecks: true
                })
                .withGenerators([
                    [
                        require('../generators/entity'), // eslint-disable-line global-require
                        'jhipster-modular-monolith:entity',
                        path.join(__dirname, '../generators/entity/index.js')
                    ],
                    [
                        require('../generators/entity-server'), // eslint-disable-line global-require
                        'jhipster-modular-monolith:entity-server',
                        path.join(__dirname, '../generators/entity-server/index.js')
                    ]
                ])
                .withArguments(['foo'])
                .withPrompts({
                    moduleName: 'mymodule',
                    useModule: true,
                    fieldAdd: false,
                    relationshipAdd: false,
                    dto: 'mapstruct',
                    service: 'serviceImpl',
                    pagination: 'paginate',
                    filtering: 'jpaMetamodel',
                    skipRest: true
                })
                .on('end', done);
        });

        it('writes skipRest flag into entity json', () => {
            assert.JSONFileContent('.jhipster/Foo.json', { skipRest: true });
        });

        it('it does NOT generate rest controller in the default package', () => {
            assert.noFile([`${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/web/rest/FooResource.java`]);
        });

        it('it does NOT generate rest controller files in the module package', () => {
            assert.noFile([`${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/modules/mymodule/web/rest/FooResource.java`]);
        });
    });
});
