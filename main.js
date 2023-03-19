const axios = require("axios");
const request = require("request");
const cheerio = require("cheerio");


wiki_base_url = "https://en.wikipedia.org/wiki/";

async function get_http_response(url) {
  // console.log('the url i received is...', url);
  try {
    response = await axios.get(url);
    return response.data;
  } catch (error) {
    return null;
  }
}

function get_scrapped_links(html_response) {
  links = new Set();
  const $ = cheerio.load(html_response);
  link_tags = $("a");
  link_tags.each((i, link_tag) => {
    const link = $(link_tag).attr("href");
    if (link) links.add(link);
  });

  return Array.from(links);
}

async function get_links_on_page(wiki_page_name, get_wiki_http_response = get_http_response, get_wiki_scrapped_links = get_scrapped_links) {
  wiki_url = wiki_base_url + wiki_page_name;

  response = await get_wiki_http_response(wiki_url);
  if(!response) return [];

  links = get_wiki_scrapped_links(response);

  valid_links = links.reduce((valid_links, link) => {
    if (link.startsWith("/wiki/") && !link.includes(":") && !link.includes("#"))
      valid_links.push(link.replace("/wiki/", ""));
    return valid_links;
  }, []);
  return valid_links;
}

async function find_ladder(source, target, fetching_from_wiki_links = get_links_on_page) {
  if(!source || !target) return [[],0];
//   if(source === target) return  [[],1];
  queue = [[source]];
  visited = new Set();
  pagesVisited = 0;
  
  while (queue.length) {
    path = queue.splice(0, 1)[0];
    vertex = path[path.length - 1];
    if (vertex == target) {
      return [path, pagesVisited];
    } else if (!visited.has(vertex)) {
      pagesVisited += 1;
      neighbours = await fetching_from_wiki_links(vertex);
      for (idx in neighbours) {
        new_path = Array.from(path);
        new_path.push(neighbours[idx]);
        queue.push(new_path);
        if (neighbours[idx] == target) {
          return [new_path, pagesVisited];
        }
      }
      visited.add(vertex);
    }
  }
  return [[], pagesVisited];
}

// find_ladder('Emu', 'Stanford_University').then((answerArray) =>{
//     console.log(answerArray);
// });
// get_links_on_page('Node.js', get_http_response, get_scrapped_links)
module.exports = {get_links_on_page, find_ladder, get_http_response, get_scrapped_links};
