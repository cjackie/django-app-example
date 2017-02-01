

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			'etf': {}, // map of symbol => data,
			'currentSymbol': '', // symbol that just searched.
			'searchText': ''
		};
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
				showMessage('fail1');
				this.setState({
					'currentSymbol': ''
				});
			} else {
				showMessage('fail2');
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
						holding['weight']
					),
					React.createElement(
						'td',
						null,
						holding['shares']
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
						' Top 10 Holdings '
					)
				),
				React.createElement(
					'div',
					{ className: 'panel-body' },
					React.createElement(
						'table',
						{ className: 'table' },
						React.createElement(
							'tr',
							null,
							React.createElement(
								'td',
								null,
								' Name '
							),
							' ',
							React.createElement(
								'td',
								null,
								' weight '
							),
							' ',
							React.createElement(
								'td',
								null,
								' shares '
							)
						),
						topTenHoldingsViewRow
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
						weight['weight'],
						'%'
					)
				);
			});
			var countriesWeightView = React.createElement(
				'div',
				{ className: 'panel panel-default' },
				React.createElement(
					'div',
					{ className: 'panel-heading' },
					React.createElement(
						'h3',
						null,
						' Country Weight '
					)
				),
				React.createElement(
					'div',
					{ className: 'panel-body' },
					React.createElement(
						'table',
						{ className: 'table' },
						React.createElement(
							'tr',
							null,
							React.createElement(
								'td',
								null,
								' Country '
							),
							' ',
							React.createElement(
								'td',
								null,
								' Weight '
							),
							' '
						),
						countriesWeightViewRow
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
						weight['weight'],
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
						' Sector Weight '
					)
				),
				React.createElement(
					'div',
					{ className: 'panel-body' },
					React.createElement(
						'table',
						{ className: 'table' },
						React.createElement(
							'tr',
							null,
							React.createElement(
								'td',
								null,
								' Sector '
							),
							' ',
							React.createElement(
								'td',
								null,
								' Weight '
							),
							' '
						),
						sectorsWeightViewRow
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

function showMessage(msg) {
	$('#messageModalContent').html(msg);
	$('#messageModal').modal('show');
}

ReactDOM.render(React.createElement(Search, null), document.getElementById('searchContent'));

