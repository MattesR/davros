// vim: ft=groovy
properties([
    buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '3', daysToKeepStr: '', numToKeepStr: '3')),
    pipelineTriggers([[$class: 'PeriodicFolderTrigger', interval: '2d']])
])

node('cloud') {
    stage('Host Debug Information') {
        sh 'set -x && hostname && uname -a && free -h && df -h'
    }
    deleteDir()
    checkout scm
    try {
        stage('Prepare factory') {
            sh "#!/bin/bash\npython3 <(curl -sL https://github.com/liquidinvestigations/factory/raw/master/install.py) factory"
        }
        stage('Build UI') {
            sh 'factory/factory run --smp 2 --memory 2048 --share .:/mnt/davros /mnt/davros/build-production-dist.sh'
        }
        stage('Archive') {
            sh 'tar -zcvf davros-dist.tar.gz dist node_modules bower_components'
            archiveArtifacts 'davros-dist.tar.gz'
        }
    } finally {
        deleteDir()
    }
}
