'use strict';

class HistoryView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// list of record
			// a record is a object with keys symbol, etf_name, fund_description
			'history': undefined,
		};

		// issue ajax request to get history
		var url = 'api/history';
		$.ajax(url, {
			'context': this,
			'contentType': 'application/json',
			'dataType': 'json',
			'data': {}
		}).done(function(data, textStatus, jqxhr) {
			if (jqxhr.status == 200) {
				this.setState({
					'history': data['records']
				});
			} else {
				if (undefined != data && undefined != data['user_msg']) {
					showMessage(data['user_msg']);
				} else {
					showMessage('failed to get search history');
				}
			}
		}).fail(function() {
			showMessage(data['user_msg']);
		})
	}

	render() {
		var history = this.state['history']
		if (undefined == history) {
			return (<div> processing </div>);
		}

		var recordRows = _.map(history, function(record) {
			return (<tr><td>{record['symbol']}</td><td>{record['etf_name']}</td></tr>)
		});

		return (<div className='panel panel-default'>
			<div className='panel-heading'>
				<h3> Search History </h3>
			</div>
			<div className='panel-body'>
				<table className='table'>
					<tr><td> Symbol </td> <td> Name </td> </tr>
					{ recordRows }
				</table>
			</div>
		</div>);
	}
}

ReactDOM.render(
	<HistoryView/>,
	document.getElementById('historyContent')
	);