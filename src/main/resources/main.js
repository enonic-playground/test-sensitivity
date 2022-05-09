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
      _name: '1',
      manycase: 'smallcase',
      manyCase: 'camelCase',
      MANYCASE: 'UPPERCASE'
		};
		log.debug(`createNodeParams1:${toStr(createNodeParams1)}`);
		try {
			const createdNode1 = connection1.create(createNodeParams1);
      log.info(`createdNode1:${toStr(createdNode1)}`);
		} catch (e) {
			if (e.class.name !== 'com.enonic.xp.node.NodeAlreadyExistAtPathException') {
				log.error(`e.class.name:${toStr(e.class.name)} e.message:${toStr(e.message)}`, e);
			}
		}
    connection1.refresh();
  }); // run
} // task


libTask.submit({
	description: '',
	task
});
