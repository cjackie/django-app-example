var localColorSet = ['#B284BE', '#7CB9E8', '#F2F0E6', '#84DE02', '#C46210',
						'#FFBF00', '#FFBF00', '#008000', '#4B5320', '#87A96B',
						'#B2BEB5', '#E9D66B', '#007FFF', '#21ABCD', '#3D2B1F',
						'#000000', '#0018A8', '#ACE5EE', '#006A4E', '#D891EF',
						'#AF6E4D', '#F0DC82', '#536872', '#EFBBCC', '#FFA700'];
function makeTopTenHoldingsChart(id, records) {
	window.records = records;

	var data = {};
	data['labels'] = [];
	data['datasets'] = [];
	data['datasets'].push({
		'label': 'Top 10 Holdings',
		'backgroundColor': [],
		'data': []
	});
	for (var i = 0; i < records.length && i < localColorSet.length; i++) {
		var record = records[i];
		data['labels'].push(record['name']);
		data['datasets'][0]['backgroundColor'].push(localColorSet[i]);
		data['datasets'][0]['data'].push(record['shares']);
	}

	var options = {};
	var config = {
		'type': 'bar',
		'data': data,
		'options': options
	};

	var barChart = new Chart(document.getElementById(id), config);
}

function makeCountryWeightsPieChart(id, countryWeights) {
	if (countryWeights.length == 0) {
		return ;
	}

	var labels = []
	var dataset = {
		'data': [],
		'backgroundColor': [],
	}
	for (var i = 0; i < countryWeights.length && i < localColorSet.length; i++) {
		var countryWeight = countryWeights[i];
		labels.push(countryWeight['country']);
		dataset['data'].push(countryWeight['weight']);
		dataset['backgroundColor'].push(localColorSet[i]);
	}
	var data = {
		'labels': labels,
		'datasets': [
			dataset,
		]
	}
	var options = {};
	var config = {
		'type': 'pie',
		'data': data,
		'options': options
	};

	var pieChart = new Chart(document.getElementById(id), config); 
}

function makeSectorWeightsPieChart(id, sectorWeights) {
	if (sectorWeights.length == 0) {
		return ;
	}
	
	var labels = []
	var dataset = {
		'data': [],
		'backgroundColor': [],
	}
	for (var i = 0; i < sectorWeights.length && i < localColorSet.length; i++) {
		var sectorWeight = sectorWeights[i];
		labels.push(sectorWeight['sector']);
		dataset['data'].push(sectorWeight['weight']);
		dataset['backgroundColor'].push(localColorSet[i]);
	}
	var data = {
		'labels': labels,
		'datasets': [
			dataset,
		]
	}
	var options = {};
	var config = {
		'type': 'pie',
		'data': data,
		'options': options
	};

	var pieChart = new Chart(document.getElementById(id), config); 
}

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			'etf': {}, // map of symbol => data,
			'currentSymbol' : '', // symbol that just searched.
			'searchText': '',
		};

	}

	componentDidUpdate() {
		// add graphs
		var currentSymbol = this.state['currentSymbol'];
		var etf = this.state['etf'];
		if (currentSymbol != '' && _.has(etf, currentSymbol)) {
			var etfData = etf[currentSymbol]
			makeTopTenHoldingsChart('topTenHoldingsChart', etfData['top_10_holdings']);
			makeCountryWeightsPieChart('countryWeightsPieChart', etfData['country_weights']);
			makeSectorWeightsPieChart('sectorWeightsPieChart', etfData['sector_weights']);
		}
	}

	search() {
		var symbol = this.state['searchText'].trim();
		var etf = this.state['etf'];

		if (_.has(etf, symbol)) {
			this.setState({
				'currentSymbol': symbol,
			});
			return ;
		}

		// search via ajax
		var url = 'api/search';
		$.ajax(url, {
			'context': this,
			'contentType': 'application/json',
        	'dataType': 'json',
        	'data': {'symbol': symbol}
		}).done(function(data, textStatus, jqxhr) {
			if (jqxhr.status == 200) {
				var etf = this.state['etf'];
				etf[data['symbol']] = data;
				this.setState({
					'currentSymbol': data['symbol'],
					'etf': etf,
				});
			} else if (jqxhr.status == 400) {
				if (undefined != data && undefined != data['user_msg']) {
					showMessage(data['user_msg']);
				} else {
					showMessage('unknown error');
				}
				this.setState({
					'currentSymbol': '',
				});
			} else {
				showMessage('server encountered an error');
				this.setState({
					'currentSymbol': '',
				});
			}
		}).fail(function() {
			showMessage('server encountered an error');
			this.setState({
				'currentSymbol': '',
			});
		});
	}

	searchTextChanged(event) {
		this.setState({'searchText': event.target.value});
	}

	render() {
		var currentSymbol = this.state['currentSymbol'];
		var etf = this.state['etf'];
		var searchText = this.state['searchText'];
		var waiting = this.state['waiting'];

		var dataView = (<div></div>);
		if (currentSymbol != '' && _.has(etf, currentSymbol)) {
			var data = etf[currentSymbol];
			
			var nameAndDescriptionView = (
				<div className='panel panel-default'>
					<div className='panel-heading'>
						<h3> {data['etf_name']}({currentSymbol}) </h3>
					</div>
					<div className='panel-body'>
						{data['fund_description']}
					</div>
				</div>);

			// holdings table
			var topTenHoldingsViewRow = _.map(data['top_10_holdings'], function(holding) {
				return (
					<tr>
						<td>{holding['name']}</td>
						<td>{holding['weight']}</td>
						<td>{holding['shares']}</td>
					</tr>
					)
			});
			var topTenHoldingsView = (
				<div className='panel panel-default'>
					<div className='panel-heading'>
						<h3> Top 10 Holdings </h3>
					</div>
					<div className='panel-body'>
						<table className='table'>
							<tr><td> Name </td> <td> weight </td> <td> shares </td></tr>
							{ topTenHoldingsViewRow }
						</table>
						<div className='col-md-8 block-center'>
							<canvas id="topTenHoldingsChart"></canvas>
						</div>
					</div>
				</div>
				);

			// country weigts table
			var countriesWeightViewRow = _.map(data['country_weights'], function(weight) {
				return (
					<tr>
						<td>{weight['country']}</td>
						<td>{weight['weight']}%</td>
					</tr>
					)
			});
			var countriesWeightView = (
				<div className='panel panel-default'>
					<div className='panel-heading'>
						<h3> Country Weight </h3>
					</div>
					<div className='panel-body'>
						<table className='table'>
							<tr><td> Country </td> <td> Weight </td> </tr>
							{ countriesWeightViewRow }
						</table>
						<div className='col-md-8 block-center'>
							<canvas id="countryWeightsPieChart"></canvas>
						</div>
					</div>
				</div>
				);

			// sector weigths table
			var sectorsWeightViewRow = _.map(data['sector_weights'], function(weight) {
				return (
					<tr>
						<td>{weight['sector']}</td>
						<td>{weight['weight']}%</td>
					</tr>
					)
			});
			var sectorWeightView = (
				<div className='panel panel-default'>
					<div className='panel-heading'>
						<h3> Sector Weight </h3>
					</div>
					<div className='panel-body'>
						<table className='table'>
							<tr><td> Sector </td> <td> Weight </td> </tr>
							{ sectorsWeightViewRow }
						</table>
						<div className='col-md-8 block-center'>
							<canvas id="sectorWeightsPieChart"></canvas>
						</div>
					</div>
				</div>
				);

			// result view
			dataView = (
				<div className='row'>
					{topTenHoldingsView}
					{countriesWeightView}
					{sectorWeightView}
				</div>
				);
			
		}

    	return (
    		<div className='col-md-12'>
	    		<div className='container-fluid'>
	    			<div className='form-group is-empty'>
	    				<label> ETF Ticker </label>
	                    <input type='text' className='form-control col-md-8'
	                    		value={this.state['searchText']}
	                    		onChange={this.searchTextChanged.bind(this)}/>
	                </div>
	                <button className='btn btn-default btn-raised' onClick={this.search.bind(this)}>Search</button>              	
	    		</div>
	    		{dataView}
    		</div>
    		);
  	}
}

ReactDOM.render(
	<Search />,
	document.getElementById('searchContent')
	);