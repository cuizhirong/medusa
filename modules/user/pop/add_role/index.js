const commonModal = require('client/components/modal_common/index');
const config = require('./config.json');
const request = require('../../request');
const __ = require('locale/client/admin.lang.json');
const getErrorMessage = require('client/applications/admin/utils/error_message');

function pop(type, obj, parent, callback) {
  config.fields[0].text = obj.name;
  if (type === 'domain') {
    config.fields[1].hide = false;
    config.fields[2].hide = true;
  } else {
    config.fields[1].hide = true;
    config.fields[2].hide = false;
  }

  let props = {
    __: __,
    parent: parent,
    config: config,
    onInitialize: function(refs) {
      let roleError = () => {
        refs.role.setState({
          hide: false
        });
        refs.btn.setState({
          disabled: false
        });
      };

      request.getRoles().then((res) => {
        if (res.length > 0) {
          refs.role.setState({
            data: res,
            value: res[0].id,
            hide: false
          });
          refs.btn.setState({
            disabled: false
          });
        } else {
          roleError();
        }
      }).catch((error) => {
        roleError();
      });
    },
    onConfirm: function(refs, cb) {
      request.addRole(type, obj, refs.role.state.value, refs[type].state.value).then((res) => {
        callback && callback(res);
        cb(true);
      }).catch((error) => {
        cb(false, getErrorMessage(error));
      });
    },
    onAction: function(field, status, refs) {}
  };

  commonModal(props);
}

module.exports = pop;
