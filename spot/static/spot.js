document.addEventListener("DOMContentLoaded", function() {
    
    document.querySelectorAll('.task-checkbox').forEach(btn => {
        var parent = btn.parentNode.parentNode;
        console.log(parent.classList);
        
        btn.addEventListener("click", () => {
            if (parent.classList.contains("white")) {
                parent.classList.remove('white');
                parent.classList.add('green');
                fetch(`/event/${btn.dataset.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        completed: true
                    })
                });
            } else if (parent.classList.contains("red")) {
                parent.classList.remove('red');
                parent.classList.add('green');
                fetch(`/event/${btn.dataset.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        completed: true
                    })
                });
            } else {
                parent.classList.remove('green');
                parent.classList.add('white');
                console.log(btn.dataset.id);
                fetch(`/event/${btn.dataset.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        completed: false
                    })
                });
            }
        })
    })

    // Drawing on canvas

    document.querySelectorAll(".sketch").forEach(div => {
        var canvas = div.childNodes[1];
        var ctx = canvas.getContext('2d');
        var sketch = div;
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));
    
        var mouse = {x: 0, y: 0};
        var last_mouse = {x: 0, y: 0};
    
        /* Mouse Capturing Work */
        canvas.addEventListener('pointermove', function(e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;
    
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);
    
    
        /* Drawing on Paint App */

        console.log("hi");

        document.querySelector(".draw").addEventListener("click", () => {
            console.log("draw");
            ctx.strokeStyle = "black";
        });
        document.querySelector(".erase").addEventListener("click", () => {
            console.log("erase");
            ctx.strokeStyle = "white";
        });
        document.querySelector(".clear").addEventListener("click", () => {
            console.log("clear");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.canvas.style.touchAction = "none";
        ctx.strokeStyle = "black";
    
        canvas.addEventListener('pointerdown', function(e) {
            canvas.addEventListener('pointermove', onPaint, false);
        }, false);
    
        canvas.addEventListener('pointerup', function() {
            canvas.removeEventListener('pointermove', onPaint, false);
        }, false);
    
        var onPaint = function() {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();
        };
    
    })
    
})