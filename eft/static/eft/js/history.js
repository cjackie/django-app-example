'use strict';

class HistoryView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// list of record
			// a record is a object with keys symbol, etf_name, fund_description
			'history': undefined
		};

		// issue ajax request to get history
		var url = 'api/history';
		$.ajax(url, {
			'context': this,
			'contentType': 'application/json',
			'dataType': 'json',
			'data': {}
		}).done(function (data, textStatus, jqxhr) {
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
		}).fail(function () {
			showMessage(data['user_msg']);
		});
	}

	render() {
		var history = this.state['history'];
		if (undefined == history) {
			return React.createElement(
				'div',
				null,
				' processing '
			);
		}

		var recordRows = _.map(history, function (record) {
			return React.createElement(
				'tr',
				null,
				React.createElement(
					'td',
					null,
					record['symbol']
				),
				React.createElement(
					'td',
					null,
					record['etf_name']
				)
			);
		});

		return React.createElement(
			'div',
			{ className: 'panel panel-default' },
			React.createElement(
				'div',
				{ className: 'panel-heading' },
				React.createElement(
					'h3',
					null,
					' Search History '
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
							' Symbol '
						),
						' ',
						React.createElement(
							'td',
							null,
							' Name '
						),
						' '
					),
					recordRows
				)
			)
		);
	}
}

ReactDOM.render(React.createElement(HistoryView, null), document.getElementById('historyContent'));

