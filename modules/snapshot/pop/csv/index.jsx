var commonModal = require('client/components/modal_common/index');
var config = require('./config.json');
var request = require('../../request');
var __ = require('locale/client/admin.lang.json');
var Filter = require('../../../../components/csv_filter/index');

config.fields[0].value = 'snapshots';

function pop(obj, parent, callback) {

  var props = {
    __: __,
    parent: parent,
    config: config,
    onInitialize: function(refs) {
      refs.exp_filter.setState({
        renderer: Filter,
        fields: obj.fields
      });
    },
    onConfirm: function(refs, cb) {
      let filter = refs.exp_filter.state.value;
      let filename = refs.exp_title.state.value;
      let projectId = refs.project_id.state.value;
      let userId = refs.user_id.state.value;
      let startTime = filter.startTime;
      let endTime = filter.endTime;
      let fields = filter && filter.fields.length > 0 ? filter.fields.join(',') : '';
      let data = {
        filename: filename
      };
      if(projectId) {
        data.tenant_id = projectId;
      }
      if(userId) {
        data.user_id = userId;
      }
      if(startTime) {
        data.start_time = startTime;
      }
      if(endTime) {
        data.end_time = endTime;
      }
      if(fields) {
        data.fields = fields;
      }
      request.exportCSV(data).then((res) => {
        cb(true);
      });
    },
    onAction: function(field, state, refs) {
      let reg = /^[0-9a-zA-Z_+-.]+$/;
      switch(field) {
        case 'exp_title':
          refs.exp_title.setState({
            error: !reg.test(state.value)
          });
          break;
        case 'project_id':
          refs.project_id.setState({
            error: !reg.test(state.value)
          });
          break;
        case 'user_id':
          refs.user_id.setState({
            error: !reg.test(state.value)
          });
          break;
        default:
          return;
      }
      refs.btn.setState({
        disabled: !reg.test(state.value)
      });
    }
  };

  commonModal(props);
}

module.exports = pop;
