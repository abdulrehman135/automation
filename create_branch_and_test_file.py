import os


def get_ticketName():
    s = input("Ticket Name: ")
    return s


def get_infoFromJira(ticket):
    from jira import JIRA
    user = 'abc@trilogy.com'
    apikey = '***************'
    server = 'https://crossover.atlassian.net/'

    options = {
    'server': server
    }
    jira = JIRA(options, basic_auth=(user,apikey) )
    print(ticket)
    issue = jira.issue(ticket)
    summary = issue.fields.summary
    return  summary
def ensure_dir(file_path):
    directory = os.path.dirname(file_path)
    if not os.path.exists(directory):
        os.makedirs(directory)

ticket = get_ticketName()

summary = get_infoFromJira(ticket)

os.system("git branch feature/" + ticket)
os.system("git checkout feature/" + ticket)
filePath = summary.split(' ')[-1];
filePath_parts = filePath.split('/')

startIndex = 0
index = 0
for part in filePath_parts:
    index += 1
    if(part == "beckon"):
        startIndex = index
        break;
parts = filePath_parts[startIndex:]
filePath = '/'.join(parts)
filePath = "src/test/javascript/unit/" + filePath
filePath = "./" + filePath[:-3] + "Spec.js"
ensure_dir(filePath)
f= open(filePath,"w")
f.close();
print filePath

