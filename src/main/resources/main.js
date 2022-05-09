const libContext = require('/lib/xp/context');
const libNode = require('/lib/xp/node');
const libRepo = require('/lib/xp/repo');
const libTask = require('/lib/xp/task');
const libUtil  = require('/lib/util');


const toStr = libUtil.toStr;


const REPO_ID_1 = `${app.name}.1`;


function task() {
	libContext.run({
		repository: 'system-repo',
		branch: 'master',
		principals: ['role:system.admin']
	}, () => {
		const createRepoParams1 = {
			id: REPO_ID_1
		};
		log.debug(`createRepoParams1:${toStr(createRepoParams1)}`);
		try {
			libRepo.create(createRepoParams1);
		} catch (e) {
			if (e.class.name !== 'com.enonic.xp.repo.impl.repository.RepositoryAlreadyExistException') {
				log.error(`e.class.name:${toStr(e.class.name)} e.message:${toStr(e.message)}`, e);
			}
		}
		const connectParams1 = {
			branch: 'master',
			repoId: REPO_ID_1,
			principals: ['role:system.admin']
		};
		log.debug(`connectParams1:${toStr(connectParams1)}`);
		const connection1 = libNode.connect(connectParams1);

		try {
			connection1.delete('/1');
		} catch (e) {
			log.error(`e.class.name:${toStr(e.class.name)} e.message:${toStr(e.message)}`, e);
		}

		const createNodeParams1 = {
			_indexConfig: {
				configs: [{ // Looks like it uses the last entry and ignored the two first ones!
					config: {
						decideByType: false,
						enabled: false,
						nGram: false,
						fulltext: false,
						includeInAllText: false,
						path: false,
						indexValueProcessors: [],
						languages: []
					},
					path: 'manycase'
				},{ // Looks like it uses the last entry and ignored the two first ones!
					config: {
						decideByType: false,
						enabled: false,
						nGram: false,
						fulltext: false,
						includeInAllText: false,
						path: false,
						indexValueProcessors: [],
						languages: []
					},
					path: 'manyCase'
				},{ // Looks like it uses the last entry and ignored the two first ones!
					config: {
						decideByType: false,
						enabled: true,
						nGram: false,
						fulltext: true,
						includeInAllText: true,
						path: false,
						indexValueProcessors: [],
						languages: []
					},
					path: 'MANYCASE'
				}], // configs
				default: 'none'
			},
			_name: '1',
			manycase: 'smallcase',
			manyCase: 'camelCase',
			MANYCASE: 'UPPERCASE'
		};
		log.debug(`createNodeParams1:${toStr(createNodeParams1)}`);
		try {
			const createdNode1 = connection1.create(createNodeParams1);
			//log.info(`createdNode1:${toStr(createdNode1)}`);
		} catch (e) {
			if (e.class.name !== 'com.enonic.xp.node.NodeAlreadyExistAtPathException') {
				log.error(`e.class.name:${toStr(e.class.name)} e.message:${toStr(e.message)}`, e);
			}
		}
		connection1.refresh();

		const queryRes1 = connection1.query({
			highlight: {
				numberOfFragments: 1,
				postTag: '</b>',
				preTag: '<b>',
				properties: {
					_allText: {}, // Gets lowercased
					//_alltext: {},
					//manycase: {},
					manyCase: {}, // Gets lowercased
					MANYCASE: {} // Gets lowercased
				}
			},
			query: "fulltext('manycase,manyCase,MANYCASE,_alltext', 'smallcase')"
		});
		log.info(`queryRes1:${toStr(queryRes1)}`);

		queryRes1.hits = queryRes1.hits.map((hit) => {
			const node = connection1.get(hit.id);
			return {
				highlight: hit.highlight,
				id: hit.id,
				node: {
					manycase: node.manycase,
					manyCase: node.manyCase,
					MANYCASE: node.MANYCASE
				},
				score: hit.score
			};
		});
		log.info(`queryRes1 mapped:${toStr(queryRes1)}`);
	}); // run
} // task


libTask.submit({
	description: '',
	task
});
