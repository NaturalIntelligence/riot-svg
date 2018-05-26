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
riot.tag2('rold-rect', '<rect ref="rect" onmousedown="{hold}"></rect>', '', '', function(opts) {
            tag = this;
            tag.diffX = 0;
            tag.diffY = 0;
            tag.dragStart = false;
            tag.hold = hold;
            tag.drag = drag;
            tag.release = release;
            tag.x= Number.parseInt(opts.x);
            tag.y= Number.parseInt(opts.y);
            tag.updatePosition = updatePosition;
            tag.setStartPosition = setStartPosition;

            tag.on("mount", function(e) {
                console.log(tag)
                tag.refs.rect.setAttribute("x", opts.x);
                tag.refs.rect.setAttribute("y", opts.y);
                tag.refs.rect.setAttribute("width", opts.width);
                tag.refs.rect.setAttribute("height", opts.height);
                opts.rx && (tag.refs.rect.setAttribute("rx", opts.rx) );
                opts.ry && (tag.refs.rect.setAttribute("ry", opts.ry) );
            })

            function updatePosition(cursor){

                var x = (cursor.x - tag.diffX);
                var y = (cursor.y - tag.diffY);

                cursor.target.setAttribute("x", x);
                cursor.target.setAttribute("y", y);

            }

            function setStartPosition(cursor){
                tag.diffX = cursor.x - tag.x;
                tag.diffY = cursor.y - tag.y;
            }

            function hold(e){
                if(opts.draggable === "true"){
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
riot.tag2('r-rect', '<rect ref="rect" onmousedown="{hold}" class="{draggable: draggable}"></rect>', 'r-rect .draggable,[data-is="r-rect"] .draggable{ cursor: move; }', '', function(opts) {
        var tag = this;
        tag.diffX = 0;
        tag.diffY = 0;
        tag.dragStart = false;
        tag.hold = hold;
        tag.drag = drag;
        tag.release = release;
        tag.x= Number.parseInt(opts.x);
        tag.y= Number.parseInt(opts.y);
        tag._name= opts.name;
        tag.updatePosition = updatePosition;
        tag.setStartPosition = setStartPosition;
        tag.draggable = opts.draggable === "true";

        tag.on("mount", function(e) {
            tag.refs.rect.setAttribute("x", opts.x);
            tag.refs.rect.setAttribute("y", opts.y);
            tag.refs.rect.setAttribute("width", opts.width);
            tag.refs.rect.setAttribute("height", opts.height);
            opts.rx && (tag.refs.rect.setAttribute("rx", opts.rx) );
            opts.ry && (tag.refs.rect.setAttribute("ry", opts.ry) );

        })

        function updatePosition(cursor){

            tag.x = (cursor.x - tag.diffX);
            tag.y = (cursor.y - tag.diffY);

            cursor.target.setAttribute("x", tag.x);
            cursor.target.setAttribute("y", tag.y);

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