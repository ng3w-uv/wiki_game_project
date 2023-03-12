from app import get_links_from_wiki

def test_get_links_from_wiki():
    class fake_fetch_from_wiki():
        def get_html_content(self, wiki_page):
            return '<a href="/wiki/Test"></a>'

    assert(get_links_from_wiki('Test', fake_fetch_from_wiki))