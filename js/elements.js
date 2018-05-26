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
riot.tag2('r-rect', '<rect ref="rect" onmousedown="{hold}" class="{draggable: draggable}"></rect> <g if="{resizable}" class="resize-handlers"> <circle class="resize-handler nw" ref="nw"></circle> <circle class="resize-handler n" ref="n"></circle> <circle class="resize-handler ne" ref="ne"></circle> <circle class="resize-handler w" ref="w"></circle> <circle class="resize-handler e" ref="e"></circle> <circle class="resize-handler sw" ref="sw"></circle> <circle class="resize-handler s" ref="s"></circle> <circle class="resize-handler se" ref="se"></circle> </g>', 'r-rect .draggable,[data-is="r-rect"] .draggable{ cursor: move; } r-rect .resize-handler,[data-is="r-rect"] .resize-handler{ fill: lavender; fill-opacity: 0.5; stroke: gray; stroke-width: 1px; vector-effect: non-scaling-stroke; r: 5 } r-rect .ne,[data-is="r-rect"] .ne{ cursor: nesw-resize} r-rect .n,[data-is="r-rect"] .n{ cursor: row-resize} r-rect .nw,[data-is="r-rect"] .nw{ cursor: nwse-resize} r-rect .e,[data-is="r-rect"] .e{ cursor: col-resize} r-rect .w,[data-is="r-rect"] .w{ cursor: col-resize} r-rect .se,[data-is="r-rect"] .se{ cursor: nwse-resize} r-rect .s,[data-is="r-rect"] .s{ cursor: row-resize} r-rect .sw,[data-is="r-rect"] .sw{ cursor: nesw-resize}', '', function(opts) {
        var tag = this;
        tag.diffX = 0;
        tag.diffY = 0;
        tag.dragStart = false;
        tag.hold = hold;
        tag.drag = drag;
        tag.release = release;
        tag.x= Number.parseInt(opts.x);
        tag.y= Number.parseInt(opts.y);
        tag.w= Number.parseInt(opts.width);
        tag.h= Number.parseInt(opts.height);
        tag._name= opts.name;
        tag.updatePosition = updatePosition;
        tag.setStartPosition = setStartPosition;
        tag.setResizeHandlersPosition = setResizeHandlersPosition;
        tag.draggable = opts.draggable === "true";
        tag.resizable = opts.resizable === "true";

        tag.on("mount", function(e) {
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

                tag.refs.e.setAttribute("cx", tag.x + tag.w);
                tag.refs.e.setAttribute("cy", tag.y + tag.h /2);

                tag.refs.se.setAttribute("cx", tag.x + tag.w);
                tag.refs.se.setAttribute("cy", tag.y + tag.h);

                tag.refs.n.setAttribute("cx", tag.x + tag.w / 2);
                tag.refs.n.setAttribute("cy", tag.y);

                tag.refs.s.setAttribute("cx", tag.x + tag.w / 2);
                tag.refs.s.setAttribute("cy", tag.y + tag.h);

                tag.refs.nw.setAttribute("cx", tag.x);
                tag.refs.nw.setAttribute("cy", tag.y);

                tag.refs.w.setAttribute("cx", tag.x);
                tag.refs.w.setAttribute("cy", tag.y + tag.h /2);

                tag.refs.sw.setAttribute("cx", tag.x);
                tag.refs.sw.setAttribute("cy", tag.y + tag.h);
            }
        }

        function updatePosition(cursor){

            tag.x = (cursor.x - tag.diffX);
            tag.y = (cursor.y - tag.diffY);

            cursor.target.setAttribute("x", tag.x);
            cursor.target.setAttribute("y", tag.y);

            tag.setResizeHandlersPosition();

        }

        function setStartPosition(cursor){
            tag.diffX = cursor.x - tag.x;
            tag.diffY = cursor.y - tag.y;
        }

        function hold(e){
            if(tag.draggable){
                tag.setStartPosition(e);
                e.target.addEventListener("mousemove", drag);
                e.target.addEventListener("mouseup", release);
            }
        }

        function drag(e){
            tag.updatePosition(e);
        }

        function release(e){
            e.target.removeEventListener("mousemove", drag);
            e.target.removeEventListener("mouseup", release);;
        }

});
riot.tag2('r-svg', '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <yield></yield> </svg>', '', '', function(opts) {
});