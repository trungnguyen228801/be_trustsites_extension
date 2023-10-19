try {
    let isDisplay = false;
    var expand = document.createElement('div');
    expand.setAttribute("title", "Show Dialog Insert Domain");
    expand.style.cssText = `box-sizing: border-box;width: 36px;bottom: 50%; right: 5px; position: fixed !important;z-index:999999999999999; width: 36px px ; background: #b7cff3; height: 36px; margin: 0 auto; text-align: center; box-shadow: 1px 1px 1px 0.2px #00317b; cursor: pointer;padding: 0px 6px;`;
    var imgExp = document.createElement('img');
    imgExp.style.cssText = `max-width: 25px; height: auto; padding: 0px; padding-top: 5px;border-radius: 0px;margin: 0 auto;`;
    imgExp.src = chrome.runtime.getURL('avatar_extension.png');
    expand.appendChild(imgExp);
    document.body.appendChild(expand);

    var ifrDiv = document.createElement('div');
    ifrDiv.style.setProperty('position', 'absolute', 'important');
    ifrDiv.style.setProperty('top', '50px', 'important');
    ifrDiv.style.setProperty('right', '100px', 'important');
    ifrDiv.style.setProperty('width', '350px', 'important');
    ifrDiv.style.setProperty('height', '676px', 'important');
    ifrDiv.style.setProperty('background-color', 'rgb(225, 225, 225)', 'important');
    ifrDiv.style.setProperty('box-shadow', 'rgb(204, 204, 204) 1px 1px 1px 1px', 'important');
    ifrDiv.style.setProperty('padding', '15px', 'important');
    ifrDiv.style.setProperty('cursor', 'move', 'important');
    ifrDiv.style.setProperty('box-sizing', 'border-box', 'important');
    ifrDiv.style.setProperty('z-index', '999999999999999', 'important');
    ifrDiv.style.setProperty('display', `${isDisplay == true ? 'block' : 'none'}`);
    document.body.appendChild(ifrDiv);
    // var pText = document.createElement('p');
    // pText.style.cssText = `color: rgb(153 153 153); font-size: 18px; font-weight: bold; text-align: center; margin: 0 auto; margin-bottom: 10px;`;
    // pText.innerHTML = `Drag & Move`;
    // ifrDiv.appendChild(pText);


    var iframe = document.createElement('iframe');
    iframe.id = 'ext-auto-iframe';
    iframe.src = chrome.runtime.getURL('popup.html');
    iframe.setAttribute('frameborder', 'no');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('allowtransparency', 'true');
    iframe.setAttribute('hidefocus', 'true');
    iframe.setAttribute('marginwidth', '0');
    iframe.setAttribute('marginheight', '0');
    iframe.setAttribute('topmargin', '0');
    iframe.setAttribute('leftmargin', '0');
    iframe.style.setProperty('width', '320px', 'important');
    iframe.style.setProperty('height', '646px', 'important');
    iframe.style.setProperty('position', 'absolute', 'important');
    iframe.style.setProperty('cursor', 'pointer', 'important');
    ifrDiv.appendChild(iframe);

    // Get the elements to attach listeners, 
    // to get info and to update positions:
    var container = document.body;
    var circle = ifrDiv;

    // "distX", "distY" will help us to know the distance
    // between the last position and the new, 
    // to keep the space between the click and the element, 
    // and of course, to move the element smooth
    var state = { distX: 0, distY: 0 };

    // These functions are declared outside of the elements
    // because they are going to be reused in two different
    // kind of events device: touch/mouse
    function onDown(e) {
        // Stop bubbling, this is important to avoid 
        // unexpected behaviours on mobile browsers:
        e.preventDefault();

        // Get the correct event source regardless the device:
        // Btw, "e.changedTouches[0]" in this case for simplicity 
        // sake we'll use only the first touch event
        // because we won't move more elements.
        var evt = e.type === 'touchstart' ? e.changedTouches[0] : e;

        // "Get the distance of the x/y", formula:
        // A: Get current position x/y of the circle. 
        // Example: circle.offsetLeft
        // B: Get the new position x/y. 
        // Example: evt.clientX
        // That's all.
        state.distX = Math.abs(circle.offsetLeft - evt.clientX);
        state.distY = Math.abs(circle.offsetTop - evt.clientY);

        // Disable pointer events in the circle to avoid
        // a bug whenever it's moving.
        circle.style.pointerEvents = 'none';
    };
    function onUp(e) {
        // Re-enable the "pointerEvents" in the circle element.
        // If this is not enabled, then the element won't move.
        circle.style.pointerEvents = 'initial';
    };
    function onMove(e) {
        // Update the position x/y of the circle element
        // only if the "pointerEvents" are disabled, 
        // (check the "onDown" function for more details.)
        if (circle.style.pointerEvents === 'none') {

            // Get the correct event source regardless the device:
            // Btw, "e.changedTouches[0]" in this case for simplicity 
            // sake we'll use only the first touch event
            // because we won't move more elements.
            var evt = e.type === 'touchmove' ? e.changedTouches[0] : e;

            // Update top/left directly in the dom element:
            circle.style.left = `${evt.clientX - state.distX}px`;
            circle.style.top = `${evt.clientY - state.distY}px`;
        };
    };

    // FOR MOUSE DEVICES:
    circle.addEventListener('mousedown', onDown);
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseup', onUp);

    // FOR TOUCH DEVICES:
    // circle.addEventListener('touchstart', onDown);
    container.addEventListener('touchmove', onMove);
    // container.addEventListener('touchend', onUp);

    var x = () => {
        var rect = ifrDiv.getBoundingClientRect();
        if (rect.top <= 0) {
            ifrDiv.style.setProperty("position", "fixed", "important");
            ifrDiv.style.setProperty("top", "100px", "important");
        }
    }

    window.addEventListener('scroll', () => {
        x();
    });

    if (expand) {
        expand.addEventListener("click", () => {
            if (ifrDiv) {
                if (isDisplay == false) {
                    ifrDiv.style.setProperty("display", "block");
                    expand.setAttribute("title", "Show Dialog Insert Domain")
                    isDisplay = true;
                } else {
                    expand.setAttribute("title", "Hide Dialog Insert Domain")
                    ifrDiv.style.setProperty("display", "none");
                    isDisplay = false;
                }
                x();
            }
        });
    }


} catch (error) {
    console.log(error);
}