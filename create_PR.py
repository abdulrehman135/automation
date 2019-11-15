import os
import sys
from github import Github


def get_ticketName():
    out = os.popen('git branch').read()
    branches = out.split('\n')
    currentbranch = ""
    for branch in branches:
        if(branch.find("*") > -1):
            currentbranch = branch

    if(currentbranch == "master" or currentbranch == ""):
        raise "Brach not setted"

    ticket = currentbranch[-10:]
    return ticket

def get_infoFromJira(ticket):
    from jira import JIRA
    user = 'abdul.mirza@trilogy.com'
    apikey = 'duPpBsVDKl26pigN30BU3559'
    server = 'https://crossover.atlassian.net/'

    options = {
    'server': server
    }
    jira = JIRA(options, basic_auth=(user,apikey) )
    print(ticket)
    issue = jira.issue(ticket)
    summary = issue.fields.summary
    return (ticket, summary)


ticket = get_ticketName()

summary = get_infoFromJira(ticket)

g = Github("689f3e24afe3f6d71986c8d805ebd69fa00b589a")

repo = g.get_repo("abdulrehman135/automation", lazy=False)
repo.create_pull

