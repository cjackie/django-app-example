from bs4 import BeautifulSoup
import requests

############# utils ###########
def parse_by_symbol(symbol):
	'''
	parse the content from https://us.spdrs.com/en/product/fund.seam website.
	Strong assumptions about the html document are assumed. It is easily breakable.

	@symbol: string. 
	@return, something of this format:
	{
		'symbol': '...',
		'etf_name': '...',
		'fund_description': '...',
		'top_10_holdings': [{
			'name': '..',
			'weight': '..',
			'shares': '..'
		},],
		'country_weights': [{
			'country': '...',
			'weight': '...'
		},],
		'sector_weights': [{
			'sector': '...',
			'weight': '...'
		}],
	}

	@exception, when symbol is not fond.
	'''

	# make a HTTP request 
	params = {
	    'ticker': symbol,
	}
	cookies = {
		'InitialURL':'us.spdrs.com',
		'geoloc':'us:en', 
		'role':'def',
		'disclaimer':'accepted',
	}
	headers = {
	    'User-Agent': 'Mozilla/5.0',
	}
	response = requests.get('https://us.spdrs.com/en/product/fund.seam', 
	                        params=params, cookies=cookies, headers=headers)

	# process html text
	html = soup = BeautifulSoup(response.content, 'lxml')

	# name
	etf_name = html.select_one('h1').get_text().strip()

	# description
	objective = html.select_one('.objective')
	description = objective.select_one('p').get_text()

	# top 10 holdings
	# assume having 10 rows and 3 columns. 
	table_rows = soup.select_one('#FUND_TOP_TEN_HOLDINGS').select_one('table').find_all('tr')[1:]
	top_ten_holdings = []
	for row in table_rows:
	    cols = row.find_all('td')
	    holding = {}
	    holding['name'] = cols[0].contents[0]
	    weight = ''.join(map(lambda s: s if s != '%' else '', cols[1].contents[0])) # remove %
	    holding['weight'] = float(weight)
	    shares = ''.join(map(lambda s: s if s != ',' else '', cols[2].contents[0])) # remove,
	    holding['shares'] = int(shares)
	    top_ten_holdings.append(holding)

	# country weights
	# assume well-formatted  
	country_weights_table = None
	for tag in soup.select('.col2s'):
	    header = tag.select_one('h2')
	    if None != header and 'Fund Country Weights' == header.get_text().strip():
	        country_weights_table = tag.select_one('table')
	if None == country_weights_table:
		country_weights = []
	else: 	     
		rows = country_weights_table.select('tr')
		country_weights = []
		for row in rows:
		    cols = row.select('td')
		    country_weight = {}
		    country = cols[0].get_text().strip()
		    country_weight['country'] = country
		    weight = ''.join(map(lambda s: s if s != '%' else '', cols[1].get_text()))
		    country_weight['weight'] = float(weight)
		    country_weights.append(country_weight)

	# sector weights
	sector_weights_xml_raw = soup.select_one('#SectorsAllocChart').select('div')[1].get_text()
	sector_weights_xml = BeautifulSoup(sector_weights_xml_raw, 'lxml') 
	sector_weights = []
	for attribute in sector_weights_xml.select('attribute'):
	    sector_weight = {}
	    weight = attribute.select_one('rawvalue').get_text()
	    sector_weight['weight'] = float(weight)
	    sector = attribute.select_one('label').get_text()
	    sector_weight['sector'] = sector
	    sector_weights.append(sector_weight)

	ret = {
		'symbol': symbol,
		'etf_name': etf_name,
		'fund_description': description,
		'top_10_holdings': top_ten_holdings,
		'country_weights': country_weights,
		'sector_weights': sector_weights
	}
	return ret




