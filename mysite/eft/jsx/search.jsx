		// dummy data
		dummyData = {
			'top_10_holdings': [{
				'name': 'Anglo American plc',
				'weight': 0.95,
				'shares': 46478
			},{
				'name': 'Anglo American plc',
				'weight': 0.95,
				'shares': 46478
			},{
				'name': 'Anglo American plc',
				'weight': 0.95,
				'shares': 46478
			},{
				'name': 'Anglo American plc',
				'weight': 0.95,
				'shares': 46478
			},{
				'name': 'Anglo American plc',
				'weight': 0.95,
				'shares': 46478
			},{
				'name': 'Anglo American plc',
				'weight': 0.95,
				'shares': 46478
			},{
				'name': 'Anglo American plc',
				'weight': 0.95,
				'shares': 46478
			},{
				'name': 'Anglo American plc',
				'weight': 0.95,
				'shares': 46478
			},{
				'name': 'Anglo American plc',
				'weight': 0.95,
				'shares': 46478
			},{
				'name': 'Anglo American plc',
				'weight': 0.95,
				'shares': 46478
			}],
			'country_weights': [{
				'country': 'Japan',
				'weight': 50
			},{
				'country': 'USA',
				'weight': 50
			}],
			'sector_weights': [{
				'sector': 'Financials',
				'weight': 20
			}, {
				'sector': 'Industrials',
				'weight': 80
			}],
			'fund_description': 'this is dummy data',
			'etf_name': 'Global Dow' 
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

	search() {
		// var url = 'geteft';
		// var symbol = this.state['currentSymbol'];
		// $.ajax(url, {
		// 	'context': this,
		// 	'contentType': 'application/json',
  //       	'dataType': 'json',
  //       	'data': {'symbol': symbol}
		// }).done(function(data, textStatus, jqxhr) {
		// 	if (jqxhr.status == 200) {
		// 		this.
		// 	} else if (jqxhr.status == 400) {
		// 		showMessage('fail1');
		// 	}
		// }).fail(function() {
		// 	showMessage('fail2');
		// });

		var symbol = this.state['searchText'];
		var etf = this.state['etf'];
		if (symbol != 'DGT')  {
			showMessage('symbol not found');
			return ;
		}

		if (_.has(etf, symbol)) {
			// already there
			return ;
		}

		// search via ajax
		etf[symbol] = dummyData;
		this.setState({
			'etf': etf,
			'currentSymbol': symbol
		});
	}

	searchTextChanged(event) {
		this.setState({'searchText': event.target.value});
	}

	render() {
		var currentSymbol = this.state['currentSymbol'];
		var etf = this.state['etf'];
		var searchText = this.state['searchText'];

		var dataView = (<div>hi</div>);
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

function showMessage(msg) {
	$('#messageModalContent').html(msg);
	$('#messageModal').modal('show');
}

ReactDOM.render(
	<Search />,
	document.getElementById('searchContent')
	);