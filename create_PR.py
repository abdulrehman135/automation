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

    if(currentbranch == ""):
        raise "Brach not setted"

    ticket = currentbranch[-10:]
    return ticket

def get_infoFromJira(ticket):
    from jira import JIRA
    user = 'abc@trilogy.com'
    apikey = '********************'
    server = 'https://crossover.atlassian.net/'

    options = {
    'server': server
    }
    jira = JIRA(options, basic_auth=(user,apikey) )
    print(ticket)
    issue = jira.issue(ticket)
    summary = issue.fields.summary
    return (ticket, summary)

def get_path_to_image_folder():
    return "C:\Users\abdul rehman\Desktop\crossover\tickets resolved"


ticket = get_ticketName()

summary = get_infoFromJira(ticket)

g = Github("*************************")

repo = g.get_repo("abdulrehman135/automation", lazy=False)

title = ticket+ " - " + summary;
body = "**Test Case Passes**\n"
body +=  

repo.create_pull(, )



