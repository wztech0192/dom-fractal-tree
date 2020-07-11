/** Tree Options */
var treeOptions = {
    height: createOption(120, 10, 300),
    width: createOption(50, 10, 200),
    heightGap: createOption(1, 0, 2, 0.05),
    widthGap: createOption(0, 0, 100),
    rotate: createOption(30, 0, 180),
    borderRadius: createOption(0, 0, 50),
};
var maxLevel = 9;
var id = 0;
var root = (function generateNode(level) {
    var node = {
        el: document.createElement("div"),
        level: level,
        branches: [],
    };
    var nodeID = "node-" + id++;
    node.el.setAttribute("track-global-click", nodeID);
    node.el.setAttribute("class", "node");
    node.el.setAttribute("title", nodeID);
    if (level < maxLevel) {
        node.branches.push(generateNode(level + 1));
        node.branches.push(generateNode(level + 1));
    }
    return node;
})(1);

function createOption(defaultValue, min, max, step) {
    return {
        value: defaultValue,
        min: min,
        max: max,
        step: step || 1,
    };
}

/** Tree generate */
window.onload = function () {
    var panel = document.getElementById("action_panel");
    var container = document.getElementById("tree_container");

    for (var key in treeOptions) {
        var slider = document.createElement("input");
        slider.setAttribute("type", "range");
        slider.setAttribute("id", key);
        for (var optionKey in treeOptions[key]) {
            slider.setAttribute(optionKey, treeOptions[key][optionKey]);
        }

        slider.oninput = function () {
            treeOptions[this.getAttribute("id")].value = parseFloat(this.value);
            mapTree();
        };

        var div = document.createElement("div");
        div.appendChild(document.createTextNode(key));
        div.appendChild(slider);
        panel.appendChild(div);
    }

    function mapTree() {
        updateBranch(root, window.innerWidth / 2, 100, 0);
    }

    function updateBranch(node, px, py, rotate) {
        if (!node.appended) {
            container.appendChild(node.el);
            node.appended = true;
        }
        var levelRatio = (maxLevel - node.level + 1) / maxLevel;
        var nh = treeOptions.height.value * levelRatio;
        var nw = treeOptions.width.value * levelRatio;
        var radians = (Math.PI / 180) * rotate,
            cy = py - nh,
            cx = px,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            rx = cos * (px - cx) + sin * (py - cy) + cx,
            ry = cos * (py - cy) - sin * (px - cx) + cy;
        px = rx;
        py = ry;
        node.el.style.height = nh + "px";
        node.el.style.width = nw + "px";
        node.el.style.left = px - nw / 2 + "px";
        node.el.style.bottom = py + "px";
        node.el.style.transform = "rotate(" + rotate + "deg)";
        node.el.style.borderRadius = treeOptions.borderRadius.value + "px";
        var direction = 1;
        for (var i = 0; i < node.branches.length; i++) {
            updateBranch(
                node.branches[i],
                px + treeOptions.widthGap.value * direction,
                py + treeOptions.heightGap.value * nh,
                rotate + treeOptions.rotate.value * direction
            );
            direction *= -1;
        }
    }
    mapTree();
};
