from bs4 import BeautifulSoup
import sys
import re
import requests
from flask import Flask,render_template,request
app = Flask(__name__,template_folder="templates")

@app.route('/')
def index():
 return render_template('index.html')

@app.route('/', methods=['POST','GET'])
def main():

        starting_page,target_page = get_input()
        # starting_page = "Fruit"
        # target_page  = "Strawberry"

        print('This is error output', file=sys.stderr)
        print('This is standard output', file=sys.stdout)
        list_ladder = get_links_from_wiki(f"https://en.wikipedia.org/wiki/{starting_page}")

        path = []
        path.append(f"/wiki/{starting_page}")

        while not target_found(f"/wiki/{target_page}",list_ladder) :
            print_path(path)
            if list_ladder[0] not in path:
              curr = list_ladder[0]
              print("I am current ==> ",curr,end='\n')
              path.append(curr)
              to_append_list = get_links_from_wiki(f"https://en.wikipedia.org{curr}")
              list_ladder = list_ladder + to_append_list
            list_ladder.pop(0)
        path.append(f"/wiki/{target_page}")
        print("--------------------------********************---------------------------",end='\n')
        return render_template('index.html', list_ladder = path)

# @app.route('/')
def get_input():
    start = request.form['start']
    target = request.form['target']
    return start, target

def get_links_from_wiki(start):
    response = requests.get(start)
    soup = BeautifulSoup(response.content, 'html.parser')
    return_links = []
    
    div = soup.find("div", {"class": "mw-body-content mw-content-ltr"})

    links = div.find_all("a")

    for link in links:
        href = link.get('href')
        if href and href.startswith(('/wiki')) and not 'https:' in href and not 'http' in href and not ':' in href and not '#' in href:
        #   print(href,end='\n')
          return_links.append(href)
    return return_links

def target_found(target, list_ladder):
    for page in list_ladder: 
      if page == target:
        return True
    return False

def print_path(list_path):
     for page in list_path:
       print(page,'->', end='\n')
     print("----------------------------------------------",end='\n')



if __name__ == '__main__':
    app.run(Debug=True)
    
