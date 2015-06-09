$(function(){
    'use strict';
    /**
     * Facebookのいいね！数を取得して表示するウィジェット
     * @author Shinya Ishikawa
     */
    var likeWidgetController = {
        /**
         * コントローラ名
         */
        __name : 'jp.co.nssol.h5.sample.likewidget.LikeWidgetController',

        _isAnimated : false,

        /**
         * いいね数を管理するロジック
         */
        likeWidgetLogic : likeWidgetLogic,


        __init : function(){
           this.view.bind('#likeStatus', {
               item : this.likeWidgetLogic.getLikesItem()
           });

           this.likeWidgetLogic.updateLikes().done(this.own(function(){
               this.log.debug('textillate', this.__name);
               this.$find('#likes').textillate({in : {effect: 'fadeInRightBig'}});
               this.likeWidgetLogic.updateLikesLoop();
               this.likeWidgetLogic.getLikesModel().addEventListener('itemsChange', this.own(function(ev){
               this._ripple();
           }));
           })).fail(this.own(function(){
               this.log.debug('失敗しました', this.__name);
           }));


           this.$find('#likeme').fitText(0.8, {minFontSize: '20px', maxFontSize: '300px'});
           this.$find('#name').fitText(0.25, {minFontSize: '20px', maxFontSize: '300px'});
           this.$find('#link').fitText(1.7, {minFontSize: '12px', maxFontSize: '196px'});
           this.$find('#likes').fitText(0.2, {minFontSize: '80px', maxFontSize: '300px'});
           this.$find('#about').fitText(2.5, {minFontSize: '16px', maxFontSize: '196px'});
        },
        /**
         * コントローラの初期化が完了した時に呼ばれる処理
         */
        __ready : function(){
        },

        /*
        '#likeme click' : function(context, $el){
            this._ripple();
        },
       */

        '#link click' : function(context, $el){
            var url = $el.text();
            window.open(url, '_blank');
        },

        _ripple : function(){
            this.$find('#rippleContainer').html('');
            this.log.debug('likeme clicked', this.__name);
            var $target = $('<div class="ripple"></div>');
            
            var that = this;
            that.$find('#rippleContainer').append($('<div class="ripple"></div>'));
            setTimeout(function(){that.$find('#rippleContainer').append($('<div class="ripple"></div>'))}, 100);
            setTimeout(function(){that.$find('#rippleContainer').append($('<div class="ripple"></div>'))}, 400);
        }
    }

    h5.core.controller('#likeWidget', likeWidgetController);
});
