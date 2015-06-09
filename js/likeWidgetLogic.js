/**
 * Facebookのいいね！数を取得するロジック
 */
var likeWidgetLogic = {
    /**
     * ロジック名（必須）
     */
    __name : 'jp.co.nssol.h5.sample.likewidget.LikeWidgetLogic',

    /**
     * 対象ページURL
     */
    _pageUrl : 'https://graph.facebook.com/https://www.facebook.com/htmlhifive?access_token=834087339979528|WFvMP_ng3CIEhxJ14XLcRdZYrwc',
    //_pageUrl : 'https://graph.facebook.com/https://www.facebook.com/lego.titech?access_token=834087339979528|WFvMP_ng3CIEhxJ14XLcRdZYrwc',
    //_pageUrl : 'hifivepage_dummy.json',

    /**
     * いいね数を保持するモデル（シングルトン）
     */
    _model : null,

    /**
     * いいね数を保持するアイテム（シングルトン）
     */
    _item : null,

    /**
     * いいね数を同期中かどうかのフラグ
     */
    _onSynced : true,

    /**
     * いいね数を格納するデータモデルを返す
     */
    getLikesModel : function(){
        if(this._model == null){
            var manager = h5.core.data.createManager('LikeManager');
            this._model = manager.createModel({
                name: 'SampleModel',
                schema: {
                    id: {
                        id: true
                    },
                    likes: {
                        type: 'integer',
                        defaultValue: 0
                    },
                    link : {
                        type: 'string'
                    },
                    name : {
                        type : 'string'
                    },
                    about :{
                        type : 'string'
                    }
                }
            });

        }
            return this._model;
    },

    /**
     * いいね数を格納するデータアイテムを返す
     */
    getLikesItem : function() {
        if(this._item == null){
            // いいね数を格納するデータモデルを作って返す
            var model = this.getLikesModel();
            model.addEventListener('itemsChange', this.own(function(ev){
                this.log.debug('itemsChange:', this.__name);
                this.log.debug(ev);
            }));
            this._item = model.create({
                id : '001',
                likes : null,
                link : null,
                name : null,
                about : null
            });
        }
        return this._item;
    },

    /**
     * いいね数を更新する
     */
    updateLikes : function(){
        if(this._onSynced){
            return h5.ajax(this._pageUrl,
                           {
                               'content-Type' : 'application/json; charset=UTF-8',
                               'success' : this.own(function(data){
                               this.getLikesItem().set({
                                   'likes' : data.likes,
                                   'link' : data.link,
                                   'name' : data.name,
                                   'about' : data.about
                               });
                               this.log.debug('likes updated');
                           })});
        } else {
            return this.deferred.reject('いいね数は同期中ではありません').promise();
        }
    },

    updateLikesLoop : function(){
        this.log.debug('loop', this.__name);
        var that = this;
        setTimeout(function(){
            that.updateLikesLoop();
            that.updateLikes();
        }, 2000);
    }
}
