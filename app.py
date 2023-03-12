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
        list_ladder = get_links_from_wiki(starting_page)

        path = []
        path.append(starting_page)

        while not target_found(target_page,list_ladder) :
            print_path(path)
            if list_ladder[0] not in path:
              curr = list_ladder[0]
              print("I am current ==> ",curr,end='\n')
              path.append(curr)
              to_append_list = get_links_from_wiki(curr)
              list_ladder = list_ladder + to_append_list
            list_ladder.pop(0)
        path.append(target_page)
        print("--------------------------********************---------------------------",end='\n')
        return render_template('index.html', list_ladder = path)

# @app.route('/')
def get_input():
    start = request.form['start']
    target = request.form['target']
    return start, target

class fetch_from_wiki():
    def get_html_content(self, wiki_page):
        url = 'https://en.wikipedia.org/wiki/' + wiki_page
        response = requests.get(url)
        print("////////////////////////////////")
        print(type(response.content))
        return response.content

def get_links_from_wiki(start_word,fetch_from_wiki=fetch_from_wiki):
    # response = requests.get(start)
    wiki_object = fetch_from_wiki()
    response_html_content = wiki_object.get_html_content(start_word)

    soup = BeautifulSoup(response_html_content, 'html.parser')

    return_links = []
    
    # div = soup.find("div", {"class": "mw-body-content mw-content-ltr"})
    
    links = soup.find_all('a')

    for link in links:
        href = link.get('href')
        if href and href.startswith(('/wiki')) and not 'https:' in href and not 'http' in href and not ':' in href and not '#' in href:
        #   print(href,end='\n')
          return_links.append(href.replace('/wiki/', ''))
        # return_links.append(href)
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
    main()
    app.run(Debug=True)
    
