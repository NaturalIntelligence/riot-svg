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
riot.tag2('r-rect', '<rect ref="rect" onmousedown="{hold}" class="{draggable: draggable}"></rect> <g if="{resizable}" class="resize-handlers hide"> <circle class="resize-handler" ref="nw" data-handler="nw" onmousedown="{holdTheHandler}"></circle> <circle class="resize-handler" ref="ne" data-handler="ne" onmousedown="{holdTheHandler}"></circle> <circle class="resize-handler" ref="sw" data-handler="sw" onmousedown="{holdTheHandler}"></circle> <circle class="resize-handler" ref="se" data-handler="se" onmousedown="{holdTheHandler}"></circle> </g>', 'r-rect .draggable,[data-is="r-rect"] .draggable{ cursor: move; } r-rect .resize-handler,[data-is="r-rect"] .resize-handler{ fill: lavender; fill-opacity: 0.5; stroke: gray; stroke-width: 1px; vector-effect: non-scaling-stroke; r: 5; cursor: pointer; }', '', function(opts) {
        var tag = this;
        tag.myParent = tag.parent || opts._parent;
        tag.diffX = 0;
        tag.diffY = 0;
        tag.dragStart = false;
        tag.hold = hold;
        tag.drag = drag;
        tag.release = release;

        tag.initialState = {};
        tag.holdTheHandler = holdTheHandler;

        tag.selectRect = selectRect;

        tag.x= Number.parseInt(opts.x);
        tag.y= Number.parseInt(opts.y);
        tag.w= Number.parseInt(opts.width);
        tag.h= Number.parseInt(opts.height);
        tag._name= opts.name;
        tag.updatePosition = updatePosition;
        tag.setStartPosition = setStartPosition;
        tag.setResizeHandlersPosition = setResizeHandlersPosition;
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
            tag.setResizeHandlersPosition();

        })

        function setResizeHandlersPosition(){
            if(tag.resizable){

                tag.refs.ne.setAttribute("cx", tag.x + tag.w);
                tag.refs.ne.setAttribute("cy", tag.y);

                tag.refs.se.setAttribute("cx", tag.x + tag.w);
                tag.refs.se.setAttribute("cy", tag.y + tag.h);

                tag.refs.nw.setAttribute("cx", tag.x);
                tag.refs.nw.setAttribute("cy", tag.y);

                tag.refs.sw.setAttribute("cx", tag.x);
                tag.refs.sw.setAttribute("cy", tag.y + tag.h);
            }
        }

        function selectRect(e){

        }

        var dragHandler;

        function holdTheHandler(e){
            tag.initialState = {
                x : tag.x,
                y : tag.y,
                w : tag.w,
                h : tag.h
            }
            if(tag.resizable){
                dragHandler = tag[e.target.dataset.handler];

                tag.myParentNode.addEventListener("mousemove", tag[e.target.dataset.handler] );
                tag.myParentNode.addEventListener("mouseup", release);

                e.stopPropagation();

            }
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
            tag.setResizeHandlersPosition();
        }

        function updatePosition(cursor){

            tag.x = (cursor.x - tag.diffX);
            tag.y = (cursor.y - tag.diffY);

            tag.refs.rect.setAttribute("x", tag.x);
            tag.refs.rect.setAttribute("y", tag.y);

            tag.setResizeHandlersPosition();

        }

        function setStartPosition(cursor){
            tag.diffX = cursor.x - tag.x;
            tag.diffY = cursor.y - tag.y;
        }

        function hold(e){
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