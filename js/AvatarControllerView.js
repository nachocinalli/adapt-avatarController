import Adapt from 'core/js/adapt';
import { templates } from 'core/js/reactHelpers';
import React from 'react';
import ReactDOM from 'react-dom';
class AvatarControllerView extends Backbone.View {

  className() {
    return 'avatarcontroller';
  }

  initialize(options) {
    this.avatarModel = options.avatarModel;
    this.parentView = options.parentView;
    this.render();
    this.listenTo(Adapt, 'avatar:changed', this.render);

  }

  render() {
    const avatarSelected = this.avatarModel.getSelectedItem();
    const _pose = this.model.get('_poseName');
    let avatarPose = _.isEmpty(_pose) ? avatarSelected._pose[avatarSelected._poseIndex] : this.avatarModel.getPoseByName(avatarSelected._index, _pose);

    let _autoPose = '';
    if (this.parentView.model.get('_isQuestionType')) {
      _autoPose = this.parentView.model.get('_isCorrect')
        ? 'is-correct'
        : this.parentView.model.get('_isAtLeastOneCorrectSelection') ?
          'is-partially-correct' :
          'is-incorrect';
    }
    if (this.model.get('_autoChange')) {
      avatarPose = this.avatarModel.getPoseByName(avatarSelected._index, _autoPose);
    }
    this.model.set('avatarPose', avatarPose);
    const props = { ...this.model.toJSON() };
    const Template = templates[this.constructor.template.replace('.jsx', '')];
    ReactDOM.render(<Template {...props} />, this.el);
  }

}
AvatarControllerView.template = 'avatar-controller';

export default AvatarControllerView;
