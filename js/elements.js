riot.tag2('knot', '<circle ref="{keyName}" class="knot-style" each="{point,keyName in parent.points}" riot-cx="{point.x}" riot-cy="{point.y}" data-handler="{keyName}" onmousedown="{pullStart}"></circle>', 'knot .knot-style,[data-is="knot"] .knot-style{ fill: lavender; fill-opacity: 0.5; stroke: gray; stroke-width: 1px; vector-effect: non-scaling-stroke; r: 5; cursor: pointer; }', '', function(opts) {
        var tag = this;
        var polygon = tag.parent;
        var svgBox,offset;

        this.updateKnot = updateKnot;
        this.shift = shift;
        this.startShift = startShift;

        this.pullStart = pullStart;
        this.pull = pull;
        this.pullStop = pullStop;

        this.on("mount", function() {

            if(this.parent && this.parent.root.nearestViewportElement){
                svgbox = this.parent.root.nearestViewportElement;
                offset = svgbox.getBoundingClientRect();
            }

        })

        function updateKnot(knotName, newXY){
            tag.refs[knotName].setAttribute("cx", newXY.x);
            tag.refs[knotName].setAttribute("cy", newXY.y);
        }

        function shift( diffXY){
            var keys = Object.keys(this.parent.points);
            for(var i=0; i<keys.length; i++){
                var point = this.parent.points[ keys[i] ];
                point.x = this.initialState[  keys[i] ].x + diffXY.x;
                point.y = this.initialState[  keys[i] ].y + diffXY.y;
            }
            this.update();
        }

        function startShift(){
            this.initialState = clone( this.parent.points );
        }

        var knotInitialState;
        var selectedKnotId;

        function pullStart(e){
            selectedKnotId = e.target.dataset.handler;
            knotInitialState = clone( polygon.points[ selectedKnotId ] );
            polygon.moveStart( selectedKnotId );
            svgbox.addEventListener("mousemove", pull );
            svgbox.addEventListener("mouseup", pullStop );
        }

        function pull(e){
            polygon.move(e);
            updateKnot(selectedKnotId, {
                x: e.x - offset.x,
                y: e.y - offset.y
            })
        }

        function pullStop(e){
            polygon.moveStop();
            svgbox.removeEventListener("mousemove", pull );
            svgbox.removeEventListener("mouseup", pullStop );
        }

        function clone(obj){
            return JSON.parse(JSON.stringify( obj ));
        }
});
riot.tag2('r-path', '<path riot-d="{getPath()}" fill="rgba(100,200,200,0.2)" stroke="black"></path>', '', '', function(opts) {
        var height = 114;
        var width = 215;
        var width13 = width / 3;
        var width23 = 2 * width / 3;
        this.getPath = function() {
            return `M 10,10
                                c -11 0 -20 8 -20 19
                                l 0 ${height}
                                c 0 10 9 19 20 19
                                l ${width13} 0
                                l 2 20
                                l 20 -20
                                l ${width23} 0
                                c 11 0 20 -8 20 -19
                                l 0 -${height}
                                c 0 -10 -9 -19 -20 -19
                                z`
        }
});
riot.tag2('r-rect', '<rect ref="rect" onmousedown="{hold}" class="{draggable: draggable}"></rect> <g ref="knots" if="{resizable}" class="resize-handlers hide" data-is="knot"></g>', 'r-rect .draggable,[data-is="r-rect"] .draggable{ cursor: move; }', '', function(opts) {
        var tag = this;
        tag.myParent = tag.parent || opts._parent;
        tag.dragStart = false;
        tag.hold = hold;
        tag.drag = drag;
        tag.release = release;

        tag.initialState = {};

        tag.x= Number.parseInt(opts.x);
        tag.y= Number.parseInt(opts.y);
        tag.w= Number.parseInt(opts.width);
        tag.h= Number.parseInt(opts.height);

        tag._name= opts.name;
        tag.updatePosition = updatePosition;
        tag.setStartPosition = setStartPosition;
        tag.draggable = (opts.draggable || opts.draggable === "true");
        tag.resizable = ( opts.resizable || opts.resizable === "true");

        tag.on("mount", function(e) {
            tag.myParent = tag.myParent || tag.parent || tag.root.parentNode;

            if(tag.myParent){
                if(tag.myParent.root){
                    tag.offset = {
                        x: tag.myParent.root.offsetLeft,
                        y: tag.myParent.root.offsetTop,
                    }
                    tag.myParentNode = tag.myParent.root;
                }else{
                    if(tag.myParent.tagName === "g"){
                        tag.myParent = tag.myParent.nearestViewportElement;
                    }
                    tag.offset = tag.myParent.getBoundingClientRect();
                    tag.myParentNode = tag.myParent;
                }
            }
            tag.refs.rect.setAttribute("x", opts.x);
            tag.refs.rect.setAttribute("y", opts.y);
            tag.refs.rect.setAttribute("width", tag.w);
            tag.refs.rect.setAttribute("height", tag.h);
            opts.rx && (tag.refs.rect.setAttribute("rx", opts.rx) );
            opts.ry && (tag.refs.rect.setAttribute("ry", opts.ry) );
            if(tag.resizable){
                positionKnots();
            }
        })

        function positionKnots(){
            tag.points = {

                "se" : {
                    x: tag.x + tag.w,
                    y: tag.y + tag.h
                },

            };

            tag.refs.knots.update();
        }

        var dragHandler;

        tag.moveStart = ( knotName) =>{
            tag.initialState = {
                x : tag.x,
                y : tag.y,
                w : tag.w,
                h : tag.h
            };
            dragHandler = tag[knotName];
        }

        tag.move = ( cursor ) =>{
            dragHandler && dragHandler(cursor);
        }

        tag.moveStop = ( cursor ) => {

        }

        tag.se = function (cursor) {
            var x = tag.initialState.x;
            var y = tag.initialState.y;

            var cursorOffset = {
                x: cursor.x - tag.offset.x,
                y: cursor.y - tag.offset.y
            }
            if (cursorOffset.x < x) {
                x = cursorOffset.x;
            }
            if (cursorOffset.y < y) {
                y = cursorOffset.y;
            }

            updateState(tag.refs.rect,{
                x: x,
                y: y,
                w: Math.abs(cursorOffset.x - tag.initialState.x) ,
                h: Math.abs(cursorOffset.y - tag.initialState.y) ,
            });
        }

        function updateState(el, state){
            tag.x =  state.x;
            tag.y =  state.y;
            tag.w =  state.w;
            tag.h =  state.h;

            el.setAttribute("x", state.x);
            el.setAttribute("y", state.y);
            el.setAttribute("width", state.w);
            el.setAttribute("height", state.h);
        }

        function updatePosition(cursor){

            var diff = {
                x:  cursor.x - tag.cursorStartPosition.x,
                y: cursor.y - tag.cursorStartPosition.y
            }

            tag.x = tag.beforeStart.x + diff.x;
            tag.y = tag.beforeStart.y + diff.y;

            tag.refs.rect.setAttribute("x", tag.x);
            tag.refs.rect.setAttribute("y", tag.y);

            if(tag.resizable){
                tag.refs.knots.shift(diff);
            }

        }

        function setStartPosition(e){
            tag.beforeStart = {
                x: tag.x,
                y: tag.y
            };
            tag.cursorStartPosition = {
                x: e.x,
                y: e.y
            };
        }

        function hold(e){
            if(tag.resizable){
                tag.refs.knots.startShift();
            }
            tag.setStartPosition(e);

            if(tag.draggable){
                dragHandler = drag;

                tag.myParentNode.addEventListener("mousemove", drag);
                tag.myParentNode.addEventListener("mouseup", release);

                e.stopPropagation();
            }
        }

        function drag(e){
            tag.updatePosition(e);
        }

        function release(e){
            tag.myParentNode.removeEventListener("mousemove", dragHandler);
            tag.myParentNode.removeEventListener("mouseup", release);
        }

});
riot.tag2('r-svg', '<svg ref="svgbox" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" onmousedown="{createElement}"> <yield></yield> </svg>', '', '', function(opts) {

        var currentTag;
        this.createElement = function(e){
            if(toolName === "r-rect"){
                var tag = document.createElementNS("http://www.w3.org/2000/svg",'g');
                this.refs.svgbox.appendChild(tag);
                currentTag = riot.mount(tag, "r-rect", {
                    _parent : this,
                    "data-is" : this,
                    x: e.x  - this.root.offsetLeft,
                    y: e.y  - this.root.offsetTop,
                    width: 0,
                    height: 0,
                    draggable : true,
                    resizable: true
                });
                this.root.addEventListener("mouseup", () => {toolName = "";} );
            }
        }.bind(this)

        this.dragToCreate = function(e){
            currentTag.update(e.x, e.y);
        }.bind(this)

});