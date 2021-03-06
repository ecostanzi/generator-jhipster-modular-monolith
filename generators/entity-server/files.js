/**
 * Copyright 2013-2020 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const _ = require('lodash');
const chalk = require('chalk');
const faker = require('faker');
const fs = require('fs');
const utils = require('generator-jhipster/generators/utils');
const liquibaseUtils = require('generator-jhipster/utils/liquibase');
const constants = require('generator-jhipster/generators/generator-constants');

const randexp = utils.RandexpWithFaker;
const INTERPOLATE_REGEX = constants.INTERPOLATE_REGEX;
const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
const SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
const TEST_DIR = constants.TEST_DIR;
const SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR;

const files = {
    dbChangelog: [
        {
            condition: generator => generator.databaseType === 'sql' && !generator.skipDbChangelog,
            path: SERVER_MAIN_RES_DIR,
            templates: [
                {
                    file: 'config/liquibase/changelog/added_entity.xml',
                    options: { interpolate: INTERPOLATE_REGEX },
                    renameTo: generator =>
                        `config/liquibase/changelog/${generator.lowerCaseModuleName}/` +
                        `${generator.changelogDate}_added_entity_${generator.entityClass}.xml`
                }
            ]
        },
        {
            condition: generator =>
                generator.databaseType === 'sql' &&
                !generator.skipDbChangelog &&
                (generator.fieldsContainOwnerManyToMany || generator.fieldsContainOwnerOneToOne || generator.fieldsContainManyToOne),
            path: SERVER_MAIN_RES_DIR,
            templates: [
                {
                    file: 'config/liquibase/changelog/added_entity_constraints.xml',
                    options: { interpolate: INTERPOLATE_REGEX },
                    renameTo: generator =>
                        `config/liquibase/changelog/${generator.lowerCaseModuleName}/` +
                        `${generator.changelogDate}_added_entity_constraints_${generator.entityClass}.xml`
                }
            ]
        },
        {
            condition: generator => generator.databaseType === 'cassandra' && !generator.skipDbChangelog,
            path: SERVER_MAIN_RES_DIR,
            templates: [
                {
                    file: 'config/cql/changelog/added_entity.cql',
                    renameTo: generator =>
                        `config/cql/changelog/${generator.lowerCaseModuleName}/${generator.changelogDate}` +
                        `_added_entity_${generator.entityClass}.cql`
                }
            ]
        },
        {
            condition: generator => generator.searchEngine === 'couchbase' && !generator.skipDbChangelog,
            path: SERVER_MAIN_RES_DIR,
            templates: [
                {
                    file: 'config/couchmove/changelog/entity.fts',
                    renameTo: generator =>
                        `config/couchmove/changelog/${generator.lowerCaseModuleName}/` +
                        `V${generator.changelogDate}__${generator.entityInstance.toLowerCase()}.fts`
                }
            ]
        }
    ],
    fakeData: [
        {
            condition: generator => generator.databaseType === 'sql' && !generator.skipFakeData && !generator.skipDbChangelog,
            path: SERVER_MAIN_RES_DIR,
            templates: [
                {
                    file: 'config/liquibase/fake-data/table.csv',
                    options: {
                        interpolate: INTERPOLATE_REGEX,
                        context: {
                            getRecentForLiquibase: liquibaseUtils.getRecentDateForLiquibase,
                            faker,
                            randexp
                        }
                    },
                    renameTo: generator => `config/liquibase/fake-data/${generator.lowerCaseModuleName}/${generator.entityTableName}.csv`
                }
            ]
        },
        {
            condition: generator =>
                generator.databaseType === 'sql' &&
                !generator.skipFakeData &&
                !generator.skipDbChangelog &&
                (generator.fieldsContainImageBlob === true || generator.fieldsContainBlob === true),
            path: SERVER_MAIN_RES_DIR,
            templates: [
                {
                    file: 'config/liquibase/fake-data/blob/hipster.png',
                    method: 'copy',
                    noEjs: true,
                    renameTo: generator => `config/liquibase/fake-data/${generator.lowerCaseModuleName}/blob/hipster.png`
                }
            ]
        },
        {
            condition: generator =>
                generator.databaseType === 'sql' &&
                !generator.skipFakeData &&
                !generator.skipDbChangelog &&
                generator.fieldsContainTextBlob === true,
            path: SERVER_MAIN_RES_DIR,
            templates: [
                {
                    file: 'config/liquibase/fake-data/blob/hipster.txt',
                    method: 'copy',
                    renameTo: generator => `config/liquibase/fake-data/${generator.lowerCaseModuleName}/blob/hipster.txt`
                }
            ]
        }
    ],
    server: [
        {
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/domain/Entity.java',
                    renameTo: generator => `${generator.moduleFolder}/domain/${generator.asEntity(generator.entityClass)}.java`
                }
            ]
        },
        {
            condition: generator => !generator.embedded && !generator.skipRest,
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/web/rest/EntityResource.java',
                    renameTo: generator => `${generator.moduleFolder}/web/rest/${generator.entityClass}Resource.java`
                }
            ]
        },
        {
            condition: generator => generator.jpaMetamodelFiltering,
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/service/dto/EntityCriteria.java',
                    renameTo: generator => `${generator.moduleFolder}/service/dto/${generator.entityClass}Criteria.java`
                },
                {
                    file: 'package/service/EntityQueryService.java',
                    renameTo: generator => `${generator.moduleFolder}/service/${generator.entityClass}QueryService.java`
                }
            ]
        },
        {
            condition: generator => generator.searchEngine === 'elasticsearch',
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/repository/search/EntitySearchRepository.java',
                    renameTo: generator => `${generator.moduleFolder}/repository/search/${generator.entityClass}SearchRepository.java`
                }
            ]
        },
        {
            condition: generator =>
                (!generator.reactive || !['mongodb', 'cassandra', 'couchbase', 'neo4j'].includes(generator.databaseType)) &&
                !generator.embedded,
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/repository/EntityRepository.java',
                    renameTo: generator => `${generator.moduleFolder}/repository/${generator.entityClass}Repository.java`
                }
            ]
        },
        {
            condition: generator =>
                generator.reactive &&
                ['mongodb', 'cassandra', 'couchbase', 'neo4j'].includes(generator.databaseType) &&
                !generator.embedded,
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/repository/EntityReactiveRepository.java',
                    renameTo: generator => `${generator.moduleFolder}/repository/${generator.entityClass}Repository.java`
                }
            ]
        },
        {
            condition: generator => generator.service === 'serviceImpl' && !generator.embedded,
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/service/EntityService.java',
                    renameTo: generator => `${generator.moduleFolder}/service/${generator.entityClass}Service.java`
                },
                {
                    file: 'package/service/impl/EntityServiceImpl.java',
                    renameTo: generator => `${generator.moduleFolder}/service/impl/${generator.entityClass}ServiceImpl.java`
                }
            ]
        },
        {
            condition: generator => generator.service === 'serviceClass' && !generator.embedded,
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/service/impl/EntityServiceImpl.java',
                    renameTo: generator => `${generator.moduleFolder}/service/${generator.entityClass}Service.java`
                }
            ]
        },
        {
            condition: generator => generator.dto === 'mapstruct',
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/service/dto/EntityDTO.java',
                    renameTo: generator => `${generator.moduleFolder}/service/dto/${generator.asDto(generator.entityClass)}.java`
                },
                {
                    file: 'package/service/mapper/BaseEntityMapper.java',
                    renameTo: generator => `${generator.moduleFolder}/service/mapper/EntityMapper.java`
                },
                {
                    file: 'package/service/mapper/EntityMapper.java',
                    renameTo: generator => `${generator.moduleFolder}/service/mapper/${generator.entityClass}Mapper.java`
                }
            ]
        }
    ],
    test: [
        {
            condition: generator => !generator.embedded && !generator.skipRest,
            path: SERVER_TEST_SRC_DIR,
            templates: [
                {
                    file: 'package/web/rest/EntityResourceIT.java',
                    options: {
                        context: {
                            randexp,
                            _,
                            chalkRed: chalk.red,
                            fs,
                            SERVER_TEST_SRC_DIR
                        }
                    },
                    renameTo: generator => `${generator.moduleFolder}/web/rest/${generator.entityClass}ResourceIT.java`
                }
            ]
        },
        {
            condition: generator => generator.searchEngine === 'elasticsearch',
            path: SERVER_TEST_SRC_DIR,
            templates: [
                {
                    file: 'package/repository/search/EntitySearchRepositoryMockConfiguration.java',
                    renameTo: generator =>
                        `${generator.moduleFolder}//repository/search/${generator.entityClass}SearchRepositoryMockConfiguration.java`
                }
            ]
        },
        {
            condition: generator => generator.gatlingTests,
            path: TEST_DIR,
            templates: [
                {
                    file: 'gatling/user-files/simulations/EntityGatlingTest.scala',
                    options: { interpolate: INTERPOLATE_REGEX },
                    renameTo: generator => `gatling/user-files/simulations/${generator.entityClass}GatlingTest.scala`
                }
            ]
        },
        {
            path: SERVER_TEST_SRC_DIR,
            templates: [
                {
                    file: 'package/domain/EntityTest.java',
                    renameTo: generator => `${generator.moduleFolder}/domain/${generator.entityClass}Test.java`
                }
            ]
        },
        {
            condition: generator => generator.dto === 'mapstruct',
            path: SERVER_TEST_SRC_DIR,
            templates: [
                {
                    file: 'package/service/dto/EntityDTOTest.java',
                    renameTo: generator => `${generator.moduleFolder}/service/dto/${generator.asDto(generator.entityClass)}Test.java`
                }
            ]
        },
        {
            condition: generator =>
                generator.dto === 'mapstruct' && ['sql', 'mongodb', 'couchbase', 'neo4j'].includes(generator.databaseType),
            path: SERVER_TEST_SRC_DIR,
            templates: [
                {
                    file: 'package/service/mapper/EntityMapperTest.java',
                    renameTo: generator => `${generator.moduleFolder}/service/mapper/${generator.entityClass}MapperTest.java`
                }
            ]
        }
    ]
};

const customServerFiles = {
    dbConfiguration: [
        {
            condition: generator =>
                generator.databaseType === 'sql' ||
                generator.databaseType === 'mongodb' ||
                generator.databaseType === 'neo4j' ||
                generator.databaseType === 'couchbase',
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/config/ModuleDatabaseConfiguration.java',
                    renameTo: generator => `${generator.moduleFolder}/config/${generator.capitalizedModuleName}DatabaseConfiguration.java`
                }
            ]
        }
    ]
};
const writeFiles = {
    saveRemoteEntityPath() {
        if (_.isUndefined(this.microservicePath)) {
            return;
        }
        this.copy(
            `${this.microservicePath}/${this.jhipsterConfigDirectory}/${this.entityNameCapitalized}.json`,
            this.destinationPath(`${this.jhipsterConfigDirectory}/${this.entityNameCapitalized}.json`)
        );
    },

    setupReproducibility() {
        if (this.skipServer) return;

        // In order to have consistent results with Faker, restart seed with current entity name hash.
        faker.seed(utils.stringHashCode(this.name.toLowerCase()));
    },

    writeModuleConfigFiles() {
        if (this.skipServer) return;
        this.writeFilesToDisk(customServerFiles, this, false);
    },

    writeServerFiles() {
        if (this.skipServer) return;

        // parse the templates and write files to the appropriate locations
        const entityFiles = this.writeFilesToDisk(files, this, false, this.fetchFromInstalledJHipster('entity-server/templates'));

        entityFiles.forEach(file => {
            if (file.endsWith('.xml')) {
                utils.replaceContent(
                    {
                        file,
                        pattern: new RegExp('fake-data', 'g'),
                        content: `fake-data/${this.lowerCaseModuleName}`
                    },
                    this
                );
            } else if (file.endsWith('.java')) {
                utils.replaceContent(
                    {
                        file,
                        pattern: new RegExp('import org.junit.jupiter.api.BeforeEach;', 'g'),
                        content: `import ${this.packageName}.web.rest.TestUtil;\nimport org.junit.jupiter.api.BeforeEach;`
                    },
                    this
                );

                utils.replaceContent(
                    {
                        file,
                        pattern: new RegExp(`package ${this.packageName}`, 'g'),
                        content: `package ${this.modulePackageName}`
                    },
                    this
                );

                utils.replaceContent(
                    {
                        file,
                        pattern: new RegExp(`import ${this.packageName}.enumeration`, 'g'),
                        content: `import ${this.modulePackageName}.enumeration`
                    },
                    this
                );
                utils.replaceContent(
                    {
                        file,
                        pattern: new RegExp(`@link ${this.packageName}.web.rest`, 'g'),
                        content: `@link ${this.modulePackageName}.web.rest`
                    },
                    this
                );
                utils.replaceContent(
                    {
                        file,
                        pattern: new RegExp(`import ${this.packageName}.domain`, 'g'),
                        content: `import ${this.modulePackageName}.domain`
                    },
                    this
                );
                utils.replaceContent(
                    {
                        file,
                        pattern: new RegExp(`@link ${this.packageName}.domain`, 'g'),
                        content: `@link ${this.modulePackageName}.domain`
                    },
                    this
                );
                utils.replaceContent(
                    {
                        file,
                        pattern: new RegExp(`import ${this.packageName}.repository`, 'g'),
                        content: `import ${this.modulePackageName}.repository`
                    },
                    this
                );
                utils.replaceContent(
                    {
                        file,
                        pattern: new RegExp(`import ${this.packageName}.service`, 'g'),
                        content: `import ${this.modulePackageName}.service`
                    },
                    this
                );
            }
        });
        if (this.databaseType === 'sql') {
            if (!this.skipDbChangelog) {
                if (this.fieldsContainOwnerManyToMany || this.fieldsContainOwnerOneToOne || this.fieldsContainManyToOne) {
                    this.addConstraintsChangelogToLiquibase(
                        `${this.lowerCaseModuleName}/${this.changelogDate}_added_entity_constraints_${this.entityClass}`
                    );
                }
                this.addChangelogToLiquibase(`${this.lowerCaseModuleName}/${this.changelogDate}_added_entity_${this.entityClass}`);
            }

            if (['ehcache', 'caffeine', 'infinispan', 'redis'].includes(this.cacheProvider) && this.enableHibernateCache) {
                this.addEntityToCache(
                    this.asEntity(this.entityClass),
                    this.relationships,
                    this.modulePackageName,
                    this.packageFolder,
                    this.cacheProvider
                );
            }
        }
    },

    writeEnumFiles() {
        this.fields.forEach(field => {
            if (!field.fieldIsEnum) {
                return;
            }
            const fieldType = field.fieldType;
            const enumInfo = {
                ...utils.getEnumInfo(field, this.clientRootFolder),
                angularAppName: this.angularAppName,
                packageName: `${this.modulePackageName}`
            };
            // eslint-disable-next-line no-console
            if (!this.skipServer) {
                const pathToTemplateFile = `${this.fetchFromInstalledJHipster(
                    'entity-server/templates'
                )}/${SERVER_MAIN_SRC_DIR}package/domain/enumeration/Enum.java.ejs`;
                this.template(
                    pathToTemplateFile,
                    `${SERVER_MAIN_SRC_DIR}${this.moduleFolder}/domain/enumeration/${fieldType}.java`,
                    this,
                    {},
                    enumInfo
                );
            }
        });
    }
};

module.exports = {
    writeFiles
};
