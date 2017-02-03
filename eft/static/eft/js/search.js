var localColorSet = ['#B284BE', '#7CB9E8', '#F2F0E6', '#84DE02', '#C46210', '#FFBF00', '#FFBF00', '#008000', '#4B5320', '#87A96B', '#B2BEB5', '#E9D66B', '#007FFF', '#21ABCD', '#3D2B1F', '#000000', '#0018A8', '#ACE5EE', '#006A4E', '#D891EF', '#AF6E4D', '#F0DC82', '#536872', '#EFBBCC', '#FFA700'];
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
		return;
	}

	var labels = [];
	var dataset = {
		'data': [],
		'backgroundColor': []
	};
	for (var i = 0; i < countryWeights.length && i < localColorSet.length; i++) {
		var countryWeight = countryWeights[i];
		labels.push(countryWeight['country']);
		dataset['data'].push(countryWeight['weight']);
		dataset['backgroundColor'].push(localColorSet[i]);
	}
	var data = {
		'labels': labels,
		'datasets': [dataset]
	};
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
		return;
	}

	var labels = [];
	var dataset = {
		'data': [],
		'backgroundColor': []
	};
	for (var i = 0; i < sectorWeights.length && i < localColorSet.length; i++) {
		var sectorWeight = sectorWeights[i];
		labels.push(sectorWeight['sector']);
		dataset['data'].push(sectorWeight['weight']);
		dataset['backgroundColor'].push(localColorSet[i]);
	}
	var data = {
		'labels': labels,
		'datasets': [dataset]
	};
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
			'currentSymbol': '', // symbol that just searched.
			'searchText': ''
		};
	}

	componentDidUpdate() {
		// add graphs
		var currentSymbol = this.state['currentSymbol'];
		var etf = this.state['etf'];
		if (currentSymbol != '' && _.has(etf, currentSymbol)) {
			var etfData = etf[currentSymbol];
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
				'currentSymbol': symbol
			});
			return;
		}

		// search via ajax
		var url = 'api/search';
		$.ajax(url, {
			'context': this,
			'contentType': 'application/json',
			'dataType': 'json',
			'data': { 'symbol': symbol }
		}).done(function (data, textStatus, jqxhr) {
			if (jqxhr.status == 200) {
				var etf = this.state['etf'];
				etf[data['symbol']] = data;
				this.setState({
					'currentSymbol': data['symbol'],
					'etf': etf
				});
			} else if (jqxhr.status == 400) {
				if (undefined != data && undefined != data['user_msg']) {
					showMessage(data['user_msg']);
				} else {
					showMessage('unknown error');
				}
				this.setState({
					'currentSymbol': ''
				});
			} else {
				showMessage('server encountered an error');
				this.setState({
					'currentSymbol': ''
				});
			}
		}).fail(function () {
			showMessage('server encountered an error');
			this.setState({
				'currentSymbol': ''
			});
		});
	}

	searchTextChanged(event) {
		this.setState({ 'searchText': event.target.value });
	}

	render() {
		var currentSymbol = this.state['currentSymbol'];
		var etf = this.state['etf'];
		var searchText = this.state['searchText'];
		var waiting = this.state['waiting'];

		var dataView = React.createElement('div', null);
		if (currentSymbol != '' && _.has(etf, currentSymbol)) {
			var data = etf[currentSymbol];

			var nameAndDescriptionView = React.createElement(
				'div',
				{ className: 'panel panel-default' },
				React.createElement(
					'div',
					{ className: 'panel-heading' },
					React.createElement(
						'h3',
						null,
						' ',
						data['etf_name'],
						'(',
						currentSymbol,
						') '
					)
				),
				React.createElement(
					'div',
					{ className: 'panel-body' },
					data['fund_description']
				)
			);

			// holdings table
			var topTenHoldingsViewRow = _.map(data['top_10_holdings'], function (holding) {
				return React.createElement(
					'tr',
					null,
					React.createElement(
						'td',
						null,
						holding['name']
					),
					React.createElement(
						'td',
						null,
						numeral(holding['weight']).format('0,0.00')
					),
					React.createElement(
						'td',
						null,
						numeral(holding['shares']).format('0,0')
					)
				);
			});
			var topTenHoldingsView = React.createElement(
				'div',
				{ className: 'panel panel-default' },
				React.createElement(
					'div',
					{ className: 'panel-heading' },
					React.createElement(
						'h3',
						null,
						' Top 10 Holdings',
						React.createElement(
							'a',
							{ className: 'pull-right',
								href: 'download/top10holdings/' + currentSymbol, target: 'blank' },
							'Download'
						)
					)
				),
				React.createElement(
					'div',
					{ className: 'panel-body' },
					React.createElement(
						'div',
						{ className: 'container-fluid' },
						React.createElement(
							'div',
							{ className: 'col-md-4' },
							React.createElement(
								'table',
								{ className: 'table' },
								React.createElement(
									'tr',
									null,
									React.createElement(
										'td',
										null,
										' ',
										React.createElement(
											'b',
											null,
											'Name'
										),
										' '
									),
									' ',
									React.createElement(
										'td',
										null,
										' ',
										React.createElement(
											'b',
											null,
											'Weight'
										),
										' '
									),
									' ',
									React.createElement(
										'td',
										null,
										' ',
										React.createElement(
											'b',
											null,
											'shares'
										),
										' '
									)
								),
								topTenHoldingsViewRow
							)
						),
						React.createElement(
							'div',
							{ className: 'col-md-8' },
							React.createElement('canvas', { id: 'topTenHoldingsChart' })
						)
					)
				)
			);

			// country weigts table
			var countriesWeightViewRow = _.map(data['country_weights'], function (weight) {
				return React.createElement(
					'tr',
					null,
					React.createElement(
						'td',
						null,
						weight['country']
					),
					React.createElement(
						'td',
						null,
						numeral(weight['weight']).format('0,0.00'),
						'%'
					)
				);
			});
			var countriesWeightView = React.createElement(
				'div',
				{ className: 'panel panel-default' },
				React.createElement(
					'div',
					{ className: 'panel-heading ' },
					React.createElement(
						'h3',
						null,
						' Country Weight',
						React.createElement(
							'a',
							{ className: 'pull-right',
								href: 'download/countryweights/' + currentSymbol, target: 'blank' },
							'Download'
						)
					)
				),
				React.createElement(
					'div',
					{ className: 'panel-body' },
					React.createElement(
						'div',
						{ className: 'container-fluid' },
						React.createElement(
							'div',
							{ className: 'col-md-6' },
							React.createElement(
								'table',
								{ className: 'table' },
								React.createElement(
									'tr',
									null,
									React.createElement(
										'td',
										null,
										' ',
										React.createElement(
											'b',
											null,
											'Country'
										),
										' '
									),
									' ',
									React.createElement(
										'td',
										null,
										' ',
										React.createElement(
											'b',
											null,
											'Weight'
										),
										' '
									),
									' '
								),
								countriesWeightViewRow
							)
						),
						React.createElement(
							'div',
							{ className: 'col-md-6' },
							React.createElement('canvas', { id: 'countryWeightsPieChart' })
						)
					)
				)
			);

			// sector weigths table
			var sectorsWeightViewRow = _.map(data['sector_weights'], function (weight) {
				return React.createElement(
					'tr',
					null,
					React.createElement(
						'td',
						null,
						weight['sector']
					),
					React.createElement(
						'td',
						null,
						numeral(weight['weight']).format('0,0.00'),
						'%'
					)
				);
			});
			var sectorWeightView = React.createElement(
				'div',
				{ className: 'panel panel-default' },
				React.createElement(
					'div',
					{ className: 'panel-heading' },
					React.createElement(
						'h3',
						null,
						' Sector Weight',
						React.createElement(
							'a',
							{ className: 'pull-right',
								href: 'download/sectorweights/' + currentSymbol, target: 'blank' },
							'Download'
						)
					)
				),
				React.createElement(
					'div',
					{ className: 'panel-body' },
					React.createElement(
						'div',
						{ className: 'container-fluid' },
						React.createElement(
							'div',
							{ className: 'col-md-6' },
							React.createElement(
								'table',
								{ className: 'table' },
								React.createElement(
									'tr',
									null,
									React.createElement(
										'td',
										null,
										' ',
										React.createElement(
											'b',
											null,
											'Sector'
										),
										' '
									),
									' ',
									React.createElement(
										'td',
										null,
										' ',
										React.createElement(
											'b',
											null,
											'Weight'
										),
										' '
									)
								),
								sectorsWeightViewRow
							)
						),
						React.createElement(
							'div',
							{ className: 'col-md-6' },
							React.createElement('canvas', { id: 'sectorWeightsPieChart' })
						)
					)
				)
			);

			// result view
			dataView = React.createElement(
				'div',
				{ className: 'row' },
				topTenHoldingsView,
				countriesWeightView,
				sectorWeightView
			);
		}

		return React.createElement(
			'div',
			{ className: 'col-md-12' },
			React.createElement(
				'div',
				{ className: 'container-fluid' },
				React.createElement(
					'div',
					{ className: 'form-group is-empty' },
					React.createElement(
						'label',
						null,
						' ETF Ticker '
					),
					React.createElement('input', { type: 'text', className: 'form-control col-md-8',
						value: this.state['searchText'],
						onChange: this.searchTextChanged.bind(this) })
				),
				React.createElement(
					'button',
					{ className: 'btn btn-default btn-raised', onClick: this.search.bind(this) },
					'Search'
				)
			),
			dataView
		);
	}
}

ReactDOM.render(React.createElement(Search, null), document.getElementById('searchContent'));

