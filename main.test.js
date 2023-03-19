const Main = require('./main.js');
const axios = require('axios');

describe('Wikipedia fetching check', () => {
    test('successful GET request to a Wikipedia page', async () => {
      const url = 'https://en.wikipedia.org/wiki/Emu';
      const responseData = await Main.get_http_response(url);
      expect(responseData).toBeTruthy();
    });

    test('should return null on invalid url', async () => {
      result = await Main.get_http_response('not_a_valid_url');
      expect(result).toBeNull();
    });
});


describe('get links module', () => {
 
  test('empty html response', async () => {
    mock_http_response = jest.fn(x => null);
    mock_scrap_links = jest.fn();
    result = await Main.get_links_on_page('Fruit', mock_http_response, mock_scrap_links);
    expect(mock_scrap_links.mock.calls).toHaveLength(0);
    expect(result.length).toEqual(0);
  });
  
  test('empty scrapped links', async () => {
    mock_http_response = jest.fn(x => 'sample_response');
    mock_scrap_links = jest.fn(x => []);
    result = await Main.get_links_on_page('Fruit', mock_http_response, mock_scrap_links);
    expect(mock_scrap_links.mock.calls).toHaveLength(1);
    expect(result.length).toEqual(0);
  });

  test('Links Filteration', async () => {
    mock_http_response = jest.fn(x => 'sample_response');
    mock_scrap_links = jest.fn();
    mock_scrap_links.mockReturnValue(['/wiki/index', 'https://google.com/', '/wiki/ng3w', '/wiki/:temp', '/wiki/tt#t']);
    result = await Main.get_links_on_page('Fruit', mock_http_response, mock_scrap_links);
    expect(mock_scrap_links.mock.calls).toHaveLength(1);
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual('index');
    expect(result[1]).toEqual('ng3w');
  });
});


describe('find_ladder Module', () => {
  
  test('source is NULL', async () => {
    mock_fetching_from_wiki_links = jest.fn();
    result = await Main.find_ladder('','Stanford_University',mock_fetching_from_wiki_links);
    expect(mock_fetching_from_wiki_links.mock.calls).toHaveLength(0);
    expect(result).toEqual([[],0]);
  });

  test('target is NULL', async () => {
    mock_fetching_from_wiki_links = jest.fn();
    result = await Main.find_ladder('Emu','',mock_fetching_from_wiki_links);
    expect(mock_fetching_from_wiki_links.mock.calls).toHaveLength(0);
    expect(result).toEqual([[],0]);
  });

  test('both source and target are NULL', async () => {
    mock_fetching_from_wiki_links = jest.fn();
    result = await Main.find_ladder('','',mock_fetching_from_wiki_links);
    expect(mock_fetching_from_wiki_links.mock.calls).toHaveLength(0);
    expect(result).toEqual([[],0]);
  });

  test('source and target are same', async () => {
    mock_fetching_from_wiki_links = jest.fn();
    result = await Main.find_ladder('Emu','Emu',mock_fetching_from_wiki_links);
    expect(mock_fetching_from_wiki_links.mock.calls).toHaveLength(0);
    expect(result).toEqual([['Emu'],0]);
  });
/*

  x -> e,f,a,b
  e -> a,b
  f -> y 
  a -> e
  b -> x,e

  [x,e,f,a,b] -> returnsss...

  happy path -> x -> f -> y
  links visited -> 3

*/
  test('happy path', async () => {
    mock_fetching_from_wiki_links = jest.fn((i)=>{
      if(i === 'x') return ['e','f','a','b'];
      if(i === 'e') return ['a','b'];
      if(i === 'f') return ['y'];
      if(i === 'a') return ['e'];
      if(i === 'b') return ['x','e'];
    });
    result = await Main.find_ladder('x','y',mock_fetching_from_wiki_links);
    expect(mock_fetching_from_wiki_links.mock.calls).toHaveLength(3);
    expect(result).toEqual([['x','f','y'],3]);
  });
  
  test('no path exists', async () => {
    mock_fetching_from_wiki_links = jest.fn((i)=>{
      if(i === 'x') return ['e','f','a','b'];
      if(i === 'e') return ['a','b'];
      if(i === 'f') return ['b'];
      if(i === 'a') return ['f'];
      if(i === 'b') return ['x','e'];
    });
    result = await Main.find_ladder('x','y',mock_fetching_from_wiki_links);
    expect(mock_fetching_from_wiki_links.mock.calls).toHaveLength(5);
    expect(result).toEqual([[],5]);
  }); 

  test('nodes are called in correct order', async () => {
    mock_fetching_from_wiki_links = jest.fn((i)=>{
      if(i === 'x') return ['e','f','a','b'];
      if(i === 'e') return ['a','b'];
      if(i === 'f') return ['y'];
      if(i === 'a') return ['y'];
      if(i === 'b') return ['x','e'];
    });
    result = await Main.find_ladder('x','y',mock_fetching_from_wiki_links);
    expect(mock_fetching_from_wiki_links.mock.calls).toHaveLength(3);
    expect(result).toEqual([['x','f','y'],3]);
  }); 

});