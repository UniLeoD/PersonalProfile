//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield:egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {
        
        var Ps = new egret.DisplayObjectContainer();
        var FP = new egret.DisplayObjectContainer();
        var SP = new egret.DisplayObjectContainer();
        this.addChild(Ps);
        Ps.addChild(FP);
        Ps.addChild(SP);
        SP.y = 1136;
       
        var sky:egret.Bitmap = this.createBitmapByName("FP_JPG");
        FP.addChild(sky);
        
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

       //框框
        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.3);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        var topMask2 = new egret.Shape();
        topMask2.graphics.beginFill(0x000000, 0.6);
        topMask2.graphics.drawRect(60, 0, 30, 1136);
        topMask2.graphics.endFill();
        topMask.y = 33;
        topMask2.y = 33;
        FP.addChild(topMask);
        FP.addChild(topMask2);

        var icon:egret.Bitmap = this.createBitmapByName("egret_icon_png");
        FP.addChild(icon);
        icon.x = 102;
        icon.y = 33;

        var line = new egret.Shape();
        line.graphics.lineStyle(2,0xffffff);
        line.graphics.moveTo(0,0);//左偏
        line.graphics.lineTo(0,117);//右偏
        line.graphics.endFill();
        line.x = 232;
        line.y = 61;
        FP.addChild(line);


        var tween = egret.Tween.get(icon);
        tween.to({x:500},2500).to({y:400},3000).call(function(){
          //  alert('hhhh')
        },this).to({x:102,y:400},2500)
        tween.to({y:33},3000)

      //  icon.touchEnabled = true;
      //  icon.addEventListener(egret.TouchEvent.TOUCH_BEGIN,())
     

        var colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "个人简介";
        colorLabel.fontFamily = "SimHei";
         //设置粗体与斜体
        colorLabel.bold = true;
        colorLabel.size = 40;
        colorLabel.x = 172;
        colorLabel.y = 80;
        FP.addChild(colorLabel);

        var textfield = new egret.TextField();
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.fontFamily = "KaiTi";
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.verticalAlign = egret.VerticalAlign.MIDDLE;
        //设置描边属性
        textfield.strokeColor = 0x7a7a7a;
        textfield.stroke = 2;
        textfield.size = 30;
        textfield.textColor = 0xffffff;
        textfield.x = 174;
        textfield.y = 135;
        this.textfield = textfield;
        FP.addChild(textfield);


        var sky2:egret.Bitmap = this.createBitmapByName("SP_JPG");
        SP.addChild(sky2);
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;
        sky2.width = stageW;
        sky2.height = stageH;
  
        var topMask3 = new egret.Shape();
        topMask3.graphics.beginFill(0xffffff, 0.6);
        topMask3.graphics.drawRect(0, 0, stageW,350 );
        topMask3.graphics.endFill();
        var topMask4 = new egret.Shape();
        topMask4.graphics.beginFill(0xffffff, 0.2);
        topMask4.graphics.drawRect(550, 0, 30, 1136);
        topMask4.graphics.endFill();
        topMask3.y = 80;
        topMask4.y = 80;
        SP.addChild(topMask3);
        SP.addChild(topMask4);

        var colorLabel21 = new egret.TextField();
        colorLabel21.textColor = 0x000000;
        colorLabel21.width = stageW - 172;
        colorLabel21.textAlign = "center";
        colorLabel21.text = "关于我";
        colorLabel21.fontFamily = "SimHei";
         //设置粗体与斜体
        colorLabel21.bold = true;
        colorLabel21.size = 30;
        colorLabel21.x = 240;
        colorLabel21.y = 92;
        SP.addChild(colorLabel21);
        var textfield21 = new egret.TextField();
        textfield21.text = "喜欢音乐、喜欢艺术、喜欢历史...";
        textfield21.width = stageW - 172;
        textfield21.fontFamily = "KaiTi";
        textfield21.size = 25;
        textfield21.textColor = 0x000000;
        textfield21.x = 190;
        textfield21.y = 135;
        SP.addChild(textfield21);
        var textfield22 = new egret.TextField();
        textfield22.text = "喜欢自然、喜欢美食、喜欢美的东西...";
        textfield22.width = stageW - 172;
        textfield22.fontFamily = "KaiTi";
        textfield22.size = 25;
        textfield22.textColor = 0x000000;
        textfield22.x = 140;
        textfield22.y = 160;
        SP.addChild(textfield22);
        var colorLabel22 = new egret.TextField();
        colorLabel22.textColor = 0x000000;
        colorLabel22.width = stageW - 172;
        colorLabel22.textAlign = "center";
        colorLabel22.text = "我学过的";
        colorLabel22.fontFamily = "SimHei";
         //设置粗体与斜体
        colorLabel22.bold = true;
        colorLabel22.size = 30;
        colorLabel22.x = 224;
        colorLabel22.y = 250;
        SP.addChild(colorLabel22);
        var textfield23 = new egret.TextField();
        textfield23.text = "PS、InDesign、CorelDRAW、Pr、会声会影、GoldWave、Nuendo、iebook、Flash...";
        textfield23.width = stageW - 172;
        textfield23.fontFamily = "KaiTi";
        textfield23.size = 25;
        textfield23.textColor = 0x000000;
        textfield23.x = 70;
        textfield23.y = 293;
        //设置右靠齐
        textfield23.textAlign = egret.HorizontalAlign.RIGHT;
        SP.addChild(textfield23);
        var textfield24 = new egret.TextField();
        textfield24.text = "3DsMax、Unity...";
        textfield24.width = stageW - 172;
        textfield24.fontFamily = "KaiTi";
        textfield24.size = 25;
        textfield24.textColor = 0x000000;
        textfield24.x = 70;
        textfield24.y = 343;
        textfield24.textAlign = egret.HorizontalAlign.RIGHT;
        SP.addChild(textfield24);
        var textfield25 = new egret.TextField();
        textfield25.text = "C语言、C++、Java、HTML...";
        textfield25.width = stageW - 172;
        textfield25.fontFamily = "KaiTi";
        textfield25.size = 25;
        textfield25.textColor = 0x000000;
        textfield25.x = 70;
        textfield25.y = 368;
        textfield25.textAlign = egret.HorizontalAlign.RIGHT;
        SP.addChild(textfield25);


        var OffsetY:number;//不在乎触发事件元素的定位属性
        var Y:number;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,BeginTurn,this);
        function BeginTurn(eTE:egret.TouchEvent):void{
            Y = eTE.stageY;
        }
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END,EndTurn,this);
        function EndTurn(eTE:egret.TouchEvent):void{
            OffsetY = Y - eTE.stageY;
            if(OffsetY > 100){
                egret.Tween.get(SP).to({ y: 0 }, 500, egret.Ease.sineIn);//缓动动画集合中选用sineIn
            }else if(OffsetY < -100){
                 egret.Tween.get(SP).to({ y: 1136 }, 500, egret.Ease.sineIn);
            }
        }
        
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description_json", this.startAnimation, this)
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result:Array<any>):void {
        var self:any = this;

        var parser = new egret.HtmlTextParser();
        var textflowArr:Array<Array<egret.ITextElement>> = [];
        for (var i:number = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }

        var textfield = self.textfield;

        var count = -1;
        var change:Function = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];

            self.changeDescription(textfield, lineArr);

            var tw = egret.Tween.get(textfield);
            tw.to({"alpha": 1}, 400);
            tw.wait(2000);
            tw.to({"alpha": 0}, 400);
            tw.call(change, self);
        };

        change();
    }

    /**
     * 切换描述内容
     * Switch to described content
     */
    private changeDescription(textfield:egret.TextField, textFlow:Array<egret.ITextElement>):void {
        textfield.textFlow = textFlow;
    }
}


