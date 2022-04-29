import Adapt from 'core/js/adapt';
import AvatarControllerView from './AvatarControllerView';

class AvatarController extends Backbone.Controller {

  initialize() {
    this.avatarModel = null;
    this.listenTo(Adapt, 'app:dataReady', this._onDataReady);
  }

  _onDataReady() {
    this.avatarModel = this.getAvatarModel();
    if (!this.avatarModel) return;

    this.setupEventListeners();
  }

  checkIsEnabled(model) {
    const avatarControllerModel = model.get('_avatarController');
    if (!avatarControllerModel || !avatarControllerModel._isEnabled) return false;
    return true;
  }

  getAvatarModel() {
    const avatarComponent = Adapt.components.where({ _component: 'avatar' })[0];
    if (!avatarComponent) return null;
    return avatarComponent;
  }

  setupEventListeners() {
    this.listenTo(Adapt, {
      'tutor:opened': this.onTutorOpened,
      'menuView:preRender': this.onMenuPreRender,
      'menuView:postRender': this.onMenuPostRender,
      'pageView:postRender articleView:postRender componentView:postRender blockView:postRender': this.onPostRender
    });

  }

  onTutorOpened(view) {
    const avatarControllerModel = Adapt.course.get('_avatarController')._tutor;
    if (!avatarControllerModel || !avatarControllerModel._isEnabled) return false;

    const avatarTutorController = new Backbone.Model(avatarControllerModel);
    const adaptModel = view.model;
    if (adaptModel.get('_tutor') && adaptModel.get('_tutor')._type !== 'notify') return;

    const options = { model: avatarTutorController, avatarModel: this.avatarModel, parentView: view };
    const _selector = avatarTutorController.get('_selector');
    const _notifyEl = $(".notify__popup[data-adapt-id='" + adaptModel.get('_id') + "']");
    const el = _.isEmpty(_selector) ? _notifyEl : _notifyEl.find(_selector);

    const avatarControllerView = new AvatarControllerView(options);
    el.append(avatarControllerView.el).addClass('has-avatarcontroller');
  }

  onPostRender(view) {
    const viewModel = view.model;
    if (!this.checkIsEnabled(viewModel)) return;
    const avatarControllerModel = new Backbone.Model(viewModel.get('_avatarController'));
    const options = { model: avatarControllerModel, avatarModel: this.avatarModel, parentView: view };
    const _selector = avatarControllerModel.get('_selector');
    const el = _.isEmpty(_selector) ? view.$el : view.$el.find(_selector);

    const avatarControllerView = new AvatarControllerView(options);
    el.append(avatarControllerView.el).addClass('has-avatarcontroller');
  }

  onMenuPreRender(view) {

    const avatarControllerModel = Adapt.course.get('_avatarController')._menu;
    if (!avatarControllerModel || !avatarControllerModel._isEnabled) return false;

    const avatarMenuController = new Backbone.Model(avatarControllerModel);
    if (!avatarMenuController.get('_autoChange')) return;

    const avatarPage = this.avatarModel.getAncestorModels().find(model => model.get('_type') === 'page');

    const avatarSelected = this.avatarModel.getSelectedItem();
    const _poseMenu = avatarMenuController.get('_poseName');
    const pose = _.isEmpty(_poseMenu) ? avatarSelected._pose[avatarSelected._poseIndex] : this.avatarModel.getPoseByName(avatarSelected._index, _poseMenu);
    if (!pose) return;
    avatarPage.set('_graphic', pose._graphic);

  }

  onMenuPostRender(view) {
    const avatarControllerModel = Adapt.course.get('_avatarController')._menu;
    if (!avatarControllerModel || !avatarControllerModel._isEnabled) return false;

    const avatarMenuController = new Backbone.Model(avatarControllerModel);
    const options = { model: avatarMenuController, avatarModel: this.avatarModel, parentView: view };
    const _selector = avatarMenuController.get('_selector');
    if (_.isEmpty(_selector)) return;

    const el = view.$el.find(_selector);
    const avatarControllerView = new AvatarControllerView(options);
    el.append(avatarControllerView.el).addClass('has-avatarcontroller');
  }

}

export default new AvatarController();
