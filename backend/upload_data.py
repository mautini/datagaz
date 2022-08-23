import json

import git
import shutil
import model
import config
import logging
import os

REPOSITORY_URL = 'git@github.com:mautini/datagaz.git'
REPOSITORY_PATH = 'datagaz'
FOLDER = 'data'
FILENAME = 'data.json'

if __name__ == '__main__':
    logging.info('Getting data')
    with open(config.agsi['data_filename'], 'r') as f:
        agsi_data: model.AGSIData = json.load(f)

    with open(config.entsog['data_filename'], 'r') as f:
        entsog_data: model.ENTSOGData = json.load(f)

    data = {
        'agsi_data': agsi_data,
        'entsog_data': entsog_data
    }

    logging.info('Cloning repository')
    repository = git.Repo.clone_from(REPOSITORY_URL, REPOSITORY_PATH)
    with repository.config_writer() as git_config:
        git_config.set_value('user', 'email', 'contact@datagaz.fr')
        git_config.set_value('user', 'name', 'Data Gaz Bot')

    logging.info(f'Writing {FILENAME}')
    os.makedirs(os.path.join(REPOSITORY_PATH, FOLDER), exist_ok=True)
    with open(os.path.join(REPOSITORY_PATH, FOLDER, FILENAME), 'w') as outfile:
        outfile.write(json.dumps(data))

    # If there are some change, push them
    if repository.is_dirty(untracked_files=True):
        repository.index.add([os.path.join(FOLDER, FILENAME)])
        repository.index.commit('Automatic commit: update data')
        repository.remotes.origin.push()
        logging.info('Changed pushed')
    else:
        logging.info('No changes detected, no need to commit')

    # Clean repository
    shutil.rmtree(REPOSITORY_PATH)
